-- Hourly water flow readings per monitoring station
CREATE TABLE IF NOT EXISTS water_flow_hourly (
    id            BIGSERIAL PRIMARY KEY,
    station_code  VARCHAR(50)  NOT NULL,
    station_name  VARCHAR(255) NOT NULL,
    recorded_at   TIMESTAMPTZ  NOT NULL,           -- start of the hour
    flow_rate     NUMERIC(12,3) NOT NULL,          -- m3/h, average in the hour
    volume        NUMERIC(14,3) NOT NULL,          -- m3, consumed in the hour
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_water_flow_station_hour UNIQUE (station_code, recorded_at)
);

CREATE INDEX IF NOT EXISTS idx_water_flow_recorded_at ON water_flow_hourly (recorded_at DESC);
