import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
import SectionWrapper from '../ui/SectionWrapper';
import SectionHeader from '../ui/SectionHeader';
import { PARTNERS } from '../../data/constants';

export default function PartnersSection() {
  return (
    <SectionWrapper id="partners">
      <SectionHeader num="09" sub="Implementing Partners" title="Who We Are" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {PARTNERS.map((p, i) => (
          <motion.div
            key={p.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.12 }}
            whileHover={{ y: -4 }}
            className="border border-[var(--line)] p-7 cursor-default"
            style={{ transition: 'transform 0.25s ease, box-shadow 0.25s ease' }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.boxShadow = '0 10px 32px rgba(14,14,14,0.1)')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.boxShadow = 'none')}
          >
            <div className="flex items-start gap-4 mb-5">
              <div className="w-11 h-11 flex items-center justify-center flex-shrink-0" style={{ background: 'var(--blue)' }}>
                <Users size={18} color="#fff" />
              </div>
              <div>
                <span className="block" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1.1rem', fontWeight: 600, color: 'var(--ink)', marginBottom: '0.2rem' }}>
                  {p.name}
                </span>
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.5rem', letterSpacing: '0.1em', color: 'var(--red)', textTransform: 'uppercase' }}>
                  {p.role}
                </span>
              </div>
            </div>
            <div className="mb-3 px-3 py-1 inline-block" style={{ background: 'var(--accent)' }}>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.48rem', letterSpacing: '0.1em', color: 'var(--muted)', textTransform: 'uppercase' }}>
                {p.type}
              </span>
            </div>
            <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '0.9rem', fontWeight: 300, lineHeight: 1.7, color: '#3a3530' }}>
              {p.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}
