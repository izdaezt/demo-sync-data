import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, DatePicker, Layout, Select, Space, Table, Typography, message } from 'antd';
import { LogoutOutlined, ReloadOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs, { Dayjs } from 'dayjs';
import { api, clearToken } from '../api';

interface Row { id: number; stationCode: string; stationName: string; recordedAt: string; flowRate: number; volume: number }
interface Station { code: string; name: string }

const columns: ColumnsType<Row> = [
  { title: 'Time', dataIndex: 'recordedAt', render: (v: string) => dayjs(v).format('YYYY-MM-DD HH:mm') },
  { title: 'Station', render: (_, r) => `${r.stationCode} - ${r.stationName}` },
  { title: 'Flow rate (m³/h)', dataIndex: 'flowRate', align: 'right', render: (v: number) => v.toFixed(2) },
  { title: 'Volume (m³)', dataIndex: 'volume', align: 'right', render: (v: number) => v.toFixed(2) },
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<Row[]>([]);
  const [stations, setStations] = useState<Station[]>([]);
  const [station, setStation] = useState<string>();
  const [date, setDate] = useState<Dayjs | null>(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const p = new URLSearchParams();
      if (station) p.set('station', station);
      if (date) {
        p.set('from', date.startOf('day').toISOString());
        p.set('to', date.endOf('day').toISOString());
      }
      setRows(await api<Row[]>(`/water-flow?${p}`));
    } catch (e) {
      message.error((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [station, date]);

  useEffect(() => { api<Station[]>('/water-flow/stations').then(setStations).catch(() => {}); }, []);
  useEffect(() => { load(); }, [load]);

  const logout = () => { clearToken(); navigate('/login', { replace: true }); };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Layout.Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography.Title level={4} style={{ color: '#fff', margin: 0 }}>Hourly Water Flow</Typography.Title>
        <Button icon={<LogoutOutlined />} onClick={logout}>Log out</Button>
      </Layout.Header>
      <Layout.Content style={{ padding: 24 }}>
        <Space style={{ marginBottom: 16 }} wrap>
          <Select
            allowClear placeholder="All stations" style={{ width: 220 }} value={station} onChange={setStation}
            options={stations.map((s) => ({ value: s.code, label: `${s.code} - ${s.name}` }))}
          />
          <DatePicker value={date} onChange={setDate} />
          <Button icon={<ReloadOutlined />} onClick={load}>Refresh</Button>
        </Space>
        <Table rowKey="id" columns={columns} dataSource={rows} loading={loading} size="middle" pagination={{ pageSize: 24 }} />
      </Layout.Content>
    </Layout>
  );
}
