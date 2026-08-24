#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";

const path = "data/github.json";
const current = JSON.parse(readFileSync(path, "utf8"));
const owner = current.owner;
const names = Object.keys(current.repositories);
const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
const headers = {
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
  "User-Agent": "wenyuchiou-portfolio-data-refresh",
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
};

const repositories = {};
for (const name of names) {
  const response = await fetch(`https://api.github.com/repos/${owner}/${name}`, { headers });
  if (!response.ok) throw new Error(`GitHub API ${response.status} for ${owner}/${name}`);
  const repo = await response.json();
  repositories[name] = { stars: repo.stargazers_count, forks: repo.forks_count, url: repo.html_url };
}

const next = { checkedAt: new Date().toISOString(), owner, repositories };
const serialized = `${JSON.stringify(next, null, 2)}\n`;
if (process.argv.includes("--check")) {
  const before = JSON.stringify(current.repositories);
  const after = JSON.stringify(next.repositories);
  if (before !== after) {
    console.error("GitHub snapshot is stale. Run npm run refresh:github.");
    process.exit(1);
  }
  console.log("GitHub snapshot matches the API.");
} else {
  writeFileSync(path, serialized);
  console.log(`Updated ${path} for ${names.length} repositories.`);
}
