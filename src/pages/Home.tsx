import { useState, useRef, useEffect } from 'react';
import type { Page, BookingState } from '../types';
import { destinations, properties, offers } from '../data';
import { useCurrency } from '../context/Currency';
import { ArrowRightIcon, LocationIcon, CalendarIcon, GuestsIcon, OceanIcon, DiningIcon, SpaIcon, MountainIcon } from '../components/Icons';

// Fallback image shown when video cannot load or reduced-motion is preferred
const HERO_FALLBACK = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&h=1280&fit=crop&auto=format&q=85';

import heroVideo from '@/imports/IMG_0664__1_.MP4';

/* Sound icon — thin-line style matching VÉLORA aesthetic */
function SoundIcon({ on }: { on: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 6H1v4h2l4 3V3L3 6z" fill="currentColor" />
      {on ? (
        <>
          <path d="M10 4.5a5 5 0 0 1 0 7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" />
          <path d="M12.5 2a8 8 0 0 1 0 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" />
        </>
      ) : (
        <path d="M13 5l-4 6M9 5l4 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      )}
    </svg>
  );
}

interface HomeProps {
  onNavigate: (page: Page) => void;
  booking: BookingState;
  setBooking: (b: BookingState) => void;
  onConcierge: () => void;
}

function Label({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <div style={{ fontSize: 9, letterSpacing: '0.38em', textTransform: 'uppercase', color: light ? 'rgb(216 200 168 / 0.55)' : '#89917F', marginBottom: 14, fontWeight: 400 }}>
      {children}
    </div>
  );
}

export default function Home({ onNavigate, booking, setBooking, onConcierge }: HomeProps) {
  const [hovDest,      setHovDest]      = useState<number | null>(null);
  const [activeSlide,  setActiveSlide]  = useState(0);
  const [muted,        setMuted]        = useState(true);
  const [videoFailed,  setVideoFailed]  = useState(false);
  const [videoReady,   setVideoReady]   = useState(false);
  const scrollRef  = useRef<HTMLDivElement>(null);
  const videoRef   = useRef<HTMLVideoElement>(null);
  const { fmt } = useCurrency();

  // Detect reduced-motion preference once on mount
  const prefersReduced = useRef(
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  // Nudge autoplay along once the element mounts (some browsers need an explicit play())
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const tryPlay = () => { v.play().catch(() => {}); };
    tryPlay();
    v.addEventListener('loadeddata', tryPlay);
    return () => v.removeEventListener('loadeddata', tryPlay);
  }, []);

  // Slow Ken-Burns zoom: after video is ready, animate scale from 1.06 → 1
  useEffect(() => {
    if (!videoReady || prefersReduced.current) return;
    const v = videoRef.current;
    if (!v) return;
    // Reset then trigger CSS transition via class
    v.style.transform = 'scale(1.06)';
    const id = requestAnimationFrame(() => {
      v.style.transition = 'transform 22s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      v.style.transform  = 'scale(1)';
    });
    return () => cancelAnimationFrame(id);
  }, [videoReady]);

  const toggleSound = () => {
    const v = videoRef.current;
    if (!v) return;
    const next = !muted;
    v.muted = next;
    setMuted(next);
  };

  // Show video unless it failed to load — reduced-motion only disables Ken-Burns, not the video itself
  const showVideo = !videoFailed;

  /* Track active slide for dot indicators */
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const w = el.offsetWidth;
      if (w > 0) setActiveSlide(Math.round(el.scrollLeft / w));
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  const handleQuickBook = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate('offers');
  };

  return (
    <div className="page-fade">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative flex flex-col justify-end min-h-[100svh] overflow-hidden" aria-label="Hero">

        {/* ── Background: cinematic video or fallback image ── */}
        <div className="absolute inset-0" style={{ background: '#16150E' }}>

          {/* Static fallback — always present as poster / base layer */}
          <img
            src={HERO_FALLBACK}
            alt="VÉLORA — infinity pool at dusk"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ opacity: showVideo ? (videoReady ? 0 : 0.72) : 0.72, transition: 'opacity 1.4s ease' }}
            aria-hidden={showVideo && videoReady}
          />

          {/* Cinematic video layer */}
          {showVideo && (
            <video
              ref={videoRef}
              autoPlay
              muted
              loop
              playsInline
              poster={HERO_FALLBACK}
              onLoadedData={() => setVideoReady(true)}
              onCanPlay={() => setVideoReady(true)}
              onError={() => setVideoFailed(true)}
              className="absolute inset-0 w-full h-full object-cover"
              style={{
                opacity: videoReady ? 0.72 : 0,
                transition: 'opacity 1.6s ease',
                willChange: 'transform, opacity',
              }}
              aria-hidden="true"
            >
              <source src={heroVideo} type="video/mp4" />
            </video>
          )}

          {/* Cinematic gradient — bottom-heavy for text legibility */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(to top, rgb(22 21 14 / 0.92) 0%, rgb(22 21 14 / 0.42) 40%, rgb(22 21 14 / 0.12) 75%, transparent 100%)' }}
          />
          {/* Subtle top vignette */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(to bottom, rgb(22 21 14 / 0.28) 0%, transparent 28%)' }}
          />
        </div>

        {/* ── Hero content ── */}
        <div className="relative z-10 max-w-[1280px] w-full mx-auto px-4 sm:px-6 lg:px-12 pb-28 sm:pb-20 lg:pb-32">

          {/* Brand label — new, above headline */}
          <div
            className="stagger-1"
            style={{ fontSize: 9, letterSpacing: '0.48em', textTransform: 'uppercase', color: 'rgb(216 200 168 / 0.55)', marginBottom: 20, fontWeight: 300 }}
          >
            VÉLORA Hotels &amp; Resorts
          </div>

          <h1
            className="stagger-2"
            style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 'clamp(44px, 9vw, 104px)',
              color: '#F4F0E8',
              fontWeight: 400,
              lineHeight: 0.92,
              letterSpacing: '-0.01em',
              maxWidth: 800,
            }}
          >
            Stay beyond<br />
            <em style={{ fontStyle: 'italic' }}>the expected.</em>
          </h1>

          <p
            className="stagger-3"
            style={{ color: 'rgb(244 240 232 / 0.55)', fontSize: 'clamp(14px, 2vw, 16px)', lineHeight: 1.75, maxWidth: 360, marginTop: 24, fontWeight: 300 }}
          >
            A collection of extraordinary stays shaped by place, people and the quiet art of living well.
          </p>

          {/* CTAs — unchanged */}
          <div className="stagger-4 flex flex-col sm:flex-row gap-3 mt-8 sm:mt-10">
            <button
              onClick={() => onNavigate('offers')}
              className="group flex items-center justify-center gap-3 focus:outline-none transition-all duration-300"
              style={{ background: '#F4F0E8', color: '#171715', padding: '16px 28px', fontSize: 10, letterSpacing: '0.24em', textTransform: 'uppercase', minHeight: 52 }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#DED7CA'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#F4F0E8'; }}
            >
              Check Availability
              <ArrowRightIcon size={13} className="transition-transform group-hover:translate-x-1" />
            </button>
            <button
              onClick={() => onNavigate('destinations')}
              className="focus:outline-none transition-all duration-300 flex items-center justify-center"
              style={{ border: '1px solid rgb(244 240 232 / 0.35)', color: '#F4F0E8', padding: '16px 28px', fontSize: 10, letterSpacing: '0.24em', textTransform: 'uppercase', minHeight: 52 }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgb(244 240 232 / 0.7)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgb(244 240 232 / 0.35)'; }}
            >
              Explore Destinations
            </button>
          </div>
        </div>

        {/* ── Scroll indicator ── */}
        <div className="absolute bottom-12 right-6 lg:right-12 hidden sm:flex flex-col items-center gap-3" style={{ zIndex: 10 }}>
          <span style={{ fontSize: 8, letterSpacing: '0.32em', textTransform: 'uppercase', color: 'rgb(244 240 232 / 0.3)', writingMode: 'vertical-rl' }}>Scroll</span>
          <div className="scroll-indicator w-px h-10" style={{ background: 'linear-gradient(to bottom, rgb(244 240 232 / 0.25), transparent)' }} />
        </div>

        {/* ── Sound toggle — bottom-left, elegant glass pill ── */}
        {showVideo && (
          <button
            onClick={toggleSound}
            className="absolute focus:outline-none flex items-center gap-2.5 group"
            style={{
              bottom: 'max(32px, env(safe-area-inset-bottom, 32px))',
              left: 'clamp(16px, 4vw, 48px)',
              zIndex: 10,
              background: 'rgb(22 21 14 / 0.38)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgb(244 240 232 / 0.18)',
              color: 'rgb(244 240 232 / 0.75)',
              padding: '8px 14px 8px 11px',
              transition: 'border-color 0.3s ease, color 0.3s ease, background 0.3s ease',
            }}
            onMouseEnter={e => {
              const b = e.currentTarget;
              b.style.borderColor = 'rgb(244 240 232 / 0.42)';
              b.style.color = '#F4F0E8';
              b.style.background = 'rgb(22 21 14 / 0.55)';
            }}
            onMouseLeave={e => {
              const b = e.currentTarget;
              b.style.borderColor = 'rgb(244 240 232 / 0.18)';
              b.style.color = 'rgb(244 240 232 / 0.75)';
              b.style.background = 'rgb(22 21 14 / 0.38)';
            }}
            aria-label={muted ? 'Enable sound' : 'Mute video'}
          >
            <SoundIcon on={!muted} />
            <span style={{ fontSize: 8.5, letterSpacing: '0.28em', textTransform: 'uppercase' }}>
              {muted ? 'Sound On' : 'Sound Off'}
            </span>
          </button>
        )}
      </section>

      {/* ── DESTINATIONS ─────────────────────────────────────── */}
      <section className="py-16 sm:py-24 lg:py-40" style={{ background: '#F4F0E8' }} aria-label="Destinations">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-10 sm:mb-14 gap-4">
            <div>
              <div className="reveal reveal-d1"><Label>Destinations</Label></div>
              <h2 className="reveal reveal-d2" style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(30px, 4vw, 54px)', color: '#171715', fontWeight: 400, lineHeight: 1.05 }}>
                Where will you<br /><em>go next?</em>
              </h2>
            </div>
            <button
              onClick={() => onNavigate('destinations')}
              className="reveal reveal-d3 self-start hover-line focus:outline-none flex items-center gap-2"
              style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#89917F' }}
            >
              All destinations <ArrowRightIcon size={13} />
            </button>
          </div>

          {/* Mobile: 2-col tight grid. Desktop: 12-col editorial */}
          <div className="hidden sm:grid grid-cols-12 gap-4">
            {destinations.slice(0, 6).map((dest, i) => {
              const spans = ['col-span-12 sm:col-span-7','col-span-12 sm:col-span-5','col-span-12 sm:col-span-4','col-span-12 sm:col-span-8','col-span-12 sm:col-span-5','col-span-12 sm:col-span-7'];
              const heights = [420, 420, 340, 340, 380, 380];
              const maskDelays = ['0.05s','0.2s','0.35s','0.5s','0.65s','0.8s'];
              return (
                <button
                  key={dest.id}
                  onClick={() => onNavigate('destinations')}
                  className={`${spans[i]} img-reveal relative text-left overflow-hidden group focus:outline-none`}
                  style={{ height: heights[i], background: '#DED7CA', '--reveal-delay': maskDelays[i] } as React.CSSProperties}
                  onMouseEnter={() => setHovDest(i)}
                  onMouseLeave={() => setHovDest(null)}
                >
                  <img src={dest.image} alt={`${dest.name}, ${dest.country}`} className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1100ms] ease-out" style={{ transform: hovDest === i ? 'scale(1.04)' : 'scale(1)' }} loading="lazy" />
                  <div className="absolute inset-0 transition-opacity duration-600" style={{ background: 'linear-gradient(to top, rgb(22 21 14 / 0.76) 0%, transparent 55%)', opacity: hovDest === i ? 1 : 0.65 }} />
                  <div className="absolute bottom-0 left-0 right-0 p-7 transition-transform duration-500" style={{ transform: hovDest === i ? 'translateY(0)' : 'translateY(4px)' }}>
                    <div style={{ fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgb(216 200 168 / 0.6)', marginBottom: 6 }}>{dest.stayCount} stays · {dest.country}</div>
                    <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(20px, 2.2vw, 26px)', color: '#F4F0E8', fontWeight: 400 }}>{dest.name}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Mobile: 2-col compact grid */}
          <div className="sm:hidden grid grid-cols-2 gap-3">
            {destinations.slice(0, 6).map((dest, i) => (
              <button
                key={dest.id}
                onClick={() => onNavigate('destinations')}
                className="relative text-left overflow-hidden focus:outline-none"
                style={{ height: i === 0 ? 200 : 150, background: '#DED7CA' }}
              >
                <img src={dest.image} alt={`${dest.name}, ${dest.country}`} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgb(22 21 14 / 0.72) 0%, transparent 55%)' }} />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 13, color: '#F4F0E8', fontWeight: 400, lineHeight: 1.2 }}>{dest.name}</div>
                  <div style={{ fontSize: 9, color: 'rgb(216 200 168 / 0.7)', letterSpacing: '0.1em' }}>{dest.country}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED STAYS — snap carousel ───────────────────── */}
      <section style={{ background: '#F4F0E8', paddingBottom: '6rem' }} aria-label="Featured stays">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-12 mb-8 sm:mb-12">
          <div className="flex items-end justify-between">
            <div>
              <Label>Properties</Label>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(28px, 4vw, 54px)', color: '#171715', fontWeight: 400, lineHeight: 1.05 }}>
                Worth the journey.
              </h2>
            </div>
            <div className="flex flex-col items-end gap-2 self-end">
              <button onClick={() => onNavigate('stays')} className="hidden sm:flex hover-line focus:outline-none items-center gap-2"
                style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#89917F' }}>
                All stays <ArrowRightIcon size={13} />
              </button>
              <div className="hidden sm:flex items-center gap-2" style={{ fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgb(23 23 21 / 0.28)' }}>
                <span>Scroll to explore</span><span style={{ letterSpacing: 0 }}>→</span>
              </div>
            </div>
          </div>
        </div>

        {/* Snap scroll carousel */}
        <div
          ref={scrollRef}
          className="flex snap-x-mandatory overflow-x-auto pb-3"
          style={{
            gap: 16,
            paddingLeft: 'max(16px, calc((100vw - 1280px) / 2 + 24px))',
            paddingRight: 16,
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {properties.map((prop, i) => (
            <button
              key={prop.id}
              onClick={() => onNavigate('stays')}
              className="snap-start card-lift flex-shrink-0 text-left group focus:outline-none"
              style={{ width: 'min(85vw, 360px)' }}
            >
              <div
                className="img-reveal overflow-hidden"
                style={{ height: 240, background: '#DED7CA', transitionDelay: `${i * 0.12}s` }}
              >
                <img src={prop.image} alt={prop.name} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="pt-4 pb-5" style={{ borderBottom: '1px solid rgb(23 23 21 / 0.08)' }}>
                <div style={{ fontSize: 9, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#89917F', marginBottom: 5 }}>
                  {prop.destination} · {prop.rating.toFixed(1)}/10
                </div>
                <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 19, color: '#171715', fontWeight: 400, marginBottom: 5 }}>
                  {prop.name}
                </div>
                <div style={{ fontSize: 13, color: '#596054', fontStyle: 'italic', marginBottom: 12 }}>
                  {prop.signature}
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span style={{ fontSize: 12, color: '#89917F' }}>From </span>
                    <span style={{ fontSize: 15, color: '#171715', fontFamily: 'Playfair Display, serif' }}>{fmt(prop.priceFrom)}</span>
                    <span style={{ fontSize: 11, color: '#89917F' }}> / night</span>
                  </div>
                  <span className="flex items-center gap-1.5 transition-all duration-300 group-hover:gap-2.5"
                    style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#A68A63' }}>
                    View <ArrowRightIcon size={11} />
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Dot indicators — mobile only */}
        <div className="flex flex-wrap justify-center items-center gap-x-1.5 gap-y-2 mt-5 px-6 sm:hidden">
          {properties.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                const el = scrollRef.current;
                if (!el) return;
                el.scrollTo({ left: i * el.offsetWidth, behavior: 'smooth' });
              }}
              className="focus:outline-none flex items-center justify-center flex-shrink-0"
              style={{ height: 24, padding: '0 3px' }}
              aria-label={`Go to slide ${i + 1}`}
            >
              <div style={{ width: activeSlide === i ? 20 : 6, height: 4, background: activeSlide === i ? '#171715' : 'rgb(23 23 21 / 0.2)', transition: 'width 0.35s ease, background 0.35s ease', borderRadius: 2 }} />
            </button>
          ))}
        </div>

        {/* Mobile "All stays" link */}
        <div className="sm:hidden text-center mt-5 px-4">
          <button onClick={() => onNavigate('stays')} className="hover-line focus:outline-none flex items-center gap-2 mx-auto"
            style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#89917F' }}>
            View all stays <ArrowRightIcon size={13} />
          </button>
        </div>
      </section>

      {/* ── THE VÉLORA WAY ───────────────────────────────────── */}
      <section style={{ background: '#DED7CA', padding: 'clamp(5rem, 8vw, 9rem) 0' }} aria-label="VÉLORA difference">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-6">
            <div className="lg:col-span-5">
              <div className="reveal reveal-d1"><Label>The VÉLORA Way</Label></div>
              <h2 className="reveal reveal-d2" style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(26px, 4vw, 48px)', color: '#171715', fontWeight: 400, lineHeight: 1.1, maxWidth: 360 }}>
                Some places ask you to slow down.<br />
                <em>We make it effortless.</em>
              </h2>
            </div>
            <div className="lg:col-span-7 grid grid-cols-2 gap-x-8 gap-y-8 sm:gap-x-10 sm:gap-y-10">
              {[
                { icon: <OceanIcon size={20} />, label: 'Rest', desc: 'Rooms designed for genuine recovery. No noise. No interruption.' },
                { icon: <DiningIcon size={20} />, label: 'Dine', desc: 'Tables that matter. Menus written from the season and the place.' },
                { icon: <SpaIcon size={20} />, label: 'Move', desc: 'Dawn yoga, coastal runs, spa rituals. Movement as intention.' },
                { icon: <MountainIcon size={20} />, label: 'Discover', desc: 'Guided walks, sailing days, cultural encounters. The real destination.' },
              ].map(({ icon, label, desc }, i) => (
                <div key={label} className="reveal" style={{ transitionDelay: `${i * 0.14}s` }}>
                  <div style={{ color: '#596054', marginBottom: 14 }}>{icon}</div>
                  <div className="rule mb-3" />
                  <div style={{ fontSize: 9, letterSpacing: '0.32em', textTransform: 'uppercase', color: '#89917F', marginBottom: 8 }}>{label}</div>
                  <p style={{ fontSize: 12, color: '#596054', lineHeight: 1.8 }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SIGNATURE ────────────────────────────────────────── */}
      <section className="grid grid-cols-1 lg:grid-cols-2" style={{ minHeight: 'clamp(400px, 70vh, 700px)' }} aria-label="Signature experience">
        <div className="img-zoom" style={{ height: 'clamp(260px, 45vw, 600px)', background: '#16150E' }}>
          <img
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&h=1000&fit=crop&auto=format"
            alt="Ocean at dawn — VÉLORA Maldives"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="flex flex-col justify-center px-6 sm:px-10 lg:px-16 xl:px-20 py-12 sm:py-16 lg:py-24" style={{ background: '#171715' }}>
          <Label light>Signature</Label>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(26px, 4vw, 52px)', color: '#F4F0E8', fontWeight: 400, lineHeight: 1.08, maxWidth: 360 }}>
            Wake where the sea<br /><em>meets the sky.</em>
          </h2>
          <p style={{ color: 'rgb(244 240 232 / 0.48)', fontSize: 14, lineHeight: 1.85, maxWidth: 320, marginTop: 20, marginBottom: 32, fontWeight: 300 }}>
            Our overwater pavilions are designed for mornings without clocks. The lagoon shifts through seven shades of blue before breakfast.
          </p>
          <button
            onClick={() => onNavigate('experiences')}
            className="group self-start flex items-center gap-3 focus:outline-none transition-all duration-300"
            style={{ border: '1px solid rgb(244 240 232 / 0.22)', color: 'rgb(244 240 232 / 0.7)', padding: '13px 24px', fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', minHeight: 48 }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgb(244 240 232 / 0.55)'; (e.currentTarget as HTMLButtonElement).style.color = '#F4F0E8'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgb(244 240 232 / 0.22)'; (e.currentTarget as HTMLButtonElement).style.color = 'rgb(244 240 232 / 0.7)'; }}
          >
            Explore Experiences
            <ArrowRightIcon size={13} className="transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </section>

      {/* ── OFFERS ───────────────────────────────────────────── */}
      <section style={{ background: '#F4F0E8', padding: 'clamp(5rem, 8vw, 9rem) 0' }} aria-label="Curated offers">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-10 sm:mb-14">
            <div>
              <Label>Curated For You</Label>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(26px, 4vw, 54px)', color: '#171715', fontWeight: 400, lineHeight: 1.05 }}>
                An occasion deserves<br /><em>more than a room.</em>
              </h2>
            </div>
            <button onClick={() => onNavigate('offers')} className="self-start hover-line focus:outline-none flex items-center gap-2 mt-4 sm:mt-0 mb-1"
              style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#89917F' }}>
              All offers <ArrowRightIcon size={13} />
            </button>
          </div>

          {/* Mobile: single-col stack. Desktop: 3-col */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {offers.slice(0, 3).map(offer => (
              <button key={offer.id} onClick={() => onNavigate('offers')} className="group text-left focus:outline-none">
                <div className="img-zoom overflow-hidden" style={{ height: 'clamp(200px, 40vw, 300px)', background: '#DED7CA' }}>
                  <img src={offer.image} alt={offer.title} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div className="pt-4">
                  <div style={{ fontSize: 9, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#89917F', marginBottom: 5 }}>{offer.nights}+ nights · Save {offer.savings}</div>
                  <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 19, color: '#171715', fontWeight: 400, marginBottom: 3 }}>{offer.title}</div>
                  <div style={{ fontSize: 13, color: '#596054', fontStyle: 'italic', marginBottom: 10 }}>{offer.subtitle}</div>
                  <div className="flex items-center gap-1.5" style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#A68A63' }}>
                    View offer <ArrowRightIcon size={11} className="transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOOKING CTA ──────────────────────────────────────── */}
      <section style={{ background: '#171715', padding: 'clamp(5rem, 8vw, 9rem) 0 clamp(7rem, 10vw, 12rem)' }} aria-label="Check availability">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="max-w-xl mb-10 sm:mb-14">
            <Label light>Reserve</Label>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(32px, 5vw, 68px)', color: '#F4F0E8', fontWeight: 400, lineHeight: 1.0 }}>
              Your stay<br /><em>begins here.</em>
            </h2>
          </div>

          <form onSubmit={handleQuickBook}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" style={{ border: '1px solid rgb(244 240 232 / 0.1)' }}>
              {[
                { icon: <LocationIcon size={12} />, label: 'Destination', content: (
                  <select value={booking.destination} onChange={e => setBooking({ ...booking, destination: e.target.value })}
                    className="w-full bg-transparent focus:outline-none" style={{ fontSize: 14, color: '#F4F0E8', fontFamily: 'Playfair Display, serif' }} aria-label="Destination">
                    <option value="" style={{ color: '#171715' }}>Any destination</option>
                    {destinations.map(d => <option key={d.id} value={d.id} style={{ color: '#171715' }}>{d.name}</option>)}
                  </select>
                )},
                { icon: <CalendarIcon size={12} />, label: 'Check-in', content: (
                  <input type="date" value={booking.checkIn} onChange={e => setBooking({ ...booking, checkIn: e.target.value })}
                    min={new Date().toISOString().split('T')[0]} className="w-full bg-transparent focus:outline-none"
                    style={{ fontSize: 14, color: '#F4F0E8', colorScheme: 'dark' }} aria-label="Check-in date" />
                )},
                { icon: <CalendarIcon size={12} />, label: 'Check-out', content: (
                  <input type="date" value={booking.checkOut} onChange={e => setBooking({ ...booking, checkOut: e.target.value })}
                    min={booking.checkIn || new Date().toISOString().split('T')[0]} className="w-full bg-transparent focus:outline-none"
                    style={{ fontSize: 14, color: '#F4F0E8', colorScheme: 'dark' }} aria-label="Check-out date" />
                )},
                { icon: <GuestsIcon size={12} />, label: 'Guests', content: (
                  <select value={booking.adults} onChange={e => setBooking({ ...booking, adults: Number(e.target.value) })}
                    className="w-full bg-transparent focus:outline-none" style={{ fontSize: 14, color: '#F4F0E8' }} aria-label="Guests">
                    {[1,2,3,4,5,6].map(n => <option key={n} value={n} style={{ color: '#171715' }}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>)}
                  </select>
                )},
              ].map((field, i, arr) => (
                <div key={field.label} className="p-5 sm:p-6"
                  style={{ borderRight: i < arr.length - 1 ? '1px solid rgb(244 240 232 / 0.08)' : 'none', borderBottom: i < 2 ? '1px solid rgb(244 240 232 / 0.08)' : 'none' }}>
                  <div className="flex items-center gap-2 mb-2" style={{ color: '#596054' }}>
                    {field.icon}
                    <span style={{ fontSize: 8.5, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#596054' }}>{field.label}</span>
                  </div>
                  {field.content}
                </div>
              ))}
            </div>

            <div className="mt-4 sm:mt-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <button type="submit"
                className="w-full sm:w-auto focus:outline-none transition-all duration-300 flex items-center justify-center"
                style={{ background: '#F4F0E8', color: '#171715', padding: '16px 36px', fontSize: 10, letterSpacing: '0.26em', textTransform: 'uppercase', minHeight: 52 }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#DED7CA'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#F4F0E8'; }}
              >
                Check Availability
              </button>
              <button type="button" onClick={onConcierge} className="hover-line focus:outline-none text-center sm:text-left"
                style={{ fontSize: 11, letterSpacing: '0.18em', color: '#A68A63' }}>
                Or let our concierge guide you →
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Mobile sticky CTA */}
      <div className="fixed bottom-0 inset-x-0 z-30 lg:hidden pb-safe" style={{ background: '#171715' }}>
        <button
          onClick={() => onNavigate('offers')}
          className="w-full focus:outline-none flex items-center justify-center gap-2"
          style={{ color: '#F4F0E8', fontSize: 10, letterSpacing: '0.26em', textTransform: 'uppercase', fontWeight: 500, height: 52 }}
        >
          Check Availability <ArrowRightIcon size={12} />
        </button>
      </div>
    </div>
  );
}
