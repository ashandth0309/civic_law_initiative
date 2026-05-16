import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { QRCodeSVG } from 'qrcode.react';
import { supabase } from '../../lib/supabase';
import { PROVINCES, WORKSHOP_CITIES, GENDER_OPTIONS, ROLE_OPTIONS } from '../../data/constants';
import type { Applicant } from '../../types/database';

const schema = z.object({
  full_name: z.string().min(2, 'Full name is required'),
  nic_passport: z.string().min(5, 'NIC/Passport is required'),
  date_of_birth: z.string().min(1, 'Date of birth is required'),
  gender: z.string().min(1, 'Select gender'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(9, 'Phone number required'),
  university: z.string().min(1, 'University is required'),
  faculty: z.string().min(1, 'Faculty is required'),
  year: z.string().min(1, 'Year is required'),
  role: z.string().min(1, 'Select role'),
  province: z.string().min(1, 'Select province'),
  district: z.string().min(1, 'District is required'),
  preferred_workshop_city: z.string().min(1, 'Select preferred city'),
  essay: z.string().min(20, 'Please write at least 20 characters'),
});

type FormData = z.infer<typeof schema>;

const STEPS = ['Personal', 'Academic', 'Professional', 'Regional', 'Essay'];

export default function ApplyPage() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [applicant, setApplicant] = useState<Applicant | null>(null);
  const [submitError, setSubmitError] = useState('');

  const { register, handleSubmit, formState: { errors }, trigger, getValues } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      full_name: '', nic_passport: '', date_of_birth: '', gender: '', email: '', phone: '',
      university: '', faculty: '', year: '', role: '', province: '', district: '',
      preferred_workshop_city: '', essay: '',
    },
  });

  const stepFields: (keyof FormData)[][] = [
    ['full_name', 'nic_passport', 'date_of_birth', 'gender', 'email', 'phone'],
    ['university', 'faculty', 'year'],
    ['role'],
    ['province', 'district', 'preferred_workshop_city'],
    ['essay'],
  ];

  const next = async () => {
    const valid = await trigger(stepFields[step]);
    if (valid) setStep(s => Math.min(s + 1, STEPS.length - 1));
  };

  const prev = () => setStep(s => Math.max(s - 1, 0));

  const onSubmit = async (data: FormData) => {
    setSubmitError('');
    try {
      const { data: app, error } = await supabase
        .from('applicants')
        .insert({
          ...data,
          status: 'pending',
          qr_code: '',
        })
        .select()
        .maybeSingle();

      if (error) throw error;
      if (app) {
        const qrValue = `CLI-${app.applicant_id}`;
        await supabase.from('applicants').update({ qr_code: qrValue }).eq('id', app.id);
        setApplicant({ ...app, qr_code: qrValue } as Applicant);
        setSubmitted(true);
      }
    } catch (err: any) {
      setSubmitError(err.message || 'Submission failed. Please try again.');
    }
  };

  const inputCls =
    'w-full border border-[var(--line)] bg-[var(--paper)] px-4 py-3 text-[0.85rem] font-garamond focus:outline-none focus:border-[var(--ink)] transition-colors duration-200';
  const labelCls = "block mb-1.5 font-mono-custom text-[0.52rem] tracking-[0.14em] uppercase text-[var(--muted)]";
  const errCls = "text-[var(--red)] text-[0.7rem] mt-1 font-mono-custom";

  if (submitted && applicant) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ paddingTop: 'calc(44px + 48px + 2rem)', background: 'var(--paper)' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full border border-[var(--line)] p-8 text-center"
        >
          <div className="w-14 h-14 mx-auto mb-6 flex items-center justify-center" style={{ background: 'var(--ink)' }}>
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.2rem', color: 'var(--paper)' }}>CLI</span>
          </div>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2rem', letterSpacing: '0.04em', color: 'var(--ink)', marginBottom: '0.5rem' }}>
            Application Submitted
          </h2>
          <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '0.9rem', fontWeight: 300, color: '#3a3530', marginBottom: '1.5rem' }}>
            Your Applicant ID is
          </p>
          <div
            className="inline-block px-4 py-2 mb-6"
            style={{ background: 'var(--accent)', fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.85rem', letterSpacing: '0.08em', color: 'var(--ink)' }}
          >
            {applicant.applicant_id}
          </div>
          <div className="flex justify-center mb-6">
            <QRCodeSVG value={applicant.qr_code} size={140} />
          </div>
          <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '0.82rem', fontWeight: 300, color: 'var(--muted)', lineHeight: 1.6 }}>
            Save this QR code. You will need it for workshop check-in. A confirmation email will be sent to {applicant.email}.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ paddingTop: 'calc(44px + 48px + 2rem)', background: 'var(--paper)' }}>
      <div className="max-w-2xl mx-auto px-6 py-12">
        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(2rem, 5vw, 3rem)', letterSpacing: '0.04em', color: 'var(--ink)', marginBottom: '0.5rem' }}>
          Participant Application
        </h1>
        <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '0.95rem', fontWeight: 300, color: '#3a3530', marginBottom: '2.5rem' }}>
          Apply to join the Law, Liberty & Civic Responsibility program.
        </p>

        {/* Step indicator */}
        <div className="flex gap-1 mb-10">
          {STEPS.map((s, i) => (
            <div key={s} className="flex-1">
              <div
                className="h-1 transition-colors duration-300"
                style={{ background: i <= step ? 'var(--red)' : 'var(--line)' }}
              />
              <span
                className="block mt-2"
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: '0.44rem',
                  letterSpacing: '0.1em',
                  color: i <= step ? 'var(--ink)' : 'var(--muted)',
                  textTransform: 'uppercase',
                }}
              >
                {s}
              </span>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {step === 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                  <div className="sm:col-span-2">
                    <label className={labelCls}>Full Name</label>
                    <input {...register('full_name')} className={inputCls} />
                    {errors.full_name && <p className={errCls}>{errors.full_name.message}</p>}
                  </div>
                  <div>
                    <label className={labelCls}>NIC / Passport</label>
                    <input {...register('nic_passport')} className={inputCls} />
                    {errors.nic_passport && <p className={errCls}>{errors.nic_passport.message}</p>}
                  </div>
                  <div>
                    <label className={labelCls}>Date of Birth</label>
                    <input type="date" {...register('date_of_birth')} className={inputCls} />
                    {errors.date_of_birth && <p className={errCls}>{errors.date_of_birth.message}</p>}
                  </div>
                  <div>
                    <label className={labelCls}>Gender</label>
                    <select {...register('gender')} className={inputCls}>
                      <option value="">Select</option>
                      {GENDER_OPTIONS.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                    {errors.gender && <p className={errCls}>{errors.gender.message}</p>}
                  </div>
                  <div>
                    <label className={labelCls}>Email</label>
                    <input type="email" {...register('email')} className={inputCls} />
                    {errors.email && <p className={errCls}>{errors.email.message}</p>}
                  </div>
                  <div>
                    <label className={labelCls}>Phone</label>
                    <input {...register('phone')} className={inputCls} />
                    {errors.phone && <p className={errCls}>{errors.phone.message}</p>}
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                  <div className="sm:col-span-2">
                    <label className={labelCls}>University</label>
                    <input {...register('university')} className={inputCls} />
                    {errors.university && <p className={errCls}>{errors.university.message}</p>}
                  </div>
                  <div>
                    <label className={labelCls}>Faculty</label>
                    <input {...register('faculty')} className={inputCls} />
                    {errors.faculty && <p className={errCls}>{errors.faculty.message}</p>}
                  </div>
                  <div>
                    <label className={labelCls}>Year</label>
                    <input {...register('year')} className={inputCls} />
                    {errors.year && <p className={errCls}>{errors.year.message}</p>}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="grid grid-cols-1 gap-y-5">
                  <div>
                    <label className={labelCls}>Role</label>
                    <select {...register('role')} className={inputCls}>
                      <option value="">Select role</option>
                      {ROLE_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                    {errors.role && <p className={errCls}>{errors.role.message}</p>}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                  <div>
                    <label className={labelCls}>Province</label>
                    <select {...register('province')} className={inputCls}>
                      <option value="">Select province</option>
                      {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                    {errors.province && <p className={errCls}>{errors.province.message}</p>}
                  </div>
                  <div>
                    <label className={labelCls}>District</label>
                    <input {...register('district')} className={inputCls} />
                    {errors.district && <p className={errCls}>{errors.district.message}</p>}
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelCls}>Preferred Workshop City</label>
                    <select {...register('preferred_workshop_city')} className={inputCls}>
                      <option value="">Select city</option>
                      {WORKSHOP_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    {errors.preferred_workshop_city && <p className={errCls}>{errors.preferred_workshop_city.message}</p>}
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="grid grid-cols-1 gap-y-5">
                  <div>
                    <label className={labelCls}>Why do you want to join?</label>
                    <textarea {...register('essay')} rows={6} className={inputCls} style={{ resize: 'vertical' }} />
                    {errors.essay && <p className={errCls}>{errors.essay.message}</p>}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {submitError && (
            <p className="mt-4 text-[var(--red)] font-mono-custom text-[0.75rem]">{submitError}</p>
          )}

          <div className="flex justify-between mt-10 pt-6 border-t border-[var(--line)]">
            {step > 0 ? (
              <button
                type="button"
                onClick={prev}
                className="px-6 py-3 border-2 border-[var(--ink)] text-[var(--ink)] hover:bg-[var(--ink)] hover:text-[var(--paper)] transition-all duration-200"
                style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 500 }}
              >
                Previous
              </button>
            ) : (
              <div />
            )}
            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={next}
                className="px-6 py-3 border-2 border-[var(--red)] text-[var(--red)] hover:bg-[var(--red)] hover:text-white transition-all duration-200"
                style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 500 }}
              >
                Continue
              </button>
            ) : (
              <button
                type="submit"
                className="px-8 py-3 bg-[var(--red)] text-white hover:bg-[var(--ink)] transition-colors duration-200"
                style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 500 }}
              >
                Submit Application
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
