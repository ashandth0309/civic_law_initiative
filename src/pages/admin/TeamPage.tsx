import { useEffect, useState, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import type { TeamMember } from '../../types/database';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

const COMMITTEES = ['Leadership', 'Finance', 'Logistics', 'PR'];

const defaultForm = {
  name: '',
  position: '',
  department: 'Leadership',
  committee: 'Leadership',
  sort_order: 0,
  photo_url: '',
};

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ ...defaultForm });
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { load(); }, []);

  const load = async () => {
    const { data } = await supabase
      .from('team_members')
      .select('*')
      .order('committee')
      .order('sort_order');
    if (data) setMembers(data as TeamMember[]);
  };

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    const ext = file.name.split('.').pop();
    const path = `${form.committee}/${Date.now()}.${ext}`;

    const { error } = await supabase.storage
      .from('team-photos')
      .upload(path, file, { cacheControl: '3600', upsert: true });

    if (!error) {
      const { data: urlData } = supabase.storage.from('team-photos').getPublicUrl(path);
      setForm(f => ({ ...f, photo_url: urlData.publicUrl }));
      setPreview(urlData.publicUrl);
    } else {
      alert('Upload failed: ' + error.message);
    }
    setUploading(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      handleImageUpload(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      position: form.position,
      department: form.committee,
      committee: form.committee,
      sort_order: form.sort_order,
      photo_url: form.photo_url,
    };

    if (editing) {
      await supabase.from('team_members').update(payload).eq('id', editing);
    } else {
      await supabase.from('team_members').insert(payload);
    }
    resetForm();
    load();
  };

  const handleEdit = (m: TeamMember) => {
    setForm({
      name: m.name,
      position: m.position,
      department: m.department,
      committee: m.committee || m.department,
      sort_order: m.sort_order,
      photo_url: m.photo_url,
    });
    setPreview(m.photo_url || null);
    setEditing(m.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Remove this team member?')) {
      await supabase.from('team_members').delete().eq('id', id);
      load();
    }
  };

  const resetForm = () => {
    setForm({ ...defaultForm });
    setEditing(null);
    setShowForm(false);
    setPreview(null);
    setUploading(false);
    if (fileRef.current) fileRef.current.value = '';
  };

  const inputCls = 'w-full border border-[var(--line)] bg-[var(--paper)] px-4 py-3 text-[0.85rem] focus:outline-none focus:border-[var(--ink)]';
  const labelCls = "block mb-1.5 font-mono-custom text-[0.52rem] tracking-[0.14em] uppercase text-[var(--muted)]";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2rem', letterSpacing: '0.04em', color: 'var(--ink)' }}>
          Team Management
        </h1>
        <button
          onClick={() => { showForm ? resetForm() : (setShowForm(true), setForm({ ...defaultForm }), setPreview(null)); }}
          className="px-4 py-2 border-2 border-[var(--red)] text-[var(--red)] hover:bg-[var(--red)] hover:text-white transition-all duration-200 cursor-pointer"
          style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.55rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}
        >
          {showForm ? 'Cancel' : 'Add Member'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="border border-[var(--line)] p-6 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
            <div>
              <label className={labelCls}>Name</label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className={inputCls} required />
            </div>
            <div>
              <label className={labelCls}>Position</label>
              <input value={form.position} onChange={e => setForm(f => ({ ...f, position: e.target.value }))} className={inputCls} required />
            </div>
            <div>
              <label className={labelCls}>Committee</label>
              <select value={form.committee} onChange={e => setForm(f => ({ ...f, committee: e.target.value, department: e.target.value }))} className={inputCls}>
                {COMMITTEES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Sort Order</label>
              <input type="number" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))} className={inputCls} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>Photo</label>
              <div className="flex items-start gap-4">
                <div
                  className="w-24 h-24 border border-dashed border-[var(--line)] flex items-center justify-center cursor-pointer hover:border-[var(--ink)] transition-colors overflow-hidden flex-shrink-0"
                  onClick={() => fileRef.current?.click()}
                >
                  {preview ? (
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center gap-1 text-[var(--muted)]">
                      <ImageIcon size={20} />
                      <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.45rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Upload</span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    disabled={uploading}
                    className="flex items-center gap-2 px-3 py-2 border border-[var(--line)] text-[var(--muted)] hover:text-[var(--ink)] hover:border-[var(--ink)] transition-colors cursor-pointer bg-transparent text-xs"
                    style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.5rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}
                  >
                    <Upload size={12} />
                    {uploading ? 'Uploading...' : 'Choose File'}
                  </button>
                  {form.photo_url && (
                    <button
                      type="button"
                      onClick={() => { setForm(f => ({ ...f, photo_url: '' })); setPreview(null); if (fileRef.current) fileRef.current.value = ''; }}
                      className="flex items-center gap-1 mt-2 text-[var(--red)] cursor-pointer bg-transparent border-none text-xs"
                      style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.5rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}
                    >
                      <X size={10} /> Remove
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          <button
            type="submit"
            disabled={uploading}
            className="mt-6 px-6 py-3 bg-[var(--ink)] text-[var(--paper)] hover:bg-[var(--red)] transition-colors duration-200 cursor-pointer disabled:opacity-50"
            style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.55rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}
          >
            {editing ? 'Update Member' : 'Add Member'}
          </button>
        </form>
      )}

      {COMMITTEES.map(committee => {
        const deptMembers = members.filter(m => (m.committee || m.department) === committee);
        if (deptMembers.length === 0) return null;
        return (
          <div key={committee} className="mb-8">
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.3rem', letterSpacing: '0.04em', color: 'var(--ink)', marginBottom: '1rem' }}>
              {committee}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {deptMembers.map(m => (
                <div key={m.id} className="border border-[var(--line)] p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden" style={{ background: 'var(--accent)', border: '1px solid var(--line)' }}>
                    {m.photo_url ? (
                      <img src={m.photo_url} alt={m.name} className="w-full h-full object-cover" />
                    ) : (
                      <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1rem', color: 'var(--muted)' }}>
                        {m.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="block truncate" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '0.9rem', fontWeight: 600, color: 'var(--ink)' }}>
                      {m.name}
                    </span>
                    <span className="block truncate" style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.48rem', letterSpacing: '0.08em', color: 'var(--red)', textTransform: 'uppercase' }}>
                      {m.position}
                    </span>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <button onClick={() => handleEdit(m)} className="text-[var(--muted)] hover:text-[var(--ink)] cursor-pointer bg-transparent border-none text-xs">Edit</button>
                    <button onClick={() => handleDelete(m.id)} className="text-[var(--muted)] hover:text-[var(--red)] cursor-pointer bg-transparent border-none text-xs">Del</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
