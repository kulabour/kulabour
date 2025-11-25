-- Create a view that surfaces slow queries (avg > 200 ms)
CREATE OR REPLACE VIEW public.slow_queries AS
SELECT
  query,
  calls,
  total_time,
  rows,
  (total_time / calls) AS avg_ms
FROM pg_stat_statements
WHERE (total_time / calls) > 200
ORDER BY avg_ms DESC;
