import React, { useState, useEffect } from 'react';
import { sound } from '../utils/audio';
import { Sparkles, Send, Star, Info } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const SEED_GUESTBOOK_DREAMS = [
  {
    id: 'seed-1',
    author: 'Aria M.',
    category: 'Flight',
    text: 'I dream of floating in a hot-air balloon across a twilight sea of pink clouds.',
    stars: 14,
    date: 'Just now',
    color: '#A8D9FF'
  },
  {
    id: 'seed-2',
    author: 'Ren K.',
    category: 'Discovery',
    text: 'To build a clock that measures kindness instead of seconds.',
    stars: 23,
    date: '1 hour ago',
    color: '#FFD985'
  },
  {
    id: 'seed-3',
    author: 'Lina S.',
    category: 'Healing',
    text: 'May everyone with a heavy heart tonight wake up to gentle morning sunshine.',
    stars: 38,
    date: '3 hours ago',
    color: '#D99BCB'
  },
  {
    id: 'seed-4',
    author: 'Kenzo',
    category: 'Adventure',
    text: 'I want to sketch the stars from the top of the highest snowy lighthouse.',
    stars: 19,
    date: 'Yesterday',
    color: '#B6A4FF'
  }
];

// Simple content safety filter to keep the dream world peaceful and safe
const BLOCKED_WORDS = ['spam', 'viagra', 'casino', 'http://', 'https://', 'free money', 'crypto'];

