const instances = new WeakMap();

export function initExperienceTimeline(root) {
  if (!root?.matches?.('[data-experience-timeline]')) return () => {};
  if (instances.has(root)) return instances.get(root);

  const summaries = [...root.querySelectorAll('[data-timeline-summary]')];
  const panel = root.querySelector('[data-timeline-panel]');
  const interactive = root.querySelector('[data-timeline-interactive]');
  if (!summaries.length || !panel || !interactive) return () => {};

  const desktop = window.matchMedia('(min-width: 48rem)');
  let pinned = summaries.length - 1;
  let preview = pinned;
  let hoverTimer = 0;

  const itemAt = index => summaries[index]?.closest('[data-timeline-item]');
  const render = index => {
    const item = itemAt(index);
    if (!item) return;
    preview = index;
    panel.querySelector('[data-timeline-panel-date]').textContent = item.querySelector('.experience-timeline__date').textContent;
    panel.querySelector('[data-timeline-panel-title]').textContent = summaries[index].querySelector('strong').textContent;
    panel.querySelector('[data-timeline-panel-body]').textContent = item.querySelector('[data-timeline-body] p').textContent;
    panel.setAttribute('aria-labelledby', summaries[index].id);
    itemAt(index)?.setAttribute('data-active', 'true');
    summaries.forEach((summary, candidate) => {
      if (candidate !== index) itemAt(candidate)?.removeAttribute('data-active');
      if (desktop.matches) {
        summary.parentElement.open = candidate === index;
        summary.setAttribute('aria-controls', panel.id);
        summary.setAttribute('aria-expanded', String(candidate === index));
      }
    });
  };
  const restore = () => {
    window.clearTimeout(hoverTimer);
    if (preview !== pinned) render(pinned);
  };
  const setMode = () => {
    root.dataset.timelineReady = 'true';
    root.dataset.timelineMode = desktop.matches ? 'desktop' : 'mobile';
    panel.setAttribute('aria-hidden', desktop.matches ? 'false' : 'true');
    if (desktop.matches) render(pinned);
    else summaries.forEach(summary => {
      summary.setAttribute('aria-controls', summary.parentElement.querySelector('[data-timeline-body]').id);
      summary.removeAttribute('aria-expanded');
    });
  };
  const indexFor = target => summaries.indexOf(target.closest?.('[data-timeline-summary]'));
  const onPointerOver = event => {
    if (!desktop.matches) return;
    const index = indexFor(event.target);
    if (index < 0 || summaries[index].contains(event.relatedTarget)) return;
    window.clearTimeout(hoverTimer);
    hoverTimer = window.setTimeout(() => render(index), 200);
  };
  const onFocusIn = event => {
    if (!desktop.matches) return;
    window.clearTimeout(hoverTimer);
    const index = indexFor(event.target);
    if (index >= 0) render(index);
  };
  const onClick = event => {
    const index = indexFor(event.target);
    if (index < 0 || !desktop.matches) return;
    event.preventDefault();
    window.clearTimeout(hoverTimer);
    pinned = index;
    render(index);
  };
  const onKeyDown = event => {
    if (desktop.matches && event.key === 'Escape') {
      event.preventDefault();
      restore();
      summaries[pinned]?.focus();
    }
  };

  root.addEventListener('pointerover', onPointerOver);
  root.addEventListener('focusin', onFocusIn);
  root.addEventListener('click', onClick);
  root.addEventListener('keydown', onKeyDown);
  interactive.addEventListener('pointerleave', restore);
  desktop.addEventListener('change', setMode);
  setMode();

  const cleanup = () => {
    window.clearTimeout(hoverTimer);
    root.removeEventListener('pointerover', onPointerOver);
    root.removeEventListener('focusin', onFocusIn);
    root.removeEventListener('click', onClick);
    root.removeEventListener('keydown', onKeyDown);
    interactive.removeEventListener('pointerleave', restore);
    desktop.removeEventListener('change', setMode);
    window.removeEventListener('pagehide', onPageHide);
    instances.delete(root);
  };
  const onPageHide = event => {
    window.clearTimeout(hoverTimer);
    if (!event.persisted) cleanup();
  };
  instances.set(root, cleanup);
  window.addEventListener('pagehide', onPageHide);
  return cleanup;
}
