import { env } from "./node_modules/@huggingface/transformers/src/env.js";
import { BertModel } from "./node_modules/@huggingface/transformers/src/models/bert/modeling_bert.js";
import { BertTokenizer } from "./node_modules/@huggingface/transformers/src/models/bert/tokenization_bert.js";

export { env };

const toRows = (tensor, attentionMask, pooling, normalize) => {
  const [batchSize, sequenceLength, hiddenSize] = tensor.dims;
  const rows = [];

  for (let batch = 0; batch < batchSize; batch += 1) {
    const row = new Array(hiddenSize).fill(0);
    let tokenCount = 0;
    for (let token = 0; token < sequenceLength; token += 1) {
      const maskIndex = (batch * sequenceLength) + token;
      if (pooling === "mean" && Number(attentionMask.data[maskIndex]) === 0) continue;
      tokenCount += 1;
      const tensorIndex = ((batch * sequenceLength) + token) * hiddenSize;
      for (let hidden = 0; hidden < hiddenSize; hidden += 1) {
        row[hidden] += tensor.data[tensorIndex + hidden];
      }
      if (pooling !== "mean") break;
    }
    if (pooling === "mean" && tokenCount > 0) {
      for (let hidden = 0; hidden < hiddenSize; hidden += 1) row[hidden] /= tokenCount;
    }
    if (normalize) {
      const magnitude = Math.sqrt(row.reduce((sum, value) => sum + (value * value), 0)) || 1;
      for (let hidden = 0; hidden < hiddenSize; hidden += 1) row[hidden] /= magnitude;
    }
    rows.push(row);
  }
  return rows;
};

export async function pipeline(task, modelId, options = {}) {
  if (task !== "feature-extraction") throw new Error(`Unsupported pipeline: ${task}`);
  const loadOptions = {
    dtype: options.dtype,
    revision: options.revision,
    progress_callback: options.progress_callback,
  };
  const [tokenizer, model] = await Promise.all([
    BertTokenizer.from_pretrained(modelId, loadOptions),
    BertModel.from_pretrained(modelId, loadOptions),
  ]);

  return async (texts, { pooling = "mean", normalize = false } = {}) => {
    if (pooling !== "mean") throw new Error(`Unsupported pooling: ${pooling}`);
    const inputs = tokenizer(texts, { padding: true, truncation: true });
    const outputs = await model(inputs);
    const rows = toRows(outputs.last_hidden_state, inputs.attention_mask, pooling, normalize);
    return { tolist: () => rows };
  };
}
