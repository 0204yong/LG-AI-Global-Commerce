import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function SecurityDashboard() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    const fetchSecurityState = async () => {
      try {
        const res = await fetch('http://localhost:4321/api/security?action=status');
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error('Failed to fetch security data', err);
      }
    };
    fetchSecurityState();
    interval = setInterval(fetchSecurityState, 2000);
    return () => clearInterval(interval);
  }, []);

  if (!data) {
    return <div style={{ padding: '3rem', textAlign: 'center' }}>Loading Security Dashboard...</div>;
  }

  // Create mock chart data
  const chartData = [
    { time: '10:00', traffic: 120 },
    { time: '10:05', traffic: 135 },
    { time: '10:10', traffic: 125 },
    { time: '10:15', traffic: 140 },
    { time: '10:20', traffic: data.activeThreats > 0 ? 5800 : 130 },
    { time: '10:25', traffic: data.activeThreats > 0 ? 6200 : 145 },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: 'calc(100vh - 120px)', minHeight: '600px', gridColumn: '1 / -1' }}>
      {/* 1. Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
        <div className="admin-panel stat-card" style={{ padding: '1.2rem', borderLeft: data.level === 'Critical' ? '4px solid #ef4444' : '4px solid #10b981' }}>
          <h3 style={{ color: 'var(--text-muted)', margin: '0 0 0.3rem 0', fontSize: '0.9rem' }}>Threat Level</h3>
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: data.level === 'Critical' ? '#ef4444' : (data.level === 'Warning' ? '#f59e0b' : '#10b981') }}>
            {data.level.toUpperCase()}
          </div>
        </div>
        <div className="admin-panel stat-card" style={{ padding: '1.2rem' }}>
          <h3 style={{ color: 'var(--text-muted)', margin: '0 0 0.3rem 0', fontSize: '0.9rem' }}>Active Threats</h3>
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: data.activeThreats > 0 ? '#ef4444' : 'var(--text-main)' }}>
            {data.activeThreats}
          </div>
        </div>
        <div className="admin-panel stat-card" style={{ padding: '1.2rem' }}>
          <h3 style={{ color: 'var(--text-muted)', margin: '0 0 0.3rem 0', fontSize: '0.9rem' }}>Blocked Today</h3>
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#3b82f6' }}>
            {data.blockedToday.toLocaleString()}
          </div>
        </div>
        <div className="admin-panel stat-card" style={{ padding: '1.2rem' }}>
          <h3 style={{ color: 'var(--text-muted)', margin: '0 0 0.3rem 0', fontSize: '0.9rem' }}>Total Scanned</h3>
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#c084fc' }}>
            {data.totalScanned.toLocaleString()}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.5fr', gap: '1rem', flex: 1, minHeight: 0 }}>
        {/* 2. Chart */}
        <div className="admin-panel" style={{ display: 'flex', flexDirection: 'column', padding: '1.5rem', marginBottom: 0 }}>
          <h2 style={{ marginBottom: '1rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: data.activeThreats > 0 ? '#ef4444' : 'var(--text-main)' }}>●</span> 
            Live Traffic Monitoring
          </h2>
          <div style={{ flex: 1, minHeight: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#0f172a', borderRadius: '8px' }}
                  itemStyle={{ color: '#ef4444' }}
                />
                <Line type="monotone" dataKey="traffic" stroke={data.activeThreats > 0 ? "#ef4444" : "#10b981"} strokeWidth={4} dot={{ r: 4, fill: '#fff', strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. Recent Logs */}
        <div className="admin-panel" style={{ display: 'flex', flexDirection: 'column', padding: '1.5rem', marginBottom: 0, overflow: 'hidden' }}>
          <h2 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Security Event Logs</h2>
          <div className="table-wrapper" style={{ flex: 1, overflowY: 'auto' }}>
            <table className="product-table" style={{ width: '100%', margin: 0 }}>
              <thead>
                <tr>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Time</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Severity</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Event Type</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Action Taken</th>
                </tr>
              </thead>
              <tbody>
                {(!data.logs || data.logs.length === 0) ? (
                  <tr>
                    <td colSpan={4} className="text-center" style={{ padding: '2rem', color: 'var(--text-muted)' }}>No recent security events.</td>
                  </tr>
                ) : (
                  [...data.logs].reverse().map((log: any, idx: number) => (
                    <tr key={idx} style={{ backgroundColor: log.severity === 'CRITICAL' ? 'rgba(239, 68, 68, 0.05)' : 'transparent' }}>
                      <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)', padding: '0.75rem 0.5rem' }}>{new Date(log.timestamp).toLocaleTimeString()}</td>
                      <td style={{ padding: '0.75rem 0.5rem' }}>
                        <span style={{
                          background: log.severity === 'CRITICAL' ? '#ef4444' : (log.severity === 'HIGH' ? '#f59e0b' : '#3b82f6'),
                          color: '#fff',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          fontSize: '0.7rem',
                          fontWeight: 'bold'
                        }}>
                          {log.severity}
                        </span>
                      </td>
                      <td className="fw-bold" style={{ fontSize: '0.85rem', padding: '0.75rem 0.5rem', color: log.severity === 'CRITICAL' ? '#ef4444' : 'var(--text-main)' }}>{log.type}</td>
                      <td style={{ fontSize: '0.85rem', padding: '0.75rem 0.5rem', color: log.status === 'Resolved' ? '#10b981' : 'var(--text-muted)' }}>
                        {log.action}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
