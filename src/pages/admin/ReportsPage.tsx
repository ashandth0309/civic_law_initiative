import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import type { Applicant, Workshop, AttendanceRecord, PreSurvey, PostSurvey } from '../../types/database';

export default function ReportsPage() {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [preSurveys, setPreSurveys] = useState<PreSurvey[]>([]);
  const [postSurveys, setPostSurveys] = useState<PostSurvey[]>([]);

  useEffect(() => {
    supabase.from('applicants').select('*').then(({ data }) => { if (data) setApplicants(data as Applicant[]); });
    supabase.from('workshops').select('*').order('date').then(({ data }) => { if (data) setWorkshops(data as Workshop[]); });
    supabase.from('attendance').select('*').then(({ data }) => { if (data) setAttendance(data as AttendanceRecord[]); });
    supabase.from('pre_surveys').select('*').then(({ data }) => { if (data) setPreSurveys(data as PreSurvey[]); });
    supabase.from('post_surveys').select('*').then(({ data }) => { if (data) setPostSurveys(data as PostSurvey[]); });
  }, []);

  const downloadCSV = (filename: string, rows: Record<string, any>[]) => {
    if (rows.length === 0) return;
    const headers = Object.keys(rows[0]);
    const csv = [
      headers.join(','),
      ...rows.map(r => headers.map(h => {
        const val = r[h] ?? '';
        return typeof val === 'string' && (val.includes(',') || val.includes('"'))
          ? `"${val.replace(/"/g, '""')}"`
          : String(val);
      }).join(',')),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const btnCls = "px-4 py-2 border-2 border-[var(--ink)] text-[var(--ink)] hover:bg-[var(--ink)] hover:text-[var(--paper)] transition-all duration-200 cursor-pointer";
  const btnStyle = { fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.55rem', letterSpacing: '0.1em', textTransform: 'uppercase' as const };

  const applicantRows = applicants.map(a => ({
    applicant_id: a.applicant_id,
    full_name: a.full_name,
    email: a.email,
    gender: a.gender,
    role: a.role,
    province: a.province,
    preferred_workshop_city: a.preferred_workshop_city,
    status: a.status,
  }));

  const attendanceRows = attendance.map(a => {
    const app = applicants.find(ap => ap.id === a.applicant_id);
    const ws = workshops.find(w => w.id === a.workshop_id);
    return {
      applicant_id: app?.applicant_id || '',
      name: app?.full_name || '',
      workshop: ws?.city || '',
      status: a.status,
      check_in: a.check_in || '',
      check_out: a.check_out || '',
    };
  });

  const surveyRows = preSurveys.map(ps => {
    const post = postSurveys.find(p => p.applicant_id === ps.applicant_id && p.workshop_id === ps.workshop_id);
    return {
      applicant_id: ps.applicant_id,
      workshop_id: ps.workshop_id,
      pre_civic: ps.civic_knowledge,
      post_civic: post?.civic_knowledge ?? '',
      pre_law: ps.rule_of_law,
      post_law: post?.rule_of_law ?? '',
      pre_policy: ps.policy_awareness,
      post_policy: post?.policy_awareness ?? '',
      pre_leadership: ps.leadership_confidence,
      post_leadership: post?.leadership_confidence ?? '',
      improvement_civic: post ? `${((post.civic_knowledge - ps.civic_knowledge) / ps.civic_knowledge * 100).toFixed(0)}%` : '',
      feedback: post?.feedback ?? '',
    };
  });

  const demographicsRows = applicants.reduce((acc, a) => {
    const key = `${a.preferred_workshop_city}|${a.gender}|${a.role}`;
    if (!acc[key]) acc[key] = { city: a.preferred_workshop_city, gender: a.gender, role: a.role, count: 0 };
    acc[key].count++;
    return acc;
  }, {} as Record<string, { city: string; gender: string; role: string; count: number }>);

  return (
    <div>
      <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2rem', letterSpacing: '0.04em', color: 'var(--ink)', marginBottom: '2rem' }}>
        Reports
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="border border-[var(--line)] p-6">
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.3rem', letterSpacing: '0.04em', color: 'var(--ink)', marginBottom: '0.5rem' }}>
            Applicants
          </h2>
          <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '0.85rem', fontWeight: 300, color: 'var(--muted)', marginBottom: '1rem' }}>
            {applicantRows.length} records
          </p>
          <button className={btnCls} style={btnStyle} onClick={() => downloadCSV('applicants', applicantRows)}>
            Download CSV
          </button>
        </div>

        <div className="border border-[var(--line)] p-6">
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.3rem', letterSpacing: '0.04em', color: 'var(--ink)', marginBottom: '0.5rem' }}>
            Attendance
          </h2>
          <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '0.85rem', fontWeight: 300, color: 'var(--muted)', marginBottom: '1rem' }}>
            {attendanceRows.length} records
          </p>
          <button className={btnCls} style={btnStyle} onClick={() => downloadCSV('attendance', attendanceRows)}>
            Download CSV
          </button>
        </div>

        <div className="border border-[var(--line)] p-6">
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.3rem', letterSpacing: '0.04em', color: 'var(--ink)', marginBottom: '0.5rem' }}>
            Surveys
          </h2>
          <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '0.85rem', fontWeight: 300, color: 'var(--muted)', marginBottom: '1rem' }}>
            {surveyRows.length} records with improvement calculations
          </p>
          <button className={btnCls} style={btnStyle} onClick={() => downloadCSV('surveys', surveyRows)}>
            Download CSV
          </button>
        </div>

        <div className="border border-[var(--line)] p-6">
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.3rem', letterSpacing: '0.04em', color: 'var(--ink)', marginBottom: '0.5rem' }}>
            Demographics
          </h2>
          <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '0.85rem', fontWeight: 300, color: 'var(--muted)', marginBottom: '1rem' }}>
            Breakdown by city, gender, and role
          </p>
          <button className={btnCls} style={btnStyle} onClick={() => downloadCSV('demographics', Object.values(demographicsRows))}>
            Download CSV
          </button>
        </div>
      </div>
    </div>
  );
}
