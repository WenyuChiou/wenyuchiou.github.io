import { EN } from "./content.en.js";
import { ZH_TW } from "./content.zh-TW.js";
import { FEATURE_CONTENT } from "./feature-content.js";

function composeContent(base, feature) {
  const nav = base.nav.some((item) => item.id === "articles")
    ? base.nav
    : [...base.nav.slice(0, 3), feature.articlesNav, ...base.nav.slice(3)];
  return { ...base, ...feature, nav };
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
