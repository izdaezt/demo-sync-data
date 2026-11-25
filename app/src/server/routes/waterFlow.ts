import { Router } from 'express';
import { pool } from '../db';
import { asyncHandler, requireAuth } from '../auth';

export const waterFlowRouter = Router();
waterFlowRouter.use(requireAuth);

// GET /api/water-flow?station=ST01&from=ISO&to=ISO&limit=200
waterFlowRouter.get('/', asyncHandler(async (req, res) => {
  const { station, from, to } = req.query as Record<string, string | undefined>;
  const limit = Math.min(Number(req.query.limit) || 200, 1000);

  const conds: string[] = [];
  const params: unknown[] = [];
  if (station) { params.push(station); conds.push(`station_code = $${params.length}`); }
  if (from) { params.push(from); conds.push(`recorded_at >= $${params.length}`); }
  if (to) { params.push(to); conds.push(`recorded_at <= $${params.length}`); }
  params.push(limit);

  const { rows } = await pool.query(
    `SELECT id, station_code AS "stationCode", station_name AS "stationName", recorded_at AS "recordedAt",
            flow_rate::float8 AS "flowRate", volume::float8 AS volume
     FROM water_flow_hourly
     ${conds.length ? 'WHERE ' + conds.join(' AND ') : ''}
     ORDER BY recorded_at DESC, station_code
     LIMIT $${params.length}`,
    params,
  );
  res.json(rows);
}));

waterFlowRouter.get('/stations', asyncHandler(async (_req, res) => {
  const { rows } = await pool.query(
    'SELECT DISTINCT station_code AS code, station_name AS name FROM water_flow_hourly ORDER BY station_code',
  );
  res.json(rows);
}));
