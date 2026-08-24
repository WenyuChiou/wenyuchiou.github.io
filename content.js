import { EN } from "./content.en.js";
import { ZH_TW } from "./content.zh-TW.js";

export const CONTENT = { en: EN, "zh-TW": ZH_TW };

export const PAGE_DEFINITIONS = [
  { id: "home", path: "/" },
  { id: "work", path: "/work/" },
  { id: "case:human-grounded-llm-evaluation", path: "/work/human-grounded-llm-evaluation/" },
  { id: "case:floodabm", path: "/work/floodabm/" },
  { id: "case:wagf", path: "/work/wagf/" },
  { id: "research", path: "/research/" },
  { id: "publications", path: "/publications/" },
  { id: "about", path: "/about/" },
];

export function localizedPath(path, locale) {
  if (locale === "en") return path;
  return path === "/" ? "/zh/" : `/zh${path}`;
}

export function counterpartPath(path, locale) {
  return localizedPath(path, locale === "en" ? "zh-TW" : "en");
}
