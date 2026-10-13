import { EN } from "./content.en.js";
import { ZH_TW } from "./content.zh-TW.js";
import { FEATURE_CONTENT } from "./feature-content.js";
import { EDITORIAL } from "./editorial-content.js";
import { GUIDE_COPY } from "./portfolio-guide-data.js";

function composeContent(base, feature) {
  const editorial = EDITORIAL[base.locale];
  const nav = [base.nav.find(item => item.id === "work"), base.nav.find(item => item.id === "research"), { ...feature.articlesNav, label: editorial.writingLabel }, base.nav.find(item => item.id === "about")];
  return { ...base, ...feature, nav, editorial, navigator: { ...base.navigator, ...GUIDE_COPY[base.locale] } };
}

export const CONTENT = {
  en: composeContent(EN, FEATURE_CONTENT.en),
  "zh-TW": composeContent(ZH_TW, FEATURE_CONTENT["zh-TW"]),
};

export const PAGE_DEFINITIONS = [
  { id: "home", path: "/" },
  { id: "work", path: "/work/" },
  { id: "case:human-grounded-llm-evaluation", path: "/work/human-grounded-llm-evaluation/" },
  { id: "case:floodabm", path: "/work/floodabm/" },
  { id: "case:wagf", path: "/work/wagf/" },
  { id: "research", path: "/research/" },
  { id: "publications", path: "/publications/" },
  { id: "articles", path: "/articles/" },
  { id: "article:evaluating-llm-agents-against-measured-human-behavior", path: "/articles/evaluating-llm-agents-against-measured-human-behavior/" },
  { id: "article:why-governed-agents-need-validators-before-state-changes", path: "/articles/why-governed-agents-need-validators-before-state-changes/" },
  { id: "article:from-individual-decisions-to-system-consequences", path: "/articles/from-individual-decisions-to-system-consequences/" },
  { id: "hire", path: "/hire/" },
  { id: "about", path: "/about/" },
];

export function localizedPath(path, locale) {
  if (locale === "en") return path;
  return path === "/" ? "/zh/" : `/zh${path}`;
}

export function counterpartPath(path, locale) {
  return localizedPath(path, locale === "en" ? "zh-TW" : "en");
}
