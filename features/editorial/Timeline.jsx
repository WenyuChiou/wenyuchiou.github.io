import React, { useId } from 'react';

const TITLES = {
  en: ['Field evidence', 'Behavioral modeling', 'Governed agents'],
  'zh-TW': ['實地證據', '行為建模', '受治理的代理系統'],
};

export function Timeline({ content, locale = 'en' }) {
  const trajectory = content?.aboutPage?.trajectory ?? [];
  const copy = TITLES[locale] ?? TITLES.en;
  const scope = `experience-${useId().replaceAll(':', '')}`;
  const latest = Math.max(0, trajectory.length - 1);

  return <div className="experience-timeline" data-experience-timeline data-locale={locale}>
    <div className="experience-timeline__interactive" data-timeline-interactive>
      <ol className="experience-timeline__list">
        {trajectory.map((item, index) => {
          const bodyId = `${scope}-body-${index}`;
          const summaryId = `${scope}-summary-${index}`;
          return <li key={`${item.year}-${index}`} data-timeline-item data-index={index}>
            <details open={index === latest}>
              <summary id={summaryId} aria-controls={bodyId} data-timeline-summary>
                <span className="experience-timeline__date">{item.year}</span>
                <strong>{copy[index] ?? item.year}</strong>
              </summary>
              <div id={bodyId} className="experience-timeline__body" data-timeline-body>
                <p>{item.text}</p>
              </div>
            </details>
          </li>;
        })}
      </ol>
      {trajectory.length > 0 && <aside id={`${scope}-panel`} className="experience-timeline__panel" data-timeline-panel aria-hidden="true">
        <span className="experience-timeline__date" data-timeline-panel-date>{trajectory[latest].year}</span>
        <h3 data-timeline-panel-title>{copy[latest] ?? trajectory[latest].year}</h3>
        <p data-timeline-panel-body>{trajectory[latest].text}</p>
      </aside>}
    </div>
  </div>;
}

export default Timeline;
