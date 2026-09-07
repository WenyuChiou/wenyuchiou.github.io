import React from 'react';
import { Workbench } from './workbench.jsx';

export function ProvenanceIsland({ content }) {
  return <div data-provenance-island data-locale={content.locale}><Workbench provenance={content.provenance} locale={content.locale} /></div>;
}
