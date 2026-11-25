-- Sample data: last 72 hours for 3 stations (safe to re-run)
INSERT INTO water_flow_hourly (station_code, station_name, recorded_at, flow_rate, volume)
SELECT s.code, s.name, h.ts,
       ROUND((s.base + 40 * SIN(EXTRACT(HOUR FROM h.ts) / 24.0 * 2 * PI()) + RANDOM() * 15)::numeric, 3),
       0
FROM (VALUES ('ST01','Station 01',120), ('ST02','Station 02',200), ('ST03','Station 03',80)) AS s(code, name, base)
CROSS JOIN generate_series(date_trunc('hour', NOW()) - INTERVAL '71 hours', date_trunc('hour', NOW()), INTERVAL '1 hour') AS h(ts)
ON CONFLICT (station_code, recorded_at) DO NOTHING;

UPDATE water_flow_hourly SET volume = flow_rate WHERE volume = 0; -- 1h at flow_rate m3/h
