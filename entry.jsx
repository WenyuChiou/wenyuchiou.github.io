import React from "react";
import { hydrateRoot } from "react-dom/client";
import { App } from "./app.jsx";
import { initPortfolioNavigator, trackPortfolioEvent } from "./navigator.js";
import { initRecruiterFitExplorer } from "./fit-explorer.js";

document.documentElement.classList.add("js");
const root = document.getElementById("root");

function initDisclosureGroup(selector) {
  const disclosures = [...document.querySelectorAll(selector)];
  disclosures.forEach((disclosure) => {
    disclosure.addEventListener("toggle", () => {
      if (!disclosure.open) return;
      disclosures.forEach((other) => {
        if (other !== disclosure && other.open) other.open = false;
      });
    });
  });
  return disclosures;
}

function initProgressiveEnhancement() {
  const workDropdowns = initDisclosureGroup(".work-dropdown");
  initDisclosureGroup(".flagship-entry");

  const desktopDropdown = window.matchMedia("(min-width: 981px)");
  workDropdowns.forEach((dropdown) => {
    const summary = dropdown.querySelector(":scope > summary");
    const preview = () => {
      if (!desktopDropdown.matches || dropdown.open) return;
      dropdown.dataset.preview = "true";
      dropdown.open = true;
    };
    const closePreview = () => {
      if (dropdown.dataset.preview !== "true") return;
      delete dropdown.dataset.preview;
      dropdown.open = false;
    };
    dropdown.addEventListener("pointerenter", preview);
    dropdown.addEventListener("pointerleave", closePreview);
    dropdown.addEventListener("focusin", preview);
    dropdown.addEventListener("focusout", (event) => {
      if (!dropdown.contains(event.relatedTarget)) closePreview();
    });
    summary?.addEventListener("click", (event) => {
      if (dropdown.dataset.preview !== "true") return;
      event.preventDefault();
      delete dropdown.dataset.preview;
      dropdown.open = true;
    });
  });

  document.addEventListener("pointerdown", (event) => {
    workDropdowns.forEach((dropdown) => {
      if (dropdown.open && !dropdown.contains(event.target)) {
        delete dropdown.dataset.preview;
        dropdown.open = false;
      }
    });
  });
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    const openDropdown = workDropdowns.find((dropdown) => dropdown.open);
    if (!openDropdown) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    const summary = openDropdown.querySelector(":scope > summary");
    summary?.focus();
    delete openDropdown.dataset.preview;
    openDropdown.open = false;
  });
  workDropdowns.forEach((dropdown) => {
    dropdown.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => { dropdown.open = false; }));
  });

  const revealTargets = [...document.querySelectorAll(".section-head, .flagship-entry, .update-item")]
    .filter((target) => !target.closest(".expertise"));
  if (!revealTargets.length || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  revealTargets.forEach((target, index) => {
    target.classList.add("scroll-reveal");
    target.style.setProperty("--reveal-delay", `${Math.min(index % 3, 2) * 45}ms`);
  });
  document.documentElement.classList.add("motion-ready");
  const reveal = (target) => {
    target.classList.add("is-visible");
    observer?.unobserve(target);
  };
  const observer = "IntersectionObserver" in window ? new IntersectionObserver((entries) => {
    entries.forEach((entry) => { if (entry.isIntersecting) reveal(entry.target); });
  }, { threshold: 0.08, rootMargin: "0px 0px -8%" }) : null;
  requestAnimationFrame(() => revealTargets.forEach((target) => {
    const rect = target.getBoundingClientRect();
    if (!observer || (rect.top < window.innerHeight * 0.92 && rect.bottom > 0)) reveal(target);
    else observer.observe(target);
  }));
}

if (root) {
  const page = root.dataset.page || "home";
  if (page === "home" || page === "hire" || page.startsWith("case:")) {
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
      if (navigation?.querySelector(".work-dropdown[open]")) return;
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
      summary?.addEventListener("keyup", (event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        window.setTimeout(() => {
          if (stage.open) summary.scrollIntoView({ block: "start", behavior: "instant" });
        }, 50);
      });
      stage.addEventListener("toggle", () => {
        const shouldPosition = stage.open && userRequested;
        userRequested = false;
        if (!shouldPosition) return;
        requestAnimationFrame(() => summary?.scrollIntoView({ block: "start", behavior: "instant" }));
      });
    });
  }
  initProgressiveEnhancement();
  initPortfolioNavigator(root);
  initRecruiterFitExplorer(root);
  if (page === "hire") trackPortfolioEvent("recruiter_brief_open", root.dataset.locale === "zh-TW" ? "zh-TW" : "en", "hire", "success");
}

document.addEventListener("click", (event) => {
  const link = event.target.closest?.("a[href]");
  if (!link) return;
  const href = link.getAttribute("href") || "";
  const locale = root?.dataset.locale === "zh-TW" ? "zh-TW" : "en";
  let payload;
  if (link.closest(".hero-actions") && href.includes("/hire/")) payload = ["recruiter_brief_open", "hire"];
  else if (link.closest(".hero-work-link") && href === "#selected-work") payload = ["hero_work_click", "home"];
  else if (link.closest(".hire-contact") && href.includes("Industry_Resume_EN")) payload = ["recruiter_resume_download", "resume-en"];
  else if (link.closest(".hire-contact") && href.startsWith("mailto:")) payload = ["recruiter_contact_click", "email"];
  else if (link.closest(".hire-contact") && href.includes("linkedin.com")) payload = ["recruiter_contact_click", "linkedin"];
  else if (href.includes("Industry_Resume_EN")) payload = ["industry_resume_download", "resume-en"];
  else if (href.includes("Industry_Resume_zh-TW")) payload = ["industry_resume_download", "resume-zh"];
  else if (href.includes("Academic_CV_EN")) payload = ["academic_cv_download", "resume-en"];
  else if (href.includes("Academic_CV_zh-TW")) payload = ["academic_cv_download", "resume-zh"];
  else if (href.includes("human-grounded-llm-evaluation")) payload = ["case_open", "human-grounded-llm-evaluation"];
  else if (href.includes("/work/floodabm")) payload = ["case_open", "floodabm"];
  else if (href.includes("/work/wagf")) payload = ["case_open", "wagf"];
  else if (href.includes("/articles/")) payload = ["article_open", "articles"];
  else if (href.startsWith("mailto:")) payload = ["contact_click", "email"];
  else if (href.includes("linkedin.com")) payload = ["contact_click", "linkedin"];
  else if (href.includes("github.com")) payload = ["contact_click", "github"];
  if (payload) trackPortfolioEvent(payload[0], locale, payload[1]);
}, { passive: true });
