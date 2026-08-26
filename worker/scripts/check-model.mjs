const key = process.env.NVIDIA_API_KEY;
const model = process.env.NVIDIA_MODEL || "stepfun-ai/step-3.7-flash";
if (!key) throw new Error("NVIDIA_API_KEY is required for model verification");
const response = await fetch("https://integrate.api.nvidia.com/v1/models", { headers: { Authorization: `Bearer ${key}` }, signal: AbortSignal.timeout(8000) });
if (!response.ok) throw new Error(`NVIDIA model catalog returned ${response.status}`);
const payload = await response.json();
if (!payload.data?.some((entry) => entry.id === model)) throw new Error(`Required NVIDIA model is unavailable: ${model}`);

const completion = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
  method: "POST",
  headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
  body: JSON.stringify({ model, messages: [{ role: "user", content: 'Return only JSON: {"ok":true}' }], temperature: 0, max_tokens: 32, response_format: { type: "json_object" } }),
  signal: AbortSignal.timeout(12000),
});
if (!completion.ok) throw new Error(`NVIDIA model generation returned ${completion.status}`);
const result = await completion.json();
const text = result?.choices?.[0]?.message?.content;
const json = typeof text === "string" ? text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1) : "";
if (!json || JSON.parse(json).ok !== true) throw new Error(`NVIDIA model generation check returned an invalid response: ${model}`);
console.log(`NVIDIA model catalog and generation verified: ${model}`);
