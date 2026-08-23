import React from "react";
import { hydrateRoot } from "react-dom/client";
import { App } from "./app.jsx";

const root = document.getElementById("root");
if (root) {
  const page = root.dataset.page || "home";
  if (page.startsWith("case:")) {
    hydrateRoot(root, <App page={page} locale={root.dataset.locale || "en"} basePath={root.dataset.basePath || "/"} />);
  } else {
    const menu = root.querySelector(".menu-button");
    const navigation = root.querySelector("#primary-navigation");
    menu?.addEventListener("click", () => {
      const open = navigation?.classList.toggle("is-open") || false;
      menu.setAttribute("aria-expanded", String(open));
    });
    root.querySelector(".theme-button")?.addEventListener("click", () => {
      const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = next;
      window.localStorage.setItem("wy-theme", next);
    });
  }
}
