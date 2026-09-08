import React, { useState } from 'react';

// Preserve server markup without bringing the deferred root into the main bundle.
export function ProvenanceIsland({ content, compact = false, initialLens = 'evaluation' }) {
  const [markup] = useState(() => document.querySelector('[data-provenance-island]')?.innerHTML || '');
  return <div data-provenance-island data-locale={content.locale} data-compact={compact} data-initial-lens={initialLens} dangerouslySetInnerHTML={{ __html: markup }} />;
}