export const DreamGuestbook = () => {
  const [dreams, setDreams] = useState(() => {
    try {
      const saved = localStorage.getItem('yuvvi_dream_guestbook');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {}
    return SEED_GUESTBOOK_DREAMS;
  });

  const [authorName, setAuthorName] = useState('');
  const [dreamText, setDreamText] = useState('');
  const [category, setCategory] = useState('Flight');
  const [starColor, setStarColor] = useState('#FFD985');
  const [filterCategory, setFilterCategory] = useState('All');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dbStatus, setDbStatus] = useState('local'); // 'connected' | 'offline' | 'local'
  const [starredIds, setStarredIds] = useState(() => {
    try {
      const saved = sessionStorage.getItem('yuvvi_starred_ids');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Persist locally for offline resilience
  useEffect(() => {
    try {
      localStorage.setItem('yuvvi_dream_guestbook', JSON.stringify(dreams));
    } catch {}
  }, [dreams]);

  // Load from Supabase on mount if configured
  useEffect(() => {
    let isMounted = true;

    async function loadEntries() {
      if (!isSupabaseConfigured() || !supabase) {
        if (isMounted) setDbStatus('local');
        return;
      }

      try {
        const { data, error } = await supabase
          .from('guestbook_entries')
          .select('*')
          .eq('is_approved', true)
          .order('created_at', { ascending: false })
          .limit(50);

        if (error) {
          console.warn('Supabase guestbook fetch failed, using local storage fallback:', error.message);
          if (isMounted) setDbStatus('offline');
        } else if (data && data.length > 0) {
          if (isMounted) {
            const mapped = data.map((item) => ({
              id: item.id,
              author: item.author || item.display_name || 'Anonymous Dreamer',
              category: item.category || 'Flight',
              text: item.text || item.dream_text || '',
              stars: Number(item.stars) || 1,
              date: item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Starlight',
              color: item.star_color || item.color || '#FFD985'
            }));
            setDreams(mapped);
            setDbStatus('connected');
          }
        } else {
          if (isMounted) setDbStatus('connected');
        }
      } catch (err) {
        console.warn('Network issue reaching Supabase guestbook:', err);
        if (isMounted) setDbStatus('offline');
      }
    }

    loadEntries();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const trimmedText = dreamText.trim();
    if (trimmedText.length < 8) {
      setErrorMsg('Please share a dream of at least 8 characters so Yuvvi can keep it safe.');
      return;
    }
    if (trimmedText.length > 280) {
      setErrorMsg('Dreams are best kept short and sweet (under 280 characters).');
      return;
    }

    // Content safety validation
    const lower = trimmedText.toLowerCase();
    for (const word of BLOCKED_WORDS) {
      if (lower.includes(word)) {
        setErrorMsg('To protect the gentle dream world, links and promotional text cannot be accepted.');
        return;
      }
    }

    setIsSubmitting(true);
    sound.playWishPlanted();

    const authorDisplayName = authorName.trim() || 'Anonymous Dreamer';
    const localEntry = {
      id: `guest-${Date.now()}`,
      author: authorDisplayName,
      category,
      text: trimmedText,
      stars: 1,
      date: 'Just now',
      color: starColor
    };

    setDreams((prev) => [localEntry, ...prev]);
    setDreamText('');
    setAuthorName('');

    if (isSupabaseConfigured() && supabase) {
      try {
        const { error } = await supabase
          .from('guestbook_entries')
          .insert([
            {
              author: authorDisplayName,
              text: trimmedText,
              category,
              star_color: starColor,
              stars: 1,
              is_approved: false
            }
          ]);

        if (error) {
          console.warn('Supabase insert failed, reverting local dream:', error.message);
          setDbStatus('offline');
          setDreams((prev) => prev.filter((d) => d.id !== localEntry.id));
          setErrorMsg(`Database submission could not be completed: ${error.message}`);
        } else {
          setDbStatus('connected');
          setSuccessMsg('✨ Inscribed in the Live Starlight Guestbook! (Awaiting starlight blessing)');
        }
      } catch (err) {
        console.warn('Network issue during guestbook insert:', err);
        setDbStatus('offline');
        setDreams((prev) => prev.filter((d) => d.id !== localEntry.id));
        setErrorMsg('Network connection error: could not reach the cloud database. Please try again.');
      }
    } else {
      setSuccessMsg('✨ Your dream has been inscribed in the Starlight Guestbook!');
    }

    setIsSubmitting(false);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleSendStar = async (id) => {
    // Prevent repeated-click abuse from same session
    if (starredIds.includes(id)) {
      sound.playChime(523.25, 'sine', 0.2);
      return;
    }

    sound.playChime(784, 'sine', 0.35);
    const updatedStarred = [...starredIds, id];
    setStarredIds(updatedStarred);
    try {
      sessionStorage.setItem('yuvvi_starred_ids', JSON.stringify(updatedStarred));
    } catch {}

    setDreams((prev) =>
      prev.map((d) => (d.id === id ? { ...d, stars: d.stars + 1 } : d))
    );

    if (isSupabaseConfigured() && supabase && !String(id).startsWith('seed-') && !String(id).startsWith('guest-')) {
      try {
        const { error } = await supabase.rpc('increment_guestbook_star', { entry_id: id });
        if (error) {
          console.warn('Could not increment star count in Supabase:', error.message);
        }
      } catch (err) {
        console.warn('Could not increment star count in Supabase:', err);
      }
    }
  };

  const filteredDreams =
    filterCategory === 'All'
      ? dreams
      : dreams.filter((d) => d.category === filterCategory);

  return (
    <div
      className="dream-guestbook"
      style={{
        backgroundColor: 'var(--color-card-bg)',
        border: '1.5px solid var(--color-card-border)',
        borderRadius: '24px',
        padding: '2.5rem',
        margin: '3rem 0',
        boxShadow: 'var(--shadow-md)'
      }}
    >
      <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.65rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
          <div className="badge badge-gold">
            <Sparkles size={14} />
            <span>Live Starlight Guestbook</span>
          </div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '0.25rem 0.75rem',
              borderRadius: '999px',
              fontSize: '0.76rem',
              fontFamily: 'var(--font-rounded)',
              backgroundColor:
                dbStatus === 'connected'
                  ? 'rgba(85, 239, 196, 0.12)'
                  : dbStatus === 'offline'
                  ? 'rgba(255, 118, 117, 0.12)'
                  : 'rgba(255, 217, 133, 0.12)',
              border:
                dbStatus === 'connected'
                  ? '1px solid rgba(85, 239, 196, 0.35)'
                  : dbStatus === 'offline'
                  ? '1px solid rgba(255, 118, 117, 0.35)'
                  : '1px solid rgba(255, 217, 133, 0.35)',
              color:
                dbStatus === 'connected'
                  ? '#55efc4'
                  : dbStatus === 'offline'
                  ? '#ff7675'
                  : '#FFD985'
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor:
                  dbStatus === 'connected' ? '#55efc4' : dbStatus === 'offline' ? '#ff7675' : '#FFD985',
                boxShadow:
                  dbStatus === 'connected' ? '0 0 6px #55efc4' : 'none'
              }}
            />
            <span>
              {dbStatus === 'connected'
                ? 'Supabase Cloud Connected'
                : dbStatus === 'offline'
                ? 'Offline (Local Fallback)'
                : 'Local Storage Memory'}
            </span>
          </div>
        </div>
        <h3 style={{ fontSize: 'clamp(1.8rem, 3.2vw, 2.4rem)', margin: '0 0 0.8rem', color: 'var(--color-text-main)' }}>
          Whisper Your Dream into the World
        </h3>
        <p style={{ fontSize: '1.05rem', color: 'var(--color-text-sub)', lineHeight: 1.6 }}>
          Leave a note for fellow dreamers. Every submission is saved and blessed with starlight.
        </p>
      </div>

      {/* Submission Form */}
      <form
        onSubmit={handleSubmit}
        style={{
          maxWidth: '620px',
          margin: '0 auto 3rem',
          backgroundColor: 'rgba(21, 21, 45, 0.65)',
          padding: '1.8rem',
          borderRadius: '18px',
          border: '1px solid var(--color-indigo-border)'
        }}
      >
        <div style={{ marginBottom: '1.2rem' }}>
          <label
            htmlFor="guestbook-author"
            style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: 'var(--color-text-main)', marginBottom: '6px' }}
          >
            Your Dreamer Name (Optional)
          </label>
          <input
            id="guestbook-author"
            type="text"
            placeholder="e.g. Star Wanderer, Oliver..."
            maxLength={32}
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              borderRadius: '12px',
              backgroundColor: 'rgba(12, 12, 26, 0.85)',
              border: '1px solid var(--color-indigo-border)',
              color: 'var(--color-text-main)',
              fontSize: '0.95rem'
            }}
          />
        </div>

        <div style={{ marginBottom: '1.2rem' }}>
          <label
            htmlFor="guestbook-text"
            style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: 'var(--color-text-main)', marginBottom: '6px' }}
          >
            Your Dream or Quiet Hope <span style={{ color: 'var(--color-gold)' }}>*</span>
          </label>
          <textarea
            id="guestbook-text"
            rows={3}
            placeholder="What is a gentle daydream you want to keep alive?"
            maxLength={280}
            required
            value={dreamText}
            onChange={(e) => setDreamText(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              borderRadius: '12px',
              backgroundColor: 'rgba(12, 12, 26, 0.85)',
              border: '1px solid var(--color-indigo-border)',
              color: 'var(--color-text-main)',
              fontSize: '0.98rem',
              resize: 'vertical',
              fontFamily: 'var(--font-serif)',
              lineHeight: 1.6
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
            {dreamText.length}/280
          </div>
        </div>

        {/* Category & Starlight Color Picker */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: 'var(--color-text-main)', marginBottom: '6px' }}>
              Dream Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                borderRadius: '10px',
                backgroundColor: 'rgba(12, 12, 26, 0.85)',
                border: '1px solid var(--color-indigo-border)',
                color: 'var(--color-text-main)',
                fontSize: '0.9rem'
              }}
            >
              <option value="Flight">🕊️ Flight & Wonder</option>
              <option value="Discovery">🔭 Discovery & Inventions</option>
              <option value="Healing">🌸 Healing & Peace</option>
              <option value="Adventure">⛵ Sea & Sky Adventure</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: 'var(--color-text-main)', marginBottom: '6px' }}>
              Starlight Lantern Tone
            </label>
            <div style={{ display: 'flex', gap: '8px', paddingTop: '4px' }}>
              {[
                { col: '#FFD985', name: 'Gold' },
                { col: '#A8D9FF', name: 'Moon Blue' },
                { col: '#D99BCB', name: 'Rose' },
                { col: '#B6A4FF', name: 'Lavender' }
              ].map(({ col, name }) => (
                <button
                  key={col}
                  type="button"
                  onClick={() => setStarColor(col)}
                  title={name}
                  aria-label={`Select ${name} starlight tone`}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: col,
                    border: starColor === col ? '2.5px solid #FFFFFF' : '1px solid rgba(255,255,255,0.3)',
                    boxShadow: starColor === col ? `0 0 12px ${col}` : 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {errorMsg && (
          <div style={{ color: '#FF7B7B', fontSize: '0.85rem', marginBottom: '1rem', padding: '0.5rem', backgroundColor: 'rgba(255, 100, 100, 0.1)', borderRadius: '8px' }}>
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div style={{ color: '#FFD985', fontSize: '0.88rem', marginBottom: '1rem', padding: '0.5rem', backgroundColor: 'rgba(255, 217, 133, 0.15)', borderRadius: '8px' }}>
            {successMsg}
          </div>
        )}

        <button
          type="submit"
          className="btn btn-gold"
          disabled={isSubmitting}
          style={{ width: '100%', padding: '0.8rem', fontSize: '1rem', justifyContent: 'center' }}
        >
          <Send size={16} />
          <span>{isSubmitting ? 'Inscribing in Starlight...' : 'Send Dream to Guestbook'}</span>
        </button>
      </form>

      {/* Category Filter Tabs */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '2rem' }}>
        {['All', 'Flight', 'Discovery', 'Healing', 'Adventure'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            style={{
              padding: '0.45rem 1rem',
              borderRadius: '999px',
              fontSize: '0.84rem',
              border: filterCategory === cat ? '1px solid var(--color-gold)' : '1px solid var(--color-card-border)',
              backgroundColor: filterCategory === cat ? 'rgba(255, 217, 133, 0.15)' : 'var(--color-card-bg)',
              color: filterCategory === cat ? 'var(--color-gold)' : 'var(--color-text-sub)',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Guestbook Dreams Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem'
        }}
      >
        {filteredDreams.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem 1rem', color: 'var(--color-text-sub)' }}>
            <p style={{ fontSize: '1.08rem', marginBottom: '0.5rem', fontFamily: 'var(--font-rounded)' }}>
              No dreams found in this category yet. 🕊️
            </p>
            <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)' }}>
              Be the first to share a quiet hope or select another filter above.
            </p>
          </div>
        )}

        {filteredDreams.map((item) => {
          const isStarredByMe = starredIds.includes(item.id);
          return (
            <div
              key={item.id}
              className="story-card"
              style={{
                padding: '1.6rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderTop: `3px solid ${item.color || 'var(--color-lavender)'}`,
                position: 'relative'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.94rem', color: item.color || 'var(--color-moon-blue)' }}>
                    {item.author}
                  </span>
                  <span className="badge badge-gold" style={{ fontSize: '0.72rem', padding: '0.2rem 0.6rem' }}>
                    {item.category}
                  </span>
                </div>

                <p
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.05rem',
                    lineHeight: 1.65,
                    color: 'var(--color-text-main)',
                    margin: '0 0 1.2rem'
                  }}
                >
                  "{item.text}"
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.8rem', borderTop: '1px solid var(--color-card-border)' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                  {item.date}
                </span>

                <button
                  onClick={() => handleSendStar(item.id)}
                  title={isStarredByMe ? "You already sent a star to this dream in this session" : "Send a star to this dream"}
                  aria-label={`Send star to dream by ${item.author}. Currently has ${item.stars} stars.`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    background: isStarredByMe ? 'rgba(255, 217, 133, 0.16)' : 'none',
                    border: isStarredByMe ? '1px solid var(--color-gold)' : '1px solid var(--color-card-border)',
                    borderRadius: '999px',
                    padding: '3px 10px',
                    color: 'var(--color-gold)',
                    cursor: isStarredByMe ? 'default' : 'pointer',
                    fontSize: '0.82rem',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Star size={13} fill="#FFD985" color="#FFD985" />
                  <span>{item.stars}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Honest Architecture & Backend Integration Notice */}
      <div
        style={{
          marginTop: '2.5rem',
          padding: '1rem 1.4rem',
          borderRadius: '14px',
          backgroundColor: 'rgba(30, 30, 59, 0.45)',
          border: '1px solid var(--color-card-border)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontSize: '0.82rem',
          color: 'var(--color-text-muted)'
        }}
      >
        <Info size={16} color="var(--color-lavender)" />
        <span>
          <strong>Backend Database:</strong>{' '}
          {dbStatus === 'connected' ? (
            <>
              Live connection active to Supabase (<code style={{ color: 'var(--color-gold)' }}>guestbook_entries</code> table). Submissions and star counts sync with PostgreSQL in real time.
            </>
          ) : dbStatus === 'offline' ? (
            <>
              Supabase cloud endpoint is currently offline. Offline fallback is active: all guestbook dreams are preserved in your browser's local memory.
            </>
          ) : (
            <>
              Local storage memory mode active. To connect your live Supabase cloud database, provide <code style={{ color: 'var(--color-gold)' }}>VITE_SUPABASE_URL</code> and <code style={{ color: 'var(--color-gold)' }}>VITE_SUPABASE_ANON_KEY</code> in your <code style={{ color: 'var(--color-gold)' }}>.env</code> file.
            </>
          )}
        </span>
      </div>
    </div>
  );
};
