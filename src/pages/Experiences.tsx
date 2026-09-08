import { useState } from 'react';
import type { Page, BookingState } from '../types';
import { experiences } from '../data';
import { ArrowRightIcon, CheckIcon, PlusIcon } from '../components/Icons';
import { useCurrency } from '../context/Currency';

interface ExperiencesProps {
  onNavigate: (p: Page) => void;
  booking: BookingState;
  setBooking: (b: BookingState) => void;
}

const CATS = [
  { key: 'all', label: 'All' },
  { key: 'dine', label: 'Dine' },
  { key: 'rest', label: 'Rest' },
  { key: 'move', label: 'Move' },
  { key: 'explore', label: 'Explore' },
  { key: 'celebrate', label: 'Celebrate' },
];

const STEPS = ['Your Room', 'Your Experience', 'Your Dining', 'Your Wellness'];

export default function Experiences({ onNavigate, booking, setBooking }: ExperiencesProps) {
  const [cat, setCat] = useState('all');
  const [buildStep, setBuildStep] = useState(1);
  const { fmt } = useCurrency();

  const filtered = cat === 'all' ? experiences : experiences.filter(e => e.category === cat);

  const toggle = (id: string) => setBooking({
    ...booking,
    experiences: booking.experiences.includes(id) ? booking.experiences.filter(x => x !== id) : [...booking.experiences, id],
  });

  const selected = experiences.filter(e => booking.experiences.includes(e.id));
  const total = selected.reduce((s, e) => s + e.price, 0);

  return (
    <div className="page-fade min-h-screen" style={{ background: '#F4F0E8' }}>

      {/* Hero */}
      <div className="relative flex items-end" style={{ height: '48vh', background: '#16150E' }}>
        <img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&h=900&fit=crop&auto=format"
          alt="VÉLORA Experiences" className="absolute inset-0 w-full h-full object-cover" style={{ opacity: 0.58 }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgb(22 21 14 / 0.78) 0%, transparent 60%)' }} />
        <div className="relative z-10 max-w-[1280px] w-full mx-auto px-6 lg:px-12 pb-12 lg:pb-16">
          <div style={{ fontSize: 9, letterSpacing: '0.38em', textTransform: 'uppercase', color: 'rgb(216 200 168 / 0.5)', marginBottom: 14 }}>Experiences</div>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(40px, 7vw, 76px)', color: '#F4F0E8', fontWeight: 400, lineHeight: 0.95 }}>
            Make the stay<br /><em>yours.</em>
          </h1>
        </div>
      </div>

      {/* Category filters */}
      <div
        className="sticky top-[68px] lg:top-[76px] z-20 py-3"
        style={{ background: 'rgb(244 240 232 / 0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgb(23 23 21 / 0.07)' }}
      >
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
          <div className="flex items-center gap-2 overflow-x-auto pb-0.5">
            {CATS.map(c => (
              <button key={c.key} onClick={() => setCat(c.key)} className="flex-shrink-0 focus:outline-none transition-all duration-200"
                style={{ padding: '7px 16px', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', border: `1px solid ${cat === c.key ? '#171715' : 'rgb(23 23 21 / 0.12)'}`, background: cat === c.key ? '#171715' : 'transparent', color: cat === c.key ? '#F4F0E8' : '#89917F' }}>
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12 py-14 lg:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filtered.map(exp => {
            const on = booking.experiences.includes(exp.id);
            return (
              <div key={exp.id}
                style={{ background: '#FFFFFF', border: `1px solid ${on ? '#A68A63' : 'rgb(23 23 21 / 0.05)'}`, transition: 'border-color 0.2s ease' }}>
                <div className="img-zoom relative" style={{ height: 200, background: '#DED7CA' }}>
                  <img src={exp.image} alt={exp.name} className="w-full h-full object-cover" loading="lazy" />
                  <div className="absolute top-3 left-3 px-2 py-1" style={{ background: '#171715', fontSize: 8.5, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#F4F0E8' }}>
                    {exp.category}
                  </div>
                  {on && (
                    <div className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center" style={{ background: '#A68A63' }}>
                      <CheckIcon size={11} style={{ color: '#F4F0E8' }} strokeWidth={2.5} />
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 16, color: '#171715', lineHeight: 1.3, marginBottom: 6 }}>{exp.name}</div>
                  <div className="flex gap-3 mb-5" style={{ fontSize: 9.5, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#89917F' }}>
                    <span>{exp.duration}</span><span>·</span><span>{exp.location}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div style={{ fontSize: 15, color: '#171715', fontFamily: 'Playfair Display, serif' }}>{fmt(exp.price)}</div>
                    <button onClick={() => toggle(exp.id)}
                      className="flex items-center gap-1.5 focus:outline-none transition-all duration-200"
                      style={{ border: `1px solid ${on ? '#A68A63' : 'rgb(23 23 21 / 0.18)'}`, background: on ? 'rgb(166 138 99 / 0.08)' : 'transparent', color: on ? '#A68A63' : '#171715', padding: '6px 13px', fontSize: 9.5, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                      {on ? <CheckIcon size={10} /> : <PlusIcon size={10} />}
                      {on ? 'Added' : 'Add'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Build Your Stay */}
      <div style={{ background: '#171715', padding: '8rem 0' }}>
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-24">

            {/* Steps */}
            <div>
              <div style={{ fontSize: 9, letterSpacing: '0.38em', textTransform: 'uppercase', color: 'rgb(216 200 168 / 0.4)', marginBottom: 16 }}>Build Your Journey</div>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(28px, 4vw, 46px)', color: '#F4F0E8', fontWeight: 400, lineHeight: 1.08, marginBottom: 40 }}>
                Every detail,<br /><em>your choice.</em>
              </h2>
              <div>
                {STEPS.map((step, i) => (
                  <button key={step} onClick={() => setBuildStep(i + 1)}
                    className="w-full text-left focus:outline-none py-5 flex items-center justify-between"
                    style={{ borderTop: i === 0 ? '1px solid rgb(244 240 232 / 0.08)' : 'none', borderBottom: '1px solid rgb(244 240 232 / 0.08)' }}>
                    <div className="flex items-center gap-5">
                      <span style={{ fontFamily: 'monospace', fontSize: 11, color: buildStep === i + 1 ? '#A68A63' : 'rgb(244 240 232 / 0.2)' }}>0{i + 1}</span>
                      <span style={{ fontSize: 13, color: buildStep === i + 1 ? '#F4F0E8' : 'rgb(244 240 232 / 0.35)', letterSpacing: '0.05em' }}>{step}</span>
                    </div>
                    {buildStep === i + 1 && <div style={{ width: 20, height: 1, background: '#A68A63' }} />}
                  </button>
                ))}
              </div>
            </div>

            {/* Itinerary */}
            <div>
              <div style={{ fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgb(216 200 168 / 0.3)', marginBottom: 20 }}>Your selection</div>
              {selected.length === 0 ? (
                <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 15, color: 'rgb(244 240 232 / 0.25)', fontStyle: 'italic', lineHeight: 1.7 }}>
                  No experiences added yet.<br />Choose from above to build your journey.
                </p>
              ) : (
                <>
                  {selected.map(exp => (
                    <div key={exp.id} className="flex items-center justify-between py-4" style={{ borderBottom: '1px solid rgb(244 240 232 / 0.06)' }}>
                      <div>
                        <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 15, color: '#F4F0E8' }}>{exp.name}</div>
                        <div style={{ fontSize: 9.5, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgb(244 240 232 / 0.3)', marginTop: 3 }}>{exp.duration}</div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 15, color: '#D8C8A8' }}>{fmt(exp.price)}</span>
                        <button onClick={() => toggle(exp.id)} className="focus:outline-none opacity-30 hover:opacity-80 transition-opacity" aria-label={`Remove ${exp.name}`}>
                          <CheckIcon size={13} style={{ color: '#A68A63' }} />
                        </button>
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-between pt-4 mt-2" style={{ borderTop: '1px solid rgb(244 240 232 / 0.08)' }}>
                    <span style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgb(244 240 232 / 0.35)' }}>Experiences total</span>
                    <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 18, color: '#F4F0E8' }}>{fmt(total)}</span>
                  </div>
                </>
              )}
              <button onClick={() => onNavigate('offers')} className="mt-8 w-full flex items-center justify-center gap-3 focus:outline-none transition-all duration-300"
                style={{ background: '#A68A63', color: '#F4F0E8', padding: '15px 0', fontSize: 10, letterSpacing: '0.26em', textTransform: 'uppercase' }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#D8C8A8'; (e.currentTarget as HTMLButtonElement).style.color = '#171715'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#A68A63'; (e.currentTarget as HTMLButtonElement).style.color = '#F4F0E8'; }}>
                Build My Journey <ArrowRightIcon size={13} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
