import { motion } from 'framer-motion';
import SectionWrapper from '../ui/SectionWrapper';
import SectionHeader from '../ui/SectionHeader';
import { OBJECTIVES } from '../../data/constants';

export default function ObjectivesSection() {
  return (
    <SectionWrapper id="objectives">
      <SectionHeader num="02" sub="Program Objectives" title="Three Pillars" />
      <div className="flex flex-col">
        {OBJECTIVES.map((obj, i) => (
          <motion.div
            key={obj.num}
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="group grid border-b border-[var(--line)] transition-all duration-300 hover:bg-[var(--accent)] cursor-default"
            style={{ gridTemplateColumns: '70px 1fr', gap: '1.5rem', alignItems: 'start', padding: '1.5rem 0' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.padding = '1.5rem'; (e.currentTarget as HTMLElement).style.margin = '0 -1.5rem'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.padding = '1.5rem 0'; (e.currentTarget as HTMLElement).style.margin = '0'; }}
          >
            <span
              className="group-hover:text-[var(--red)] transition-colors duration-300"
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: '2.8rem',
                lineHeight: 1,
                color: 'var(--line)',
              }}
            >
              {obj.num}
            </span>
            <div>
              <h3
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: '1.15rem',
                  fontWeight: 600,
                  color: 'var(--ink)',
                  marginBottom: '0.4rem',
                }}
              >
                {obj.title}
              </h3>
              <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '0.9rem', fontWeight: 300, lineHeight: 1.7, color: '#3a3530' }}>
                {obj.body}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}
