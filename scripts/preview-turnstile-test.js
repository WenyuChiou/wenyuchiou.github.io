(() => {
  if (location.hostname !== 'localhost' || document.querySelector('meta[name="preview-verification"]')?.content !== 'test-only') throw new Error('Test verification is local-preview only');
  const widgets = new Map();
  let nextId = 0;
  // This is an explicit local test adapter, not a Cloudflare human-check widget.
  window.turnstile = {
    render(container, options) {
      const id = ++nextId;
      const note = document.createElement('p');
      note.textContent = document.documentElement.lang.startsWith('zh') ? '\u6e2c\u8a66\u9a57\u8b49\uff08\u975e\u771f\u4eba\u9a57\u8b49\uff09' : 'Test verification (not a human check)';
      container.append(note);
      widgets.set(id, note);
      queueMicrotask(() => { if (widgets.has(id)) options.callback('XXXX.DUMMY.TOKEN.XXXX'); });
      return id;
    },
    remove(id) { widgets.get(id)?.remove(); widgets.delete(id); },
  };
})();
