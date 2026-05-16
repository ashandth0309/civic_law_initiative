import { motion } from 'framer-motion';
import SectionWrapper from '../ui/SectionWrapper';
import SectionHeader from '../ui/SectionHeader';
import { TIMELINE_ITEMS } from '../../data/constants';

export default function TimelineSection() {
  return (
    <SectionWrapper id="timeline">
      <SectionHeader num="04" sub="Program Schedule" title="May to July 2026" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 border border-[var(--ink)]">
        {TIMELINE_ITEMS.map((item, i) => (
          <motion.div
            key={item.city}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="relative overflow-hidden border-r border-[var(--ink)] last:border-r-0 p-6"
            style={{ minHeight: 180 }}
          >
            <span
              className="block mb-4"
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: '0.75rem',
                letterSpacing: '0.08em',
                color: 'var(--red)',
              }}
            >
              {item.month}
            </span>
            <h4
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: '1.1rem',
                fontWeight: 600,
                color: 'var(--ink)',
                marginBottom: '0.5rem',
              }}
            >
              {item.city}
            </h4>
            <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '0.82rem', fontWeight: 300, color: '#3a3530', lineHeight: 1.6 }}>
              {item.detail}
            </p>
            <span
              className="absolute bottom-3 right-4 opacity-60"
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: '4rem',
                lineHeight: 1,
                color: 'var(--accent)',
              }}
            >
              {String(i + 1).padStart(2, '0')}
            </span>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}
