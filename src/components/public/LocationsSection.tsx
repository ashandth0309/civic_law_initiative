import { motion } from 'framer-motion';
import { MapPin, Calendar, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import SectionWrapper from '../ui/SectionWrapper';
import SectionHeader from '../ui/SectionHeader';
import { LOCATIONS } from '../../data/constants';
import { supabase } from '../../lib/supabase';
import type { Workshop } from '../../types/database';

export default function LocationsSection() {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);

  useEffect(() => {
    supabase.from('workshops').select('*').order('date').then(({ data }) => {
      if (data) setWorkshops(data as Workshop[]);
    });
  }, []);

  const getWorkshop = (city: string) => workshops.find(w => w.city === city);

  return (
    <SectionWrapper id="locations">
      <SectionHeader num="03" sub="Geographic Reach" title="Five Regions, One Nation" />
      <p
        style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: '0.95rem',
          fontWeight: 300,
          lineHeight: 1.8,
          color: '#2a2520',
          maxWidth: 600,
          marginBottom: '2.5rem',
        }}
      >
        By engaging participants across five distinct regions of Sri Lanka, the project builds a truly national conversation on civic responsibility and rule of law.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 border border-[var(--ink)]">
        {LOCATIONS.map((loc, i) => {
          const ws = getWorkshop(loc.name);
          return (
            <motion.div
              key={loc.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className="group relative overflow-hidden cursor-default border-r border-[var(--ink)] last:border-r-0"
              style={{ minHeight: 220 }}
            >
              <div
                className="absolute inset-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"
                style={{ background: 'var(--blue)' }}
              />
              <div className="relative z-10 p-6 h-full flex flex-col justify-between">
                <div
                  className="flex items-center justify-center w-10 h-10 rounded-full border border-[var(--line)] group-hover:border-white/30 transition-colors duration-300 mb-4"
                  style={{ background: 'var(--accent)' }}
                >
                  <MapPin size={16} className="text-[var(--blue)] group-hover:text-white transition-colors duration-300" />
                </div>
                <div>
                  <span
                    className="block group-hover:text-white transition-colors duration-300"
                    style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: '1.5rem',
                      letterSpacing: '0.04em',
                      color: 'var(--ink)',
                      marginBottom: '0.3rem',
                    }}
                  >
                    {loc.name}
                  </span>
                  <span
                    className="block group-hover:text-white/70 transition-colors duration-300"
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: '0.48rem',
                      letterSpacing: '0.12em',
                      color: 'var(--muted)',
                      textTransform: 'uppercase',
                      marginBottom: '0.15rem',
                    }}
                  >
                    {loc.region}
                  </span>
                  <span
                    className="block group-hover:text-white/50 transition-colors duration-300"
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: '0.44rem',
                      letterSpacing: '0.1em',
                      color: 'var(--line)',
                      textTransform: 'uppercase',
                    }}
                  >
                    {loc.province}
                  </span>
                </div>
                {ws && (
                  <div className="mt-4 pt-3 border-t border-[var(--line)] group-hover:border-white/20 transition-colors duration-300">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Calendar size={11} className="text-[var(--muted)] group-hover:text-white/60 transition-colors duration-300" />
                      <span
                        className="group-hover:text-white/70 transition-colors duration-300"
                        style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.44rem', letterSpacing: '0.08em', color: 'var(--muted)', textTransform: 'uppercase' }}
                      >
                        {loc.date}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users size={11} className="text-[var(--muted)] group-hover:text-white/60 transition-colors duration-300" />
                      <span
                        className="group-hover:text-white/70 transition-colors duration-300"
                        style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.44rem', letterSpacing: '0.08em', color: 'var(--muted)', textTransform: 'uppercase' }}
                      >
                        Capacity: {ws.capacity}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </SectionWrapper>
  );
}
