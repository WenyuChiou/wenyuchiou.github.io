-- Portfolio Navigator funnel for the last 28 days.
-- These are event-level ratios, not unique-user or session conversion rates.
SELECT
  sumIf(_sample_interval, blob1 = 'navigator_impression') AS entry_impressions,
  sumIf(_sample_interval, blob1 = 'navigator_open') AS navigator_opens,
  sumIf(_sample_interval, blob1 = 'navigator_query_submit') AS query_submissions,
  sumIf(_sample_interval, blob1 = 'navigator_result_mode') AS completed_results,
  sumIf(_sample_interval, blob1 = 'navigator_evidence_open') AS evidence_clicks,
  if(
    sumIf(_sample_interval, blob1 = 'navigator_impression') = 0,
    0,
    100.0 * sumIf(_sample_interval, blob1 = 'navigator_open')
      / sumIf(_sample_interval, blob1 = 'navigator_impression')
  ) AS entry_open_rate_percent,
  if(
    sumIf(_sample_interval, blob1 = 'navigator_query_submit') = 0,
    0,
    100.0 * sumIf(_sample_interval, blob1 = 'navigator_result_mode')
      / sumIf(_sample_interval, blob1 = 'navigator_query_submit')
  ) AS query_completion_rate_percent,
  if(
    sumIf(_sample_interval, blob1 = 'navigator_result_mode') = 0,
    0,
    100.0 * sumIf(_sample_interval, blob1 = 'navigator_evidence_open')
      / sumIf(_sample_interval, blob1 = 'navigator_result_mode')
  ) AS evidence_clicks_per_100_results
FROM wenyu_portfolio_events
WHERE timestamp >= NOW() - INTERVAL '28' DAY
  AND blob1 IN (
    'navigator_impression',
    'navigator_open',
    'navigator_query_submit',
    'navigator_result_mode',
    'navigator_evidence_open'
  );

-- Final routing mode by locale.
SELECT
  blob2 AS locale,
  blob5 AS result_mode,
  SUM(_sample_interval) AS completed_results
FROM wenyu_portfolio_events
WHERE timestamp >= NOW() - INTERVAL '28' DAY
  AND blob1 = 'navigator_result_mode'
GROUP BY locale, result_mode
ORDER BY locale, completed_results DESC;

-- Most-opened evidence destinations.
SELECT
  blob2 AS locale,
  blob3 AS evidence_id,
  SUM(_sample_interval) AS evidence_clicks
FROM wenyu_portfolio_events
WHERE timestamp >= NOW() - INTERVAL '28' DAY
  AND blob1 = 'navigator_evidence_open'
GROUP BY locale, evidence_id
ORDER BY evidence_clicks DESC
LIMIT 20;
