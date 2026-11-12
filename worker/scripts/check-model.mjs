import { readFile } from "node:fs/promises";
import { buildNavigatorRequest, parseNvidiaContent, validateNvidiaPayload } from "../src/index.js";

const key = process.env.NVIDIA_API_KEY;
const config = JSON.parse(await readFile(new URL("../wrangler.jsonc", import.meta.url), "utf8"));
const model = config.vars?.NVIDIA_MODEL;
if (!model || (process.env.NVIDIA_MODEL && process.env.NVIDIA_MODEL !== model)) throw new Error("NVIDIA_MODEL must match the deployment configuration");
if (!key) throw new Error("NVIDIA_API_KEY is required for model verification");
const response = await fetch("https://integrate.api.nvidia.com/v1/models", { headers: { Authorization: `Bearer ${key}` }, signal: AbortSignal.timeout(8000) });
if (!response.ok) throw new Error(`NVIDIA model catalog returned ${response.status}`);
const payload = await response.json();
if (!payload.data?.some((entry) => entry.id === model)) throw new Error(`Required NVIDIA model is unavailable: ${model}`);

for (const locale of ["en", "zh-TW"]) {
  const completion = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify(buildNavigatorRequest(locale === "en" ? "How does Wenyu evaluate LLM decisions against human behavior?" : "Wenyu 如何以人類行為證據評估 LLM 決策？", locale, model)),
    signal: AbortSignal.timeout(8000),
  });
  if (!completion.ok) throw new Error(`NVIDIA model generation returned ${completion.status}`);
  const result = await completion.json();
  const text = result?.choices?.[0]?.message?.content;
  validateNvidiaPayload(parseNvidiaContent(text), locale);
  console.log(`NVIDIA grounded generation verified: ${model} (${locale})`);
}
console.log(`NVIDIA model catalog and generation verified: ${model}`);
