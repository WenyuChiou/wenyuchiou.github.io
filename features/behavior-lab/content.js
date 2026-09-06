const en = {
  title: "LLM Behavior Comparison Lab", synthetic: "Synthetic example",
  scenarioLabel: "Scenario", lensLabel: "Comparison lens",
  scenarios: { direction: "Reversed response", groups: "Hidden group differences", repeats: "Unstable repeats" },
  lenses: { direction: "Direction", groups: "Groups", repeats: "Repeats" },
  reference: "Synthetic reference", model: "Model output example", choices: ["No action", "Take action"],
  actionCount: "Records choosing action", total: "All records", group: "Evaluation group", efficacy: "Efficacy",
  low: "Low efficacy", high: "High efficacy", A: "Group A", B: "Group B",
  run: "Run", run1: "Run 1", run2: "Run 2", run3: "Run 3",
  finding: "What the comparison reveals", changed: "Records changing across runs",
  previous: "Changed since previous run", first: "First run", mismatches: "Different from reference",
  records: "Eight individual records", record: "Record", selected: "Selected record",
  referenceShort: "Reference", outputs: "Outputs, runs 1 / 2 / 3", conditions: "Synthetic conditions",
  assumptions: "Assumptions and evidence boundary",
  boundary: "Every record and output here is handcrafted. Groups A and B are fictional evaluation labels, not real social groups or claimed prompt inputs. Efficacy is a low/high example condition, not a fitted coefficient. Repeats are fixed examples, not live model executions. Counts illustrate evaluation methods; they are not study results, model performance, human equivalence, or causal evidence.",
  sources: "Method sources", caseLink: "Evaluation case", articleLink: "Behavioral evaluation method",
  sourceNote: "These sources describe the method, not the synthetic values above.",
  tableCaption: "Eight synthetic records; 0 = no action, 1 = take action. Outputs are ordered by run.",
  findings: {
    direction: {
      direction: "The reference increases with efficacy; the output example moves in the opposite direction on every run.",
      groups: "Both groups have matching action totals, yet every individual choice differs from its reference.",
      repeats: "The outputs repeat consistently. Consistency alone does not mean correspondence with the reference.",
    },
    groups: {
      direction: "Pooling by efficacy hides which group drives the difference. The overall action total remains unchanged.",
      groups: "The overall totals agree, but the action counts for groups A and B are exchanged.",
      repeats: "The group mismatch persists in every repeat. Repetition does not repair the discrepancy.",
    },
    repeats: {
      direction: "The direction agrees in runs 1 and 3, then reverses in run 2. A single run would miss that instability.",
      groups: "Each group retains the same action total while its individual records change choices.",
      repeats: "The aggregate total never changes, but every record flips in run 2 and flips back in run 3.",
    },
  },
};

const zh = {
  title: "LLM 行為比較實驗台", synthetic: "合成示例",
  scenarioLabel: "情境", lensLabel: "觀察角度",
  scenarios: { direction: "反向反應", groups: "隱藏的群體差異", repeats: "跨次執行不穩定" },
  lenses: { direction: "方向", groups: "群體", repeats: "重複執行" },
  reference: "合成參考", model: "模型輸出示例", choices: ["不採取行動", "採取行動"],
  actionCount: "採取行動的記錄數", total: "全部記錄", group: "評估用群體", efficacy: "效能感",
  low: "低效能感", high: "高效能感", A: "A 組", B: "B 組",
  run: "次數", run1: "第 1 次", run2: "第 2 次", run3: "第 3 次",
  finding: "比較呈現的差異", changed: "跨次選擇改變的記錄數",
  previous: "與前次不同的記錄數", first: "首次記錄", mismatches: "與參考不同的記錄數",
  records: "八筆個別記錄", record: "記錄", selected: "選取的記錄",
  referenceShort: "參考", outputs: "第 1 / 2 / 3 次輸出", conditions: "合成條件",
  assumptions: "假設與證據界線",
  boundary: "所有記錄與輸出均為人工編寫。A、B 組是虛構的評估標籤，不是真實社會群體，也不宣稱為模型收到的提示。高低效能感只是示例條件，不是估計係數。重複輸出是固定示例，並非即時模型執行。計數只說明評估方法，不代表研究結果、模型效能、人類等價性或因果證據。",
  sources: "方法來源", caseLink: "評估案例", articleLink: "行為評估方法",
  sourceNote: "來源說明評估方法，不支持上方的合成數值。",
  tableCaption: "八筆合成記錄；0 表示不採取行動，1 表示採取行動。輸出按執行次序排列。",
  findings: {
    direction: {
      direction: "參考選擇隨效能感提高而增加；每次示例輸出卻朝相反方向變動。",
      groups: "兩組採取行動的總量都與參考相同，但每筆個別選擇均與參考不同。",
      repeats: "示例輸出每次都一致；一致本身並不代表符合參考。",
    },
    groups: {
      direction: "按效能感合併後，無法看出差異來自哪一組；全部記錄的行動總量仍然相同。",
      groups: "整體總量一致，但 A、B 兩組採取行動的數量互換了。",
      repeats: "群體差異在每次執行中持續存在；重複本身不會修正偏差。",
    },
    repeats: {
      direction: "第 1、3 次方向與參考相同，第 2 次卻反轉；只看一次便會漏掉這種不穩定。",
      groups: "每組的行動總量不變，個別記錄的選擇卻發生改變。",
      repeats: "總量始終不變，但每筆記錄都在第 2 次反轉，第 3 次再反轉回來。",
    },
  },
};

export function getLabels(locale) {
  return locale === "zh-TW" ? zh : en;
}
