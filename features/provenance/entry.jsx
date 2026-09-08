import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import { Workbench } from './workbench.jsx';
import { FEATURE_CONTENT } from '../../feature-content.js';
import './workbench.css';
import './art.css';

export function mount(element) {
  const locale = element.dataset.locale === 'zh-TW' ? 'zh-TW' : 'en';
  return hydrateRoot(element, <Workbench provenance={FEATURE_CONTENT[locale].provenance} locale={locale} compact={element.dataset.compact === 'true'} initialLens={element.dataset.initialLens} />);
}
