import { GROUPS, getWorkbench, selectGroup } from "./data.js";

export function initOpenSourceWorkbench(root = document) {
  const cleanups = [];
  for (const workbench of root.querySelectorAll("[data-workbench]")) {
    if (workbench.dataset.enhanced === "true") continue;
    const labels = getWorkbench(workbench.dataset.locale);
    const buttons = [...workbench.querySelectorAll("[data-workbench-filter]")];
    const controls = workbench.querySelector("[data-workbench-controls]");
    const status = workbench.querySelector("[data-workbench-status]");
    const section = workbench.closest("#open-source");
    const select = (group) => {
      if (group !== "all" && !GROUPS.includes(group)) return;
      const selected = new Set(selectGroup(group).map((repo) => repo.id));
      workbench.dataset.workbenchGroup = group;
      buttons.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.workbenchFilter === group)));
      workbench.querySelectorAll("[data-workbench-lane]").forEach((lane) => { lane.dataset.highlighted = String(group === "all" || lane.dataset.workbenchLane === group); });
      section?.querySelectorAll("[data-repo-key]").forEach((row) => { row.dataset.workbenchMatch = String(selected.has(row.dataset.repoKey)); });
      status.textContent = group === "all" ? labels.ready : `${labels[group]} · ${labels.selected}: ${selected.size}`;
    };
    buttons.forEach((button) => { const onClick = () => select(button.dataset.workbenchFilter); button.addEventListener("click", onClick); cleanups.push(() => button.removeEventListener("click", onClick)); });
    controls.hidden = false;
    workbench.dataset.enhanced = "true";
    select("all");
    cleanups.push(() => { controls.hidden = true; delete workbench.dataset.enhanced; });
  }
  return () => cleanups.forEach((cleanup) => cleanup());
}
