import React, { useState } from 'react';

// Preserve server markup without bringing the deferred root into the main bundle.
export function ProvenanceIsland({ content }) {
  const [markup] = useState(() => document.querySelector('[data-provenance-island]')?.innerHTML || '');
  return <div data-provenance-island data-locale={content.locale} dangerouslySetInnerHTML={{ __html: markup }} />;
}
