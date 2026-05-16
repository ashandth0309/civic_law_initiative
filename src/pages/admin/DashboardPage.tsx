import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { supabase } from '../../lib/supabase';
import type { Applicant, Kpi } from '../../types/database';

const COLORS = ['#c0392b', '#1a3a5c', '#8a8278', '#e8e0d0', '#142d47'];

export default function DashboardPage() {
  const [stats, setStats] = useState({ total: 0, approved: 0, pending: 0, rejected: 0, checkedIn: 0 });
  const [genderData, setGenderData] = useState<{ name: string; value: number }[]>([]);
  const [regionData, setRegionData] = useState<{ city: string; count: number }[]>([]);
  const [kpis, setKpis] = useState<Kpi[]>([]);

  useEffect(() => {
    supabase.from('applicants').select('status, gender, preferred_workshop_city').then(({ data }) => {
      if (!data) return;
      const apps = data as Pick<Applicant, 'status' | 'gender' | 'preferred_workshop_city'>[];
      setStats({
        total: apps.length,
        approved: apps.filter(a => a.status === 'approved').length,
        pending: apps.filter(a => a.status === 'pending').length,
        rejected: apps.filter(a => a.status === 'rejected').length,
        checkedIn: apps.filter(a => a.status === 'checked_in').length,
      });

      const genderMap: Record<string, number> = {};
      apps.forEach(a => { genderMap[a.gender] = (genderMap[a.gender] || 0) + 1; });
      setGenderData(Object.entries(genderMap).map(([name, value]) => ({ name, value })));

      const regionMap: Record<string, number> = {};
      apps.forEach(a => { regionMap[a.preferred_workshop_city] = (regionMap[a.preferred_workshop_city] || 0) + 1; });
      setRegionData(Object.entries(regionMap).map(([city, count]) => ({ city, count })));
    });

    supabase.from('kpis').select('*').order('label').then(({ data }) => {
      if (data) setKpis(data as Kpi[]);
    });
  }, []);

  const cardCls = "border border-[var(--line)] p-5";
  const cardLabel = { fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.48rem', letterSpacing: '0.14em', color: 'var(--muted)', textTransform: 'uppercase' as const };
  const cardValue = { fontFamily: "'Bebas Neue', sans-serif", fontSize: '2.2rem', lineHeight: 1, color: 'var(--ink)' };

  return (
    <div>
      <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2rem', letterSpacing: '0.04em', color: 'var(--ink)', marginBottom: '2rem' }}>
        Dashboard
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
        {[
          { label: 'Total Applications', value: stats.total, color: 'var(--ink)' },
          { label: 'Approved', value: stats.approved, color: 'var(--blue)' },
          { label: 'Pending', value: stats.pending, color: 'var(--muted)' },
          { label: 'Rejected', value: stats.rejected, color: 'var(--red)' },
          { label: 'Checked In', value: stats.checkedIn, color: 'var(--blue-dark)' },
        ].map(c => (
          <div key={c.label} className={cardCls}>
            <span className="block mb-2" style={cardLabel}>{c.label}</span>
            <span className="block" style={{ ...cardValue, color: c.color }}>{c.value}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-10">
        {kpis.map(kpi => (
          <div key={kpi.key} className={cardCls}>
            <span className="block mb-2" style={cardLabel}>{kpi.label}</span>
            <span className="block" style={{ ...cardValue, color: 'var(--red)' }}>{kpi.value}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className={cardCls}>
          <span className="block mb-6" style={cardLabel}>Participation by City</span>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={regionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" />
              <XAxis dataKey="city" tick={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10 }} />
              <YAxis tick={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10 }} />
              <Tooltip />
              <Bar dataKey="count" fill="var(--blue)" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className={cardCls}>
          <span className="block mb-6" style={cardLabel}>Gender Distribution</span>
          {genderData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={genderData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {genderData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '0.85rem', color: 'var(--muted)' }}>No data yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
