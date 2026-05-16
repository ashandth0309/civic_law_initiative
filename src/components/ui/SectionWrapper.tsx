import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface Props {
  id: string;
  children: ReactNode;
  className?: string;
  noBorder?: boolean;
}

export default function SectionWrapper({ id, children, className = '', noBorder = false }: Props) {
  return (
    <motion.section
      id={id}
      className={`px-6 py-16 md:py-20 ${noBorder ? '' : 'border-b border-[var(--line)]'} ${className}`}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.section>
  );
}
