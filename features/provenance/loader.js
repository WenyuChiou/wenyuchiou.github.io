let activation;

export function activateProvenance() {
  const element = document.querySelector('[data-provenance-island]');
  if (!element || element.dataset.ready === 'true') return Promise.resolve();
  if (activation) return activation;
  activation = (async () => {
    const module = await import(__PROVENANCE_MODULE__);
    await new Promise((resolve, reject) => {
      const ready = () => { clearTimeout(timeout); resolve(); };
      const timeout = setTimeout(() => { element.removeEventListener('provenance:ready', ready); reject(new Error('provenance_initialization_timeout')); }, 8000);
      element.addEventListener('provenance:ready', ready, { once: true });
      module.mount(element);
    });
  })();
  activation.catch(() => { element.dataset.failed = 'true'; });
  return activation;
}

export function initProvenance() {
  const element = document.querySelector('[data-provenance-island]');
  if (!element) return;
  const load = () => { void activateProvenance().catch(() => {}); };
  element.addEventListener('focusin', load, { once: true });
  element.addEventListener('pointerenter', load, { once: true });
  element.addEventListener('click', async event => {
    if (element.dataset.ready === 'true') return;
    const button = event.target.closest('button');
    if (!button) return;
    event.preventDefault();
    event.stopPropagation();
    try { await activateProvenance(); button.click(); } catch { /* Static evidence remains readable. */ }
  }, true);
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) return;
      observer.disconnect(); load();
    }, { rootMargin: '250px' });
    observer.observe(element);
  } else load();
}
