import { Link } from 'react-router-dom';

export default function Topbar() {
  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-4 sm:px-6 border-b-2 border-[var(--ink)] bg-[var(--paper)]"
      style={{ height: 44 }}
    >
      <span
        className="hidden sm:block text-[var(--muted)] uppercase tracking-widest"
        style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.5rem' }}
      >
        SUSI Rule of Law Alumni · Sri Lanka
      </span>
      <Link
        to="/"
        className="font-bold tracking-wider text-[var(--ink)] whitespace-nowrap no-underline"
        style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1rem', letterSpacing: '0.08em' }}
      >
        Civic Law Initiative
      </Link>
      <span
        className="text-[var(--muted)] uppercase tracking-widest"
        style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.5rem' }}
      >
        Sri Lanka · 2026
      </span>
    </div>
  );
}
