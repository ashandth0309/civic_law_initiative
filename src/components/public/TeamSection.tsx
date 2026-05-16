import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, User } from 'lucide-react';
import SectionWrapper from '../ui/SectionWrapper';
import SectionHeader from '../ui/SectionHeader';
import { supabase } from '../../lib/supabase';
import type { TeamMember } from '../../types/database';

const COMMITTEES = ['Leadership', 'Finance', 'Logistics', 'PR'];

export default function TeamSection() {
  const [open, setOpen] = useState<string | null>('Leadership');
  const [members, setMembers] = useState<TeamMember[]>([]);

  useEffect(() => {
    supabase
      .from('team_members')
      .select('*')
      .order('committee')
      .order('sort_order')
      .then(({ data }) => {
        if (data) setMembers(data as TeamMember[]);
      });
  }, []);

  const grouped = COMMITTEES.map(committee => ({
    category: committee,
    members: members.filter(m => (m.committee || m.department) === committee),
  }));

  return (
    <SectionWrapper id="team">
      <SectionHeader num="08" sub="Our People" title="Team" />
      <div className="flex flex-col gap-0">
        {grouped.map((cat) => {
          const isOpen = open === cat.category;
          return (
            <div key={cat.category} className="border border-b-0 last:border-b border-[var(--line)]">
              <button
                className="w-full flex items-center justify-between px-6 py-5 text-left cursor-pointer hover:bg-[var(--accent)] transition-colors duration-200"
                onClick={() => setOpen(isOpen ? null : cat.category)}
                aria-expanded={isOpen}
              >
                <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1.1rem', fontWeight: 600, color: 'var(--ink)' }}>
                  {cat.category}
                </span>
                <div className="flex items-center gap-3">
                  <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.48rem', letterSpacing: '0.12em', color: 'var(--muted)', textTransform: 'uppercase' }}>
                    {cat.members.length} {cat.members.length === 1 ? 'member' : 'members'}
                  </span>
                  <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.25 }}>
                    <ChevronDown size={16} color="var(--muted)" />
                  </motion.div>
                </div>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[var(--line)] border-t border-[var(--line)]">
                      {cat.members.map((member) => (
                        <div key={member.id} className="flex items-center gap-4 px-6 py-5 bg-[var(--paper)] hover:bg-[var(--accent)] transition-colors duration-200">
                          <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden" style={{ background: 'var(--accent)', border: '1px solid var(--line)' }}>
                            {member.photo_url ? (
                              <img src={member.photo_url} alt={member.name} className="w-full h-full object-cover" />
                            ) : (
                              <User size={16} color="var(--muted)" />
                            )}
                          </div>
                          <div>
                            <span className="block" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '0.95rem', fontWeight: 600, color: 'var(--ink)' }}>
                              {member.name}
                            </span>
                            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.48rem', letterSpacing: '0.1em', color: 'var(--red)', textTransform: 'uppercase' }}>
                              {member.position}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </SectionWrapper>
  );
}
