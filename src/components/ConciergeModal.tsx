import { useState } from 'react';
import { CloseIcon, ArrowRightIcon } from './Icons';

interface ConciergeModalProps {
  open: boolean;
  onClose: () => void;
  onNavigate: (page: 'stays' | 'offers') => void;
}

const escapes = ['Relaxation', 'Adventure', 'Romance', 'Wellness', 'Culture', 'Family'];
const priorities = ['Privacy', 'Ocean view', 'Dining', 'Wellness', 'Activities'];

const recommendations: Record<string, { room: string; score: number; reason: string; image: string }> = {
  Relaxation: { room: 'Grand Terrace Suite', score: 96, reason: 'Perfect for privacy, ocean views and slow mornings without agenda.', image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&h=400&fit=crop&auto=format' },
  Adventure: { room: 'Sea Pavilion Room', score: 88, reason: 'Ideally positioned for morning sailing and coastal exploration.', image: 'https://images.unsplash.com/photo-1559521778-84816b3d2f3d?w=600&h=400&fit=crop&auto=format' },
  Romance: { room: 'Cliff Villa', score: 94, reason: 'Absolute seclusion, private pool, and a terrace made for candlelit evenings.', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop&auto=format' },
  Wellness: { room: 'Grand Terrace Suite', score: 97, reason: 'Steps from the spa, with a private terrace for morning yoga and sea air.', image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&h=400&fit=crop&auto=format' },
  Culture: { room: 'Sea Pavilion Room', score: 85, reason: 'Our most connected stay, within reach of local artisans and the morning market.', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&h=400&fit=crop&auto=format' },
  Family: { room: 'Cliff Villa', score: 92, reason: 'Two bedrooms, a private pool, and the kind of space families actually need.', image: 'https://images.unsplash.com/photo-1561501878-aabd62634533?w=600&h=400&fit=crop&auto=format' },
};

export default function ConciergeModal({ open, onClose, onNavigate }: ConciergeModalProps) {
  const [step, setStep] = useState(0);
  const [escape, setEscape] = useState('');
  const [selected, setSelected] = useState<string[]>([]);

  const rec = recommendations[escape] || recommendations['Relaxation'];

  const reset = () => { setStep(0); setEscape(''); setSelected([]); };

  const handleClose = () => { reset(); onClose(); };

  const togglePriority = (p: string) => {
    setSelected(prev => prev.includes(p) ? prev.filter(x => x !== p) : prev.length < 3 ? [...prev, p] : prev);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      style={{ backgroundColor: 'rgb(23 23 21 / 0.7)', backdropFilter: 'blur(4px)' }}
      onClick={e => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div
        className="relative w-full sm:max-w-lg mx-auto sm:mx-6 overflow-hidden"
        style={{
          backgroundColor: '#F4F0E8',
          maxHeight: '90dvh',
          overflowY: 'auto',
          animation: 'slideUp 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6" style={{ borderBottom: '1px solid rgb(23 23 21 / 0.08)' }}>
          <div>
            <div className="text-[9px] tracking-[0.3em] uppercase mb-1" style={{ color: '#89917F' }}>AI Concierge</div>
            <div className="text-base" style={{ fontFamily: 'Playfair Display, serif' }}>
              {step === 0 && 'Tell us how you like to travel.'}
              {step === 1 && 'What matters most?'}
              {step === 2 && 'Your VÉLORA Match'}
            </div>
          </div>
          <button onClick={handleClose} className="p-2 focus:outline-none transition-opacity hover:opacity-50" aria-label="Close">
            <CloseIcon size={18} />
          </button>
        </div>

        <div className="px-8 py-7">
          {/* Step 0: Escape type */}
          {step === 0 && (
            <div>
              <p className="text-sm mb-6" style={{ color: '#596054', lineHeight: 1.7 }}>
                What kind of escape are you looking for?
              </p>
              <div className="grid grid-cols-2 gap-2.5">
                {escapes.map(e => (
                  <button
                    key={e}
                    onClick={() => setEscape(e)}
                    className="py-3 px-4 text-left text-sm transition-all duration-200 focus:outline-none"
                    style={{
                      border: `1px solid ${escape === e ? '#171715' : 'rgb(23 23 21 / 0.15)'}`,
                      backgroundColor: escape === e ? '#171715' : 'transparent',
                      color: escape === e ? '#F4F0E8' : '#171715',
                    }}
                  >
                    {e}
                  </button>
                ))}
              </div>
              <button
                onClick={() => escape && setStep(1)}
                disabled={!escape}
                className="mt-6 w-full py-3.5 text-xs tracking-[0.22em] uppercase transition-all duration-300 focus:outline-none disabled:opacity-30"
                style={{ backgroundColor: '#171715', color: '#F4F0E8' }}
              >
                Continue
              </button>
            </div>
          )}

          {/* Step 1: Priorities */}
          {step === 1 && (
            <div>
              <p className="text-sm mb-2" style={{ color: '#596054', lineHeight: 1.7 }}>
                What matters most to you? Select up to three.
              </p>
              <p className="text-xs mb-6" style={{ color: '#89917F' }}>{selected.length}/3 selected</p>
              <div className="flex flex-wrap gap-2.5">
                {priorities.map(p => (
                  <button
                    key={p}
                    onClick={() => togglePriority(p)}
                    className="py-2 px-4 text-sm transition-all duration-200 focus:outline-none"
                    style={{
                      border: `1px solid ${selected.includes(p) ? '#A68A63' : 'rgb(23 23 21 / 0.15)'}`,
                      backgroundColor: selected.includes(p) ? 'rgb(166 138 99 / 0.1)' : 'transparent',
                      color: selected.includes(p) ? '#A68A63' : '#171715',
                    }}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep(0)} className="flex-1 py-3.5 text-xs tracking-[0.22em] uppercase focus:outline-none"
                  style={{ border: '1px solid rgb(23 23 21 / 0.2)', color: '#171715' }}>
                  Back
                </button>
                <button
                  onClick={() => selected.length > 0 && setStep(2)}
                  disabled={selected.length === 0}
                  className="flex-1 py-3.5 text-xs tracking-[0.22em] uppercase transition-all duration-300 focus:outline-none disabled:opacity-30"
                  style={{ backgroundColor: '#171715', color: '#F4F0E8' }}
                >
                  Find My Match
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Result */}
          {step === 2 && (
            <div>
              <div className="img-zoom mb-5" style={{ height: 220, backgroundColor: '#DED7CA' }}>
                <img src={rec.image} alt={rec.room} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-[9px] tracking-[0.28em] uppercase mb-1" style={{ color: '#89917F' }}>Recommended for you</div>
                  <div className="text-lg" style={{ fontFamily: 'Playfair Display, serif' }}>{rec.room}</div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="text-2xl" style={{ fontFamily: 'Playfair Display, serif', color: '#A68A63', fontWeight: 600 }}>
                    {rec.score}%
                  </div>
                  <div className="text-[9px] tracking-[0.2em] uppercase" style={{ color: '#89917F' }}>Match</div>
                </div>
              </div>

              {/* Score bar */}
              <div className="h-0.5 bg-stone mb-2 overflow-hidden">
                <div
                  className="h-full bg-bronze transition-all duration-1000"
                  style={{ width: `${rec.score}%` }}
                />
              </div>

              <p className="text-sm mb-6" style={{ color: '#596054', lineHeight: 1.7, fontStyle: 'italic' }}>
                "{rec.reason}"
              </p>

              <div className="mb-5 text-xs" style={{ color: '#89917F' }}>
                Based on: {escape} · {selected.join(', ')}
              </div>

              <div className="flex gap-3">
                <button onClick={reset} className="flex-1 py-3.5 text-xs tracking-[0.22em] uppercase focus:outline-none"
                  style={{ border: '1px solid rgb(23 23 21 / 0.2)', color: '#171715' }}>
                  Start Over
                </button>
                <button
                  onClick={() => { handleClose(); onNavigate('stays'); }}
                  className="flex-1 py-3.5 text-xs tracking-[0.22em] uppercase flex items-center justify-center gap-2 transition-all duration-300 focus:outline-none"
                  style={{ backgroundColor: '#171715', color: '#F4F0E8' }}
                >
                  View Room <ArrowRightIcon size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
