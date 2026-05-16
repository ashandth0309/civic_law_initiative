import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import type { Workshop } from '../../types/database';

export default function WorkshopsPage() {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ city: '', date: '', venue: '', capacity: 30 });
  const [editing, setEditing] = useState<string | null>(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const { data } = await supabase.from('workshops').select('*').order('date');
    if (data) setWorkshops(data as Workshop[]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      await supabase.from('workshops').update(form).eq('id', editing);
    } else {
      await supabase.from('workshops').insert(form);
    }
    setForm({ city: '', date: '', venue: '', capacity: 30 });
    setEditing(null);
    setShowForm(false);
    load();
  };

  const handleEdit = (w: Workshop) => {
    setForm({ city: w.city, date: w.date, venue: w.venue, capacity: w.capacity });
    setEditing(w.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this workshop?')) {
      await supabase.from('workshops').delete().eq('id', id);
      load();
    }
  };

  const inputCls = 'w-full border border-[var(--line)] bg-[var(--paper)] px-4 py-3 text-[0.85rem] focus:outline-none focus:border-[var(--ink)]';
  const labelCls = "block mb-1.5 font-mono-custom text-[0.52rem] tracking-[0.14em] uppercase text-[var(--muted)]";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2rem', letterSpacing: '0.04em', color: 'var(--ink)' }}>
          Workshops
        </h1>
        <button
          onClick={() => { setShowForm(!showForm); setEditing(null); setForm({ city: '', date: '', venue: '', capacity: 30 }); }}
          className="px-4 py-2 border-2 border-[var(--red)] text-[var(--red)] hover:bg-[var(--red)] hover:text-white transition-all duration-200 cursor-pointer"
          style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.55rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}
        >
          {showForm ? 'Cancel' : 'Add Workshop'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="border border-[var(--line)] p-6 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
            <div>
              <label className={labelCls}>City</label>
              <input value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} className={inputCls} required />
            </div>
            <div>
              <label className={labelCls}>Date</label>
              <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className={inputCls} required />
            </div>
            <div>
              <label className={labelCls}>Venue</label>
              <input value={form.venue} onChange={e => setForm(f => ({ ...f, venue: e.target.value }))} className={inputCls} required />
            </div>
            <div>
              <label className={labelCls}>Capacity</label>
              <input type="number" value={form.capacity} onChange={e => setForm(f => ({ ...f, capacity: parseInt(e.target.value) || 0 }))} className={inputCls} required />
            </div>
          </div>
          <button
            type="submit"
            className="mt-6 px-6 py-3 bg-[var(--ink)] text-[var(--paper)] hover:bg-[var(--red)] transition-colors duration-200 cursor-pointer"
            style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.55rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}
          >
            {editing ? 'Update Workshop' : 'Create Workshop'}
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {workshops.map(w => (
          <div key={w.id} className="border border-[var(--line)] p-5">
            <div className="flex items-start justify-between mb-3">
              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.5rem', color: 'var(--ink)', letterSpacing: '0.04em' }}>
                {w.city}
              </span>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(w)} className="text-[var(--muted)] hover:text-[var(--ink)] cursor-pointer bg-transparent border-none text-sm">Edit</button>
                <button onClick={() => handleDelete(w.id)} className="text-[var(--muted)] hover:text-[var(--red)] cursor-pointer bg-transparent border-none text-sm">Delete</button>
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.48rem', letterSpacing: '0.1em', color: 'var(--muted)', textTransform: 'uppercase' }}>Date</span>
                <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '0.85rem', color: 'var(--ink)' }}>
                  {new Date(w.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.48rem', letterSpacing: '0.1em', color: 'var(--muted)', textTransform: 'uppercase' }}>Venue</span>
                <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '0.85rem', color: 'var(--ink)' }}>{w.venue}</span>
              </div>
              <div className="flex items-center gap-2">
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.48rem', letterSpacing: '0.1em', color: 'var(--muted)', textTransform: 'uppercase' }}>Capacity</span>
                <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.2rem', color: 'var(--red)' }}>{w.capacity}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
