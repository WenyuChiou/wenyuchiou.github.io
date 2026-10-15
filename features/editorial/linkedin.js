export function linkedInEmbedSource(value) {
  if (typeof value !== "string" || value.length > 160) return null;
  try {
    const url = new URL(value);
    if (url.origin !== "https://www.linkedin.com" || url.username || url.password || url.search || url.hash) return null;
    if (!/^\/embed\/feed\/update\/urn:li:(share|ugcPost):\d{19}$/.test(url.pathname)) return null;
    return url.href;
  } catch {
    return null;
  }
}
