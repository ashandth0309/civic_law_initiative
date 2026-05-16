import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import type { Workshop } from '../../types/database';

const QUESTIONS = [
  { key: 'civic_knowledge', label: 'Civic Engagement Knowledge' },
  { key: 'rule_of_law', label: 'Rule of Law Understanding' },
  { key: 'policy_awareness', label: 'Policy Awareness' },
  { key: 'leadership_confidence', label: 'Leadership Confidence' },
];

export default function PostSurveyPage() {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [applicantId, setApplicantId] = useState('');
  const [workshopId, setWorkshopId] = useState('');
  const [scores, setScores] = useState<Record<string, number>>({});
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    supabase.from('workshops').select('*').order('date').then(({ data }) => {
      if (data) setWorkshops(data as Workshop[]);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!applicantId || !workshopId) {
      setError('Please enter your Applicant ID and select a workshop.');
      return;
    }
    if (Object.keys(scores).length < 4) {
      setError('Please answer all questions.');
      return;
    }
    try {
      const { data: app } = await supabase
        .from('applicants')
        .select('id')
        .eq('applicant_id', applicantId)
        .maybeSingle();

      if (!app) {
        setError('Applicant ID not found.');
        return;
      }

      const { error: insertError } = await supabase.from('post_surveys').insert({
        applicant_id: app.id,
        workshop_id: workshopId,
        civic_knowledge: scores.civic_knowledge,
        rule_of_law: scores.rule_of_law,
        policy_awareness: scores.policy_awareness,
        leadership_confidence: scores.leadership_confidence,
        feedback,
      });

      if (insertError) throw insertError;
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Submission failed.');
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ paddingTop: 'calc(44px + 48px + 2rem)', background: 'var(--paper)' }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-md w-full border border-[var(--line)] p-8 text-center">
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2rem', color: 'var(--ink)', marginBottom: '1rem' }}>
            Survey Submitted
          </h2>
          <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '0.9rem', fontWeight: 300, color: '#3a3530' }}>
            Thank you for completing the post-workshop survey. Your feedback helps us improve future programs.
          </p>
        </motion.div>
      </div>
    );
  }

  const inputCls = 'w-full border border-[var(--line)] bg-[var(--paper)] px-4 py-3 text-[0.85rem] font-garamond focus:outline-none focus:border-[var(--ink)]';
  const labelCls = "block mb-1.5 font-mono-custom text-[0.52rem] tracking-[0.14em] uppercase text-[var(--muted)]";

  return (
    <div className="min-h-screen" style={{ paddingTop: 'calc(44px + 48px + 2rem)', background: 'var(--paper)' }}>
      <div className="max-w-xl mx-auto px-6 py-12">
        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(2rem, 5vw, 3rem)', letterSpacing: '0.04em', color: 'var(--ink)', marginBottom: '0.5rem' }}>
          Post-Workshop Survey
        </h1>
        <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '0.95rem', fontWeight: 300, color: '#3a3530', marginBottom: '2.5rem' }}>
          Rate your knowledge and confidence after the workshop on a scale of 1 (low) to 5 (high).
        </p>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5 mb-8">
            <div>
              <label className={labelCls}>Applicant ID</label>
              <input value={applicantId} onChange={e => setApplicantId(e.target.value)} className={inputCls} placeholder="CLI-20260509-1234" />
            </div>
            <div>
              <label className={labelCls}>Workshop</label>
              <select value={workshopId} onChange={e => setWorkshopId(e.target.value)} className={inputCls}>
                <option value="">Select workshop</option>
                {workshops.map(w => (
                  <option key={w.id} value={w.id}>{w.city} — {new Date(w.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</option>
                ))}
              </select>
            </div>
          </div>

          {QUESTIONS.map(q => (
            <div key={q.key} className="mb-8 border-b border-[var(--line)] pb-6">
              <label className="block mb-3" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1rem', fontWeight: 600, color: 'var(--ink)' }}>
                {q.label}
              </label>
              <div className="flex gap-3">
                {[1, 2, 3, 4, 5].map(n => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setScores(s => ({ ...s, [q.key]: n }))}
                    className="w-12 h-12 flex items-center justify-center border transition-all duration-200 cursor-pointer"
                    style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: '1.2rem',
                      borderColor: scores[q.key] === n ? 'var(--blue)' : 'var(--line)',
                      background: scores[q.key] === n ? 'var(--blue)' : 'var(--paper)',
                      color: scores[q.key] === n ? '#fff' : 'var(--ink)',
                    }}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div className="mb-8">
            <label className="block mb-2" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1rem', fontWeight: 600, color: 'var(--ink)' }}>
              Additional Feedback
            </label>
            <textarea
              value={feedback}
              onChange={e => setFeedback(e.target.value)}
              rows={4}
              className={inputCls}
              style={{ resize: 'vertical' }}
              placeholder="Share your thoughts on the workshop..."
            />
          </div>

          {error && <p className="mb-4 text-[var(--red)] font-mono-custom text-[0.75rem]">{error}</p>}

          <button
            type="submit"
            className="w-full px-8 py-3 bg-[var(--blue)] text-white hover:bg-[var(--ink)] transition-colors duration-200"
            style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 500 }}
          >
            Submit Survey
          </button>
        </form>
      </div>
    </div>
  );
}
