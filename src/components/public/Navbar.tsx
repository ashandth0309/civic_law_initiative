import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const NAV_LINKS = [
  { to: '/#problem', label: 'Problem' },
  { to: '/#objectives', label: 'Objectives' },
  { to: '/#locations', label: 'Locations' },
  { to: '/#timeline', label: 'Timeline' },
  { to: '/#sustainability', label: 'Sustainability' },
  { to: '/#performance', label: 'Performance' },
  { to: '/#mission', label: 'Mission' },
  { to: '/#team', label: 'Team' },
  { to: '/#partners', label: 'Partners' },
  { to: '/apply', label: 'Apply' },
  { to: '/#contact', label: 'Contact' },
];

export default function Navbar() {
  const [active, setActive] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const location = useLocation();

  // scroll to section
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');

      setTimeout(() => {
        const el = document.getElementById(id);

        if (el) {
          el.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
      }, 100);
    }

    setMenuOpen(false);
  }, [location]);

  // active section
  useEffect(() => {
    const onScroll = () => {
      const scrollPos = window.scrollY + 150;
      let current = '';

      NAV_LINKS.forEach(({ to }) => {
        if (to.startsWith('/#')) {
          const id = to.substring(2);
          const el = document.getElementById(id);

          if (el && el.offsetTop <= scrollPos) {
            current = id;
          }
        }
      });

      setActive(current);
    };

    window.addEventListener('scroll', onScroll);

    onScroll();

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navStyle = {
    background: 'rgba(247,244,239,0.96)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
  };

  return (
    <>
      {/* top bar */}
      <nav
        className="fixed left-0 right-0 z-50 border-b border-[var(--line)]"
        style={{
          top: 44,
          height: 48,
          ...navStyle,
        }}
      >
        {/* Desktop */}
        <div className="hidden md:flex h-full items-center justify-center gap-4 px-4">
          {NAV_LINKS.map(({ to, label }) => {
            const id = to.startsWith('/#') ? to.substring(2) : '';
            const isActive = id && active === id;
            const isApply = to === '/apply';

            return (
              <Link
                key={to}
                to={to}
                className="no-underline whitespace-nowrap"
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: '0.58rem',
                  letterSpacing: '0.1em',
                  color:
                    isApply || isActive
                      ? 'var(--red)'
                      : 'var(--ink)',
                  fontWeight:
                    isApply || isActive
                      ? 500
                      : 400,
                  textTransform: 'uppercase',
                  padding: isApply ? '0.25rem 0.6rem' : '0',
                  border: isApply
                    ? '1px solid var(--red)'
                    : 'none',
                }}
              >
                {label}
              </Link>
            );
          })}
        </div>

        {/* Mobile */}
        <div className="md:hidden h-full flex items-center justify-end px-4">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-xl"
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div
          className="fixed left-0 right-0 z-40 md:hidden border-b border-[var(--line)] flex flex-col"
          style={{
            top: 92,
            ...navStyle,
          }}
        >
          {NAV_LINKS.map(({ to, label }) => {
            const id = to.startsWith('/#') ? to.substring(2) : '';
            const isActive = id && active === id;

            return (
              <Link
                key={to}
                to={to}
                className="px-4 py-3 no-underline border-b border-[var(--line)]"
                style={{
                  color: isActive
                    ? 'var(--red)'
                    : 'var(--ink)',
                  textTransform: 'uppercase',
                  fontSize: '0.75rem',
                  fontFamily: "'IBM Plex Mono', monospace",
                }}
              >
                {label}
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
