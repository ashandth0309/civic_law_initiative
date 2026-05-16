import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import type { Applicant } from '../../types/database';

export default function ApplicantsPage() {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selected, setSelected] = useState<Applicant | null>(null);

  useEffect(() => {
    loadApplicants();
  }, []);

  const loadApplicants = async () => {
    const { data } = await supabase.from('applicants').select('*').order('created_at', { ascending: false });
    if (data) setApplicants(data as Applicant[]);
  };

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('applicants').update({ status }).eq('id', id);
    loadApplicants();
    if (selected?.id === id) setSelected(s => s ? { ...s, status: status as Applicant['status'] } : null);
  };

  const filtered = applicants.filter(a => {
    const matchSearch = a.full_name.toLowerCase().includes(search.toLowerCase()) ||
      a.applicant_id.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !filterStatus || a.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const statusColor = (s: string) => {
    switch (s) {
      case 'approved': return 'var(--blue)';
      case 'rejected': return 'var(--red)';
      case 'checked_in': return 'var(--blue-dark)';
      case 'waitlisted': return 'var(--muted)';
      default: return 'var(--ink)';
    }
  };

  const inputCls = 'border border-[var(--line)] bg-[var(--paper)] px-3 py-2 text-[0.75rem] focus:outline-none focus:border-[var(--ink)]';
  const btnCls = 'px-3 py-1.5 text-[0.55rem] font-mono-custom tracking-wider uppercase border cursor-pointer transition-colors duration-200';

  return (
    <div>
      <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2rem', letterSpacing: '0.04em', color: 'var(--ink)', marginBottom: '2rem' }}>
        Applicants
      </h1>

      <div className="flex flex-wrap gap-3 mb-6">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, ID, or email..."
          className={inputCls}
          style={{ minWidth: 240 }}
        />
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className={inputCls}>
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="waitlisted">Waitlisted</option>
          <option value="checked_in">Checked In</option>
        </select>
        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.55rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', alignSelf: 'center' }}>
          {filtered.length} results
        </span>
      </div>

      <div className="overflow-x-auto border border-[var(--line)]">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr style={{ background: 'var(--accent)' }}>
              {['ID', 'Name', 'Region', 'Role', 'Gender', 'Status', 'Actions'].map(h => (
                <th key={h} className="text-left px-4 py-3" style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.48rem', letterSpacing: '0.14em', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 500 }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(a => (
              <tr key={a.id} className="border-t border-[var(--line)] hover:bg-[var(--accent)] transition-colors duration-150 cursor-pointer" onClick={() => setSelected(a)}>
                <td className="px-4 py-3" style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.65rem', letterSpacing: '0.06em' }}>
                  {a.applicant_id}
                </td>
                <td className="px-4 py-3" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '0.85rem', fontWeight: 600 }}>
                  {a.full_name}
                </td>
                <td className="px-4 py-3" style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.55rem', color: 'var(--muted)' }}>
                  {a.preferred_workshop_city}
                </td>
                <td className="px-4 py-3" style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.55rem', color: 'var(--muted)' }}>
                  {a.role}
                </td>
                <td className="px-4 py-3" style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.55rem', color: 'var(--muted)' }}>
                  {a.gender}
                </td>
                <td className="px-4 py-3">
                  <span className="inline-block px-2 py-0.5" style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.48rem', letterSpacing: '0.1em', color: statusColor(a.status), textTransform: 'uppercase', border: `1px solid ${statusColor(a.status)}` }}>
                    {a.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                  <div className="flex gap-1">
                    {a.status === 'pending' && (
                      <>
                        <button className={`${btnCls} border-[var(--blue)] text-[var(--blue)] hover:bg-[var(--blue)] hover:text-white`} onClick={() => updateStatus(a.id, 'approved')}>Approve</button>
                        <button className={`${btnCls} border-[var(--red)] text-[var(--red)] hover:bg-[var(--red)] hover:text-white`} onClick={() => updateStatus(a.id, 'rejected')}>Reject</button>
                      </>
                    )}
                    {a.status === 'approved' && (
                      <button className={`${btnCls} border-[var(--blue-dark)] text-[var(--blue-dark)] hover:bg-[var(--blue-dark)] hover:text-white`} onClick={() => updateStatus(a.id, 'checked_in')}>Check In</button>
                    )}
                    {a.status === 'rejected' && (
                      <button className={`${btnCls} border-[var(--muted)] text-[var(--muted)] hover:bg-[var(--muted)] hover:text-white`} onClick={() => updateStatus(a.id, 'waitlisted')}>Waitlist</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail drawer */}
      {selected && (
        <div className="fixed inset-0 z-50 flex justify-end" onClick={() => setSelected(null)}>
          <div className="absolute inset-0 bg-black/30" />
          <div
            className="relative w-full max-w-md bg-[var(--paper)] border-l border-[var(--line)] overflow-auto p-6"
            onClick={e => e.stopPropagation()}
          >
            <button onClick={() => setSelected(null)} className="absolute top-4 right-4 text-[var(--muted)] hover:text-[var(--ink)] cursor-pointer bg-transparent border-none text-lg">&times;</button>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.5rem', color: 'var(--ink)', marginBottom: '1.5rem' }}>
              {selected.full_name}
            </h2>
            <div className="space-y-3">
              {Object.entries({
                'Applicant ID': selected.applicant_id,
                Email: selected.email,
                Phone: selected.phone,
                Gender: selected.gender,
                NIC: selected.nic_passport,
                DOB: selected.date_of_birth,
                University: selected.university,
                Faculty: selected.faculty,
                Year: selected.year,
                Role: selected.role,
                Province: selected.province,
                District: selected.district,
                'Preferred City': selected.preferred_workshop_city,
                Status: selected.status,
              }).map(([k, v]) => (
                <div key={k} className="flex gap-4 border-b border-[var(--line)] pb-2">
                  <span className="w-28 flex-shrink-0" style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.48rem', letterSpacing: '0.12em', color: 'var(--muted)', textTransform: 'uppercase' }}>
                    {k}
                  </span>
                  <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '0.85rem', color: 'var(--ink)' }}>
                    {v}
                  </span>
                </div>
              ))}
              <div className="pt-2">
                <span className="block mb-1" style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.48rem', letterSpacing: '0.12em', color: 'var(--muted)', textTransform: 'uppercase' }}>Essay</span>
                <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '0.85rem', fontWeight: 300, lineHeight: 1.7, color: '#3a3530' }}>
                  {selected.essay}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
