import React from 'react';
import { Workbench } from './workbench.jsx';

export function ProvenanceIsland({ content, compact = false, initialLens = 'evaluation' }) {
  return <div data-provenance-island data-locale={content.locale} data-compact={compact} data-initial-lens={initialLens}><Workbench provenance={content.provenance} locale={content.locale} compact={compact} initialLens={initialLens} /></div>;
}
