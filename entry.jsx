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
      menu.setAttribute("aria-label", open ? menu.dataset.closeLabel : menu.dataset.openLabel);
    });
    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape" || menu?.getAttribute("aria-expanded") !== "true") return;
      navigation?.classList.remove("is-open");
      menu.setAttribute("aria-expanded", "false");
      menu.setAttribute("aria-label", menu.dataset.openLabel);
      menu.focus();
    });
    root.querySelector(".theme-button")?.addEventListener("click", () => {
      const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = next;
      try { window.localStorage.setItem("wy-theme", next); } catch {}
    });
    root.querySelectorAll(".stage").forEach((stage) => {
      const summary = stage.querySelector("summary");
      let userRequested = false;
      summary?.addEventListener("pointerdown", () => { userRequested = true; });
      summary?.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") userRequested = true;
      });
      stage.addEventListener("toggle", () => {
        const shouldPosition = stage.open && userRequested;
        userRequested = false;
        if (!shouldPosition) return;
        requestAnimationFrame(() => stage.scrollIntoView({ block: "start" }));
      });
    });
  }
}
