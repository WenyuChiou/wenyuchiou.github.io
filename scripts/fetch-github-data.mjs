#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, readdirSync, unlinkSync, writeFileSync } from "node:fs";
import sharp from "sharp";

const path = "data/github.json";
const previewDirectory = "assets/github";
const current = JSON.parse(readFileSync(path, "utf8"));
const owner = current.owner;
const names = Object.keys(current.repositories);
if (names.some((name) => !/^[A-Za-z0-9._-]+$/.test(name))) throw new Error("GitHub snapshot contains an unsafe repository name");
const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
const checkOnly = process.argv.includes("--check");
const headers = {
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
  "User-Agent": "wenyuchiou-portfolio-data-refresh",
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
};

async function fetchPreviewSourceUrl(name) {
  if (!token) return current.repositories[name]?.previewSourceUrl ?? null;
  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({
      query: "query RepositoryPreview($owner: String!, $name: String!) { repository(owner: $owner, name: $name) { openGraphImageUrl } }",
      variables: { owner, name },
    }),
  });
  if (!response.ok) throw new Error(`GitHub GraphQL API ${response.status} for ${owner}/${name}`);
  const payload = await response.json();
  if (payload.errors?.length) throw new Error(`GitHub GraphQL error for ${owner}/${name}: ${payload.errors.map((error) => error.message).join("; ")}`);
  const value = payload.data?.repository?.openGraphImageUrl;
  if (!value) return null;
  const url = new URL(value);
  return url.protocol === "https:" && url.hostname === "repository-images.githubusercontent.com" ? url.href : null;
}

let previewAssetsStale = false;
async function syncPreviewImage(name, sourceUrl) {
  const assetPath = `${previewDirectory}/${name}.webp`;
  if (!token) {
    if (!existsSync(assetPath)) throw new Error(`${assetPath} is missing; authenticate to refresh GitHub previews`);
    return;
  }
  const response = await fetch(sourceUrl, { headers: { "User-Agent": headers["User-Agent"] }, redirect: "error" });
  if (!response.ok) throw new Error(`GitHub preview image ${response.status} for ${owner}/${name}`);
  const contentType = response.headers.get("content-type")?.split(";", 1)[0];
  if (!new Set(["image/jpeg", "image/png", "image/webp"]).has(contentType)) throw new Error(`Unexpected preview content type ${contentType} for ${owner}/${name}`);
  const optimized = await sharp(Buffer.from(await response.arrayBuffer()))
    .resize(640, 320, { fit: "cover" })
    .webp({ quality: 82, effort: 4 })
    .toBuffer();
  if (checkOnly) {
    previewAssetsStale ||= !existsSync(assetPath) || !readFileSync(assetPath).equals(optimized);
  } else {
    mkdirSync(previewDirectory, { recursive: true });
    writeFileSync(assetPath, optimized);
  }
}

const repositories = {};
for (const name of names) {
  const response = await fetch(`https://api.github.com/repos/${owner}/${name}`, { headers });
  if (!response.ok) throw new Error(`GitHub API ${response.status} for ${owner}/${name}`);
  const repo = await response.json();
  const previewSourceUrl = await fetchPreviewSourceUrl(name);
  const previewUrl = previewSourceUrl ? `/assets/github/${name}.webp` : null;
  if (previewSourceUrl) {
    await syncPreviewImage(name, previewSourceUrl);
  } else {
    const assetPath = `${previewDirectory}/${name}.webp`;
    if (checkOnly) previewAssetsStale ||= existsSync(assetPath);
    else if (existsSync(assetPath)) unlinkSync(assetPath);
  }
  repositories[name] = { stars: repo.stargazers_count, forks: repo.forks_count, url: repo.html_url, previewUrl, previewSourceUrl };
}

const expectedPreviewAssets = new Set(Object.values(repositories).map((repo) => repo.previewUrl?.slice(1)).filter(Boolean));
if (existsSync(previewDirectory)) {
  for (const entry of readdirSync(previewDirectory, { withFileTypes: true })) {
    const assetPath = `${previewDirectory}/${entry.name}`;
    if (!entry.isFile() || !entry.name.endsWith(".webp") || expectedPreviewAssets.has(assetPath)) continue;
    if (checkOnly) previewAssetsStale = true;
    else unlinkSync(assetPath);
  }
}

const next = { checkedAt: new Date().toISOString(), owner, repositories };
const serialized = `${JSON.stringify(next, null, 2)}\n`;
if (checkOnly) {
  const before = JSON.stringify(current.repositories);
  const after = JSON.stringify(next.repositories);
  if (before !== after || previewAssetsStale) {
    console.error("GitHub snapshot is stale. Run npm run refresh:github.");
    process.exit(1);
  }
  console.log("GitHub snapshot matches the API.");
} else {
  writeFileSync(path, serialized);
  console.log(`Updated ${path} for ${names.length} repositories.`);
}
