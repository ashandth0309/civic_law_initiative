import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await signIn(email, password);
      navigate('/admin');
    } catch {
      setError('Invalid credentials. Please try again.');
    }
  };

  const inputCls = 'w-full border border-[var(--line)] bg-[var(--paper)] px-4 py-3 text-[0.85rem] focus:outline-none focus:border-[var(--ink)]';

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: 'var(--paper)' }}>
      <div className="max-w-sm w-full border border-[var(--line)] p-8">
        <div className="w-14 h-14 mx-auto mb-6 flex items-center justify-center" style={{ background: 'var(--ink)' }}>
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.2rem', color: 'var(--paper)' }}>CLI</span>
        </div>
        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2rem', letterSpacing: '0.04em', color: 'var(--ink)', textAlign: 'center', marginBottom: '0.5rem' }}>
          Admin Login
        </h1>
        <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '0.85rem', fontWeight: 300, color: 'var(--muted)', textAlign: 'center', marginBottom: '2rem' }}>
          Civic Law Initiative Administration
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1.5" style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.52rem', letterSpacing: '0.14em', color: 'var(--muted)', textTransform: 'uppercase' }}>
              Email
            </label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className={inputCls} required />
          </div>
          <div className="mb-6">
            <label className="block mb-1.5" style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.52rem', letterSpacing: '0.14em', color: 'var(--muted)', textTransform: 'uppercase' }}>
              Password
            </label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className={inputCls} required />
          </div>
          {error && <p className="mb-4 text-[var(--red)]" style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.7rem' }}>{error}</p>}
          <button
            type="submit"
            className="w-full py-3 bg-[var(--ink)] text-[var(--paper)] hover:bg-[var(--red)] transition-colors duration-200"
            style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 500 }}
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
