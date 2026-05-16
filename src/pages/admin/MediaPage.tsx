import { useEffect, useState, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import type { Workshop, MediaItem } from '../../types/database';

const MEDIA_TYPES = ['photo', 'report', 'recommendation', 'facilitator_notes'] as const;

export default function MediaPage() {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [selectedWorkshop, setSelectedWorkshop] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    supabase.from('workshops').select('*').order('date').then(({ data }) => {
      if (data) {
        setWorkshops(data as Workshop[]);
        if (data.length > 0) setSelectedWorkshop(data[0].id);
      }
    });
  }, []);

  useEffect(() => {
    loadMedia();
  }, [selectedWorkshop]);

  const loadMedia = async () => {
    if (!selectedWorkshop) return;
    const { data } = await supabase.from('media').select('*').eq('workshop_id', selectedWorkshop).order('created_at', { ascending: false });
    if (data) setMedia(data as MediaItem[]);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedWorkshop) return;
    setUploading(true);

    const ext = file.name.split('.').pop();
    const path = `workshops/${selectedWorkshop}/${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('media')
      .upload(path, file);

    if (uploadError) {
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(path);

    const type = file.type.startsWith('image/') ? 'photo' : 'report';

    await supabase.from('media').insert({
      workshop_id: selectedWorkshop,
      type,
      url: publicUrl,
      caption: file.name,
    });

    setUploading(false);
    loadMedia();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this media item?')) {
      await supabase.from('media').delete().eq('id', id);
      loadMedia();
    }
  };

  const inputCls = 'border border-[var(--line)] bg-[var(--paper)] px-3 py-2 text-[0.75rem] focus:outline-none focus:border-[var(--ink)]';

  return (
    <div>
      <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2rem', letterSpacing: '0.04em', color: 'var(--ink)', marginBottom: '2rem' }}>
        Media & Documentation
      </h1>

      <div className="flex flex-wrap gap-3 mb-6">
        <select value={selectedWorkshop} onChange={e => setSelectedWorkshop(e.target.value)} className={inputCls}>
          {workshops.map(w => (
            <option key={w.id} value={w.id}>{w.city} — {new Date(w.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</option>
          ))}
        </select>
        <label
          className="px-4 py-2 border-2 border-[var(--red)] text-[var(--red)] hover:bg-[var(--red)] hover:text-white transition-all duration-200 cursor-pointer inline-flex items-center"
          style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.55rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}
        >
          {uploading ? 'Uploading...' : 'Upload File'}
          <input ref={fileRef} type="file" accept="image/*,.pdf,.doc,.docx" onChange={handleUpload} className="hidden" />
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {media.map(m => (
          <div key={m.id} className="border border-[var(--line)] overflow-hidden">
            {m.type === 'photo' ? (
              <img src={m.url} alt={m.caption} className="w-full h-48 object-cover" />
            ) : (
              <div className="w-full h-48 flex items-center justify-center" style={{ background: 'var(--accent)' }}>
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.55rem', letterSpacing: '0.1em', color: 'var(--muted)', textTransform: 'uppercase' }}>
                  {m.type.replace('_', ' ')}
                </span>
              </div>
            )}
            <div className="p-4 flex items-center justify-between">
              <div>
                <span className="block" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '0.85rem', fontWeight: 600, color: 'var(--ink)' }}>
                  {m.caption}
                </span>
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.48rem', letterSpacing: '0.08em', color: 'var(--red)', textTransform: 'uppercase' }}>
                  {m.type.replace('_', ' ')}
                </span>
              </div>
              <button onClick={() => handleDelete(m.id)} className="text-[var(--muted)] hover:text-[var(--red)] cursor-pointer bg-transparent border-none text-sm">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {media.length === 0 && (
        <div className="border border-[var(--line)] p-12 text-center">
          <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '0.9rem', fontWeight: 300, color: 'var(--muted)' }}>
            No media uploaded for this workshop yet.
          </p>
        </div>
      )}
    </div>
  );
}
