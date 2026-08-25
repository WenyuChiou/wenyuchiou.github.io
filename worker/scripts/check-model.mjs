const key = process.env.NVIDIA_API_KEY;
const model = process.env.NVIDIA_MODEL || "meta/llama-3.1-8b-instruct";
if (!key) throw new Error("NVIDIA_API_KEY is required for model verification");
const response = await fetch("https://integrate.api.nvidia.com/v1/models", { headers: { Authorization: `Bearer ${key}` }, signal: AbortSignal.timeout(8000) });
if (!response.ok) throw new Error(`NVIDIA model catalog returned ${response.status}`);
const payload = await response.json();
if (!payload.data?.some((entry) => entry.id === model)) throw new Error(`Required NVIDIA model is unavailable: ${model}`);
console.log(`NVIDIA model verified: ${model}`);
