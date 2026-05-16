import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import type { Applicant, Workshop, AttendanceRecord } from '../../types/database';

export default function AttendancePage() {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [selectedWorkshop, setSelectedWorkshop] = useState('');
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [scanId, setScanId] = useState('');

  useEffect(() => {
    supabase.from('workshops').select('*').order('date').then(({ data }) => {
      if (data) {
        setWorkshops(data as Workshop[]);
        if (data.length > 0) setSelectedWorkshop(data[0].id);
      }
    });
    supabase.from('applicants').select('*').eq('status', 'approved').order('full_name').then(({ data }) => {
      if (data) setApplicants(data as Applicant[]);
    });
  }, []);

  useEffect(() => {
    if (!selectedWorkshop) return;
    supabase.from('attendance').select('*').eq('workshop_id', selectedWorkshop).then(({ data }) => {
      if (data) setAttendance(data as AttendanceRecord[]);
    });
  }, [selectedWorkshop]);

  const checkIn = async (applicantId: string) => {
    const existing = attendance.find(a => a.applicant_id === applicantId);
    if (existing) {
      await supabase.from('attendance').update({ status: 'present', check_in: new Date().toISOString() }).eq('id', existing.id);
    } else {
      await supabase.from('attendance').insert({
        applicant_id: applicantId,
        workshop_id: selectedWorkshop,
        status: 'present',
        check_in: new Date().toISOString(),
      });
    }
    const { data } = await supabase.from('attendance').select('*').eq('workshop_id', selectedWorkshop);
    if (data) setAttendance(data as AttendanceRecord[]);
  };

  const checkOut = async (applicantId: string) => {
    const record = attendance.find(a => a.applicant_id === applicantId);
    if (record) {
      await supabase.from('attendance').update({ check_out: new Date().toISOString() }).eq('id', record.id);
      const { data } = await supabase.from('attendance').select('*').eq('workshop_id', selectedWorkshop);
      if (data) setAttendance(data as AttendanceRecord[]);
    }
  };

  const markAbsent = async (applicantId: string) => {
    const existing = attendance.find(a => a.applicant_id === applicantId);
    if (existing) {
      await supabase.from('attendance').update({ status: 'absent' }).eq('id', existing.id);
    } else {
      await supabase.from('attendance').insert({
        applicant_id: applicantId,
        workshop_id: selectedWorkshop,
        status: 'absent',
      });
    }
    const { data } = await supabase.from('attendance').select('*').eq('workshop_id', selectedWorkshop);
    if (data) setAttendance(data as AttendanceRecord[]);
  };

  const handleScan = () => {
    const app = applicants.find(a => a.qr_code === scanId || a.applicant_id === scanId);
    if (app) {
      checkIn(app.id);
      setScanId('');
    }
  };

  const getStatus = (applicantId: string) => {
    const record = attendance.find(a => a.applicant_id === applicantId);
    return record?.status || 'not_recorded';
  };

  const inputCls = 'border border-[var(--line)] bg-[var(--paper)] px-3 py-2 text-[0.75rem] focus:outline-none focus:border-[var(--ink)]';

  return (
    <div>
      <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2rem', letterSpacing: '0.04em', color: 'var(--ink)', marginBottom: '2rem' }}>
        Attendance
      </h1>

      <div className="flex flex-wrap gap-3 mb-6">
        <select value={selectedWorkshop} onChange={e => setSelectedWorkshop(e.target.value)} className={inputCls}>
          {workshops.map(w => (
            <option key={w.id} value={w.id}>{w.city} — {new Date(w.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</option>
          ))}
        </select>
        <div className="flex gap-2">
          <input
            value={scanId}
            onChange={e => setScanId(e.target.value)}
            placeholder="Scan QR or enter Applicant ID..."
            className={inputCls}
            style={{ minWidth: 260 }}
            onKeyDown={e => { if (e.key === 'Enter') handleScan(); }}
          />
          <button
            onClick={handleScan}
            className="px-4 py-2 bg-[var(--red)] text-white hover:bg-[var(--ink)] transition-colors duration-200 cursor-pointer"
            style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.55rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}
          >
            Check In
          </button>
        </div>
      </div>

      <div className="overflow-x-auto border border-[var(--line)]">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr style={{ background: 'var(--accent)' }}>
              {['ID', 'Name', 'City', 'Status', 'Check In', 'Check Out', 'Actions'].map(h => (
                <th key={h} className="text-left px-4 py-3" style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.48rem', letterSpacing: '0.14em', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 500 }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {applicants.filter(a => a.preferred_workshop_city === workshops.find(w => w.id === selectedWorkshop)?.city).map(a => {
              const status = getStatus(a.id);
              const record = attendance.find(r => r.applicant_id === a.id);
              return (
                <tr key={a.id} className="border-t border-[var(--line)]">
                  <td className="px-4 py-3" style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.6rem' }}>{a.applicant_id}</td>
                  <td className="px-4 py-3" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '0.85rem', fontWeight: 600 }}>{a.full_name}</td>
                  <td className="px-4 py-3" style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.55rem', color: 'var(--muted)' }}>{a.preferred_workshop_city}</td>
                  <td className="px-4 py-3">
                    <span
                      className="inline-block px-2 py-0.5"
                      style={{
                        fontFamily: "'IBM Plex Mono', monospace",
                        fontSize: '0.48rem',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        color: status === 'present' ? 'var(--blue)' : status === 'absent' ? 'var(--red)' : 'var(--muted)',
                        border: `1px solid ${status === 'present' ? 'var(--blue)' : status === 'absent' ? 'var(--red)' : 'var(--line)'}`,
                      }}
                    >
                      {status === 'not_recorded' ? 'Not Recorded' : status}
                    </span>
                  </td>
                  <td className="px-4 py-3" style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.55rem', color: 'var(--muted)' }}>
                    {record?.check_in ? new Date(record.check_in).toLocaleTimeString() : '—'}
                  </td>
                  <td className="px-4 py-3" style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.55rem', color: 'var(--muted)' }}>
                    {record?.check_out ? new Date(record.check_out).toLocaleTimeString() : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button
                        onClick={() => checkIn(a.id)}
                        className="px-2 py-1 text-[0.5rem] font-mono-custom tracking-wider uppercase border border-[var(--blue)] text-[var(--blue)] hover:bg-[var(--blue)] hover:text-white cursor-pointer transition-colors duration-200"
                      >
                        Check In
                      </button>
                      <button
                        onClick={() => checkOut(a.id)}
                        className="px-2 py-1 text-[0.5rem] font-mono-custom tracking-wider uppercase border border-[var(--muted)] text-[var(--muted)] hover:bg-[var(--muted)] hover:text-white cursor-pointer transition-colors duration-200"
                      >
                        Check Out
                      </button>
                      <button
                        onClick={() => markAbsent(a.id)}
                        className="px-2 py-1 text-[0.5rem] font-mono-custom tracking-wider uppercase border border-[var(--red)] text-[var(--red)] hover:bg-[var(--red)] hover:text-white cursor-pointer transition-colors duration-200"
                      >
                        Absent
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
