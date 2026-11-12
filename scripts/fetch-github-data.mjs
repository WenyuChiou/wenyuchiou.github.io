#!/usr/bin/env node
/* Refresh the star and fork counts the homepage tiles are drawn from (data/github.json).
   The repository list is the file's own keys. `--check` compares without writing. */
import { readFileSync, writeFileSync } from "node:fs";

const path = "data/github.json";
const current = JSON.parse(readFileSync(path, "utf8"));
const owner = current.owner;
const names = Object.keys(current.repositories);
if (!names.length) throw new Error("GitHub snapshot lists no repositories");
if (names.some((name) => !/^[A-Za-z0-9._-]+$/.test(name))) throw new Error("GitHub snapshot contains an unsafe repository name");
const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
const checkOnly = process.argv.includes("--check");
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
  if (!Number.isInteger(repo.stargazers_count) || !Number.isInteger(repo.forks_count)) throw new Error(`GitHub API returned no counts for ${owner}/${name}`);
  repositories[name] = { stars: repo.stargazers_count, forks: repo.forks_count, url: repo.html_url };
}

if (checkOnly) {
  if (JSON.stringify(current.repositories) !== JSON.stringify(repositories)) {
    console.error("GitHub snapshot is stale. Run npm run refresh:github.");
    process.exit(1);
  }
  console.log("GitHub snapshot matches the API.");
} else {
  writeFileSync(path, `${JSON.stringify({ checkedAt: new Date().toISOString(), owner, repositories }, null, 2)}\n`);
  console.log(`Updated ${path} for ${names.length} repositories.`);
}
