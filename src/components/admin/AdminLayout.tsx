import { Outlet, NavLink, Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { LayoutDashboard, Users, Calendar, UserCog, Camera, FileBarChart, LogOut } from 'lucide-react';

const NAV = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/applicants', icon: Users, label: 'Applicants' },
  { to: '/admin/workshops', icon: Calendar, label: 'Workshops' },
  { to: '/admin/team', icon: UserCog, label: 'Team' },
  { to: '/admin/attendance', icon: Camera, label: 'Attendance' },
  { to: '/admin/media', icon: Camera, label: 'Media' },
  { to: '/admin/reports', icon: FileBarChart, label: 'Reports' },
];

export default function AdminLayout() {
  const { isAdmin, signOut, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--paper)' }}>
        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.7rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
          Loading...
        </span>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--paper)' }}>
      {/* Sidebar */}
      <aside className="w-56 border-r border-[var(--line)] flex flex-col flex-shrink-0 hidden md:flex">
        <div className="px-5 py-6 border-b border-[var(--line)]">
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.2rem', letterSpacing: '0.06em', color: 'var(--ink)' }}>
            CLI Admin
          </span>
        </div>
        <nav className="flex-1 py-4">
          {NAV.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-5 py-3 no-underline transition-colors duration-200 ${
                  isActive ? 'bg-[var(--accent)] text-[var(--ink)]' : 'text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--accent)]'
                }`
              }
            >
              <Icon size={16} />
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                {label}
              </span>
            </NavLink>
          ))}
        </nav>
        <div className="px-5 py-4 border-t border-[var(--line)]">
          <button
            onClick={signOut}
            className="flex items-center gap-3 text-[var(--muted)] hover:text-[var(--red)] transition-colors duration-200 cursor-pointer bg-transparent border-none"
          >
            <LogOut size={16} />
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Sign Out
            </span>
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-[var(--paper)] border-b border-[var(--line)] px-4 py-3 flex items-center justify-between">
        <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1rem', color: 'var(--ink)' }}>CLI Admin</span>
        <div className="flex gap-2 overflow-x-auto">
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-1 px-2 py-1 no-underline whitespace-nowrap ${
                  isActive ? 'text-[var(--red)]' : 'text-[var(--muted)]'
                }`
              }
              style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.5rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}
            >
              <Icon size={12} />
              {label}
            </NavLink>
          ))}
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 md:pt-0 pt-12 overflow-auto">
        <div className="p-6 md:p-8 max-w-6xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
