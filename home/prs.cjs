/* Pull requests merged into other people's projects, grouped by project.
   The list is a dated snapshot (data/merged-prs.json); the one-line summaries below are written by hand,
   so a merged PR in a project without a summary stops the build instead of showing up unexplained. */
const fs = require("fs"), path = require("path");
const data = JSON.parse(fs.readFileSync(path.join(__dirname, "data/merged-prs.json"), "utf8"));
const DID = {
  "morluto/rea": ["Bug fixes across evidence tracking, JavaScript and Electron analysis, LLDB, ADB and the CLI.", "修 bug：證據追蹤、JavaScript 與 Electron 分析、LLDB、ADB 和 CLI。"],
  "ZhuLinsen/daily_stock_analysis": ["Added Taiwan market support: market detection and routing, the 三大法人 institutional-flow data, and its place in the report and the LLM prompt.", "加上台股支援：市場判斷與路由、三大法人資料，並放進報告和 LLM prompt。"],
  "BuilderIO/agent-native": ["Fixed a CLI crash when the engine is set to Codex CLI, and broken references in the docs.", "修掉引擎設成 Codex CLI 時的當機，還有文件裡失效的連結。"],
  "langchain-ai/openwiki": ["Interrupted runs now get retried, and the config folder is locked down on Windows.", "中斷的執行會重試；Windows 上的設定資料夾權限收緊。"],
  "Nanako0129/coralline": ["Fixed line wrapping in the auto layout: it now measures display width, not bytes.", "修正自動排版的換行：改用顯示寬度計算，不是位元組數。"],
  "NVIDIA/skills": ["Fixed the Skill Catalog link in the contributing guide.", "修正貢獻指南裡 Skill Catalog 的連結。"],
  "punkpeye/awesome-mcp-servers": ["Added research-hub to the Research category.", "把 research-hub 收錄進 Research 分類。"],
};
const kfmt = (s) => (s >= 100000 ? Math.round(s / 1000) + "k" : s >= 1000 ? (s / 1000).toFixed(1).replace(/\.0$/, "") + "k" : String(s));
const groups = Object.keys(DID).map((repo) => {
  const prs = data.items.filter((p) => p.repo === repo).sort((a, b) => a.merged.localeCompare(b.merged));
  if (!prs.length || !(data.stars[repo] > 0)) throw new Error(`home: no merged PR or star count for ${repo}`);
  return { repo, stars: data.stars[repo], starsK: kfmt(data.stars[repo]), didEn: DID[repo][0], didZh: DID[repo][1], prs, list: `https://github.com/${repo}/pulls?q=is%3Apr+is%3Amerged+author%3AWenyuChiou` };
});
if (groups.reduce((s, g) => s + g.prs.length, 0) !== data.items.length) throw new Error("home: a merged PR belongs to a project with no summary in home/prs.cjs");
module.exports = { groups, asOf: data.asOf };
