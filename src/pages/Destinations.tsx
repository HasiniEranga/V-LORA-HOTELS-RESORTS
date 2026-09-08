import { useState, useRef } from 'react';
import type { Page, Destination } from '../types';
import { destinations } from '../data';
import { CloseIcon, ArrowRightIcon, LocationIcon } from '../components/Icons';
import { useCurrency } from '../context/Currency';
import { WORLD_LAND_PATH } from '../worldLand';

interface DestinationsProps { onNavigate: (p: Page) => void; }

const TYPE_FILTERS = ['All', 'Beach', 'City', 'Mountain', 'Island', 'Cultural', 'Wellness'] as const;

const REGION_LABELS: Record<string, string> = {
  asia: 'Asia',
  europe: 'Europe',
  'middle-east': 'Middle East',
  africa: 'Africa & Indian Ocean',
  americas: 'Americas',
};

// Mercator pin positions — x = (lng+180)/360*100, y = (90-lat)/180*100
function pinPos(lat: number, lng: number) {
  return { x: ((lng + 180) / 360) * 100, y: ((90 - lat) / 180) * 100 };
}

export default function Destinations({ onNavigate }: DestinationsProps) {
  const [filter,   setFilter]   = useState('All');
  const [drawer,   setDrawer]   = useState<Destination | null>(null);
  const [hovered,  setHovered]  = useState<string | null>(null);
  const [selected, setSelected] = useState<Destination | null>(null);
  const mapRef = useRef<SVGSVGElement>(null);
  const { fmt } = useCurrency();

  const filtered = filter === 'All'
    ? destinations
    : destinations.filter(d => d.filterTypes.some(t => t.toLowerCase() === filter.toLowerCase()));

  const activeDestination = hovered
    ? destinations.find(d => d.id === hovered)
    : selected;

  return (
    <div className="page-fade min-h-screen" style={{ background: '#F4F0E8' }}>

      {/* Hero */}
      <div className="relative flex items-end" style={{ height: '58vh', background: '#16150E' }}>
        <img
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1800&h=900&fit=crop&auto=format"
          alt="VÉLORA — destinations across the world"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: 0.55 }}
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgb(22 21 14 / 0.80) 0%, transparent 55%)' }} />
        <div className="relative z-10 max-w-[1280px] w-full mx-auto px-4 sm:px-6 lg:px-12 pb-12 lg:pb-16">
          <div className="stagger-1" style={{ fontSize: 9, letterSpacing: '0.38em', textTransform: 'uppercase', color: 'rgb(216 200 168 / 0.5)', marginBottom: 14 }}>
            Destinations · {destinations.length} Properties Worldwide
          </div>
          <h1 className="stagger-2" style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(38px, 7vw, 80px)', color: '#F4F0E8', fontWeight: 400, lineHeight: 0.95 }}>
            Go somewhere<br /><em>extraordinary.</em>
          </h1>
        </div>
      </div>

      {/* Sticky filter bar */}
      <div
        className="sticky top-[68px] lg:top-[76px] z-20 py-3"
        style={{ background: 'rgb(244 240 232 / 0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgb(23 23 21 / 0.07)' }}
      >
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex items-center gap-2 overflow-x-auto pb-0.5" style={{ scrollbarWidth: 'none' }}>
            {TYPE_FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="flex-shrink-0 focus:outline-none transition-all duration-200"
                style={{
                  padding: '7px 16px', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase',
                  border: `1px solid ${filter === f ? '#171715' : 'rgb(23 23 21 / 0.12)'}`,
                  background: filter === f ? '#171715' : 'transparent',
                  color: filter === f ? '#F4F0E8' : '#89917F',
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── World Atlas Map ──────────────────────────────────────────────────── */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-12 pt-12 pb-6">
        <div className="flex items-baseline justify-between mb-5">
          <div style={{ fontSize: 9, letterSpacing: '0.36em', textTransform: 'uppercase', color: '#89917F' }}>
            World Atlas
          </div>
          <div style={{ fontSize: 11, color: '#89917F', fontStyle: 'italic' }}>
            {destinations.length} destinations across 5 regions
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0" style={{ border: '1px solid rgb(23 23 21 / 0.08)' }}>
          {/* SVG Map */}
          <div className="lg:col-span-2 relative" style={{ background: '#EDE8DF' }}>
            <svg
              ref={mapRef}
              viewBox="0 0 360 180"
              className="w-full"
              style={{ display: 'block', height: 'clamp(220px, 35vw, 340px)' }}
              aria-label="World map showing VÉLORA destinations"
            >
              {/* Graticule — every 30° */}
              {[-60, -30, 0, 30, 60].map(lat => (
                <line key={`lat${lat}`} x1="0" y1={90 - lat} x2="360" y2={90 - lat}
                  stroke="rgb(23 23 21 / 0.07)" strokeWidth="0.5" />
              ))}
              {[-150, -120, -90, -60, -30, 0, 30, 60, 90, 120, 150].map(lng => (
                <line key={`lng${lng}`} x1={lng + 180} y1="0" x2={lng + 180} y2="180"
                  stroke="rgb(23 23 21 / 0.07)" strokeWidth="0.5" />
              ))}
              {/* Equator */}
              <line x1="0" y1="90" x2="360" y2="90" stroke="rgb(23 23 21 / 0.1)" strokeWidth="0.6" />

              {/* Accurate world land outline (Natural Earth 110m) */}
              <path d={WORLD_LAND_PATH} fill="rgb(23 23 21 / 0.10)" stroke="rgb(23 23 21 / 0.22)" strokeWidth="0.25" strokeLinejoin="round" />


              {/* Destination pins */}
              {destinations.map(d => {
                const pos   = pinPos(d.lat, d.lng);
                const cx    = pos.x / 100 * 360;
                const cy    = pos.y / 100 * 180;
                const isHov = hovered  === d.id;
                const isSel = selected?.id === d.id;
                const isAct = isHov || isSel;
                return (
                  <g key={d.id}
                    onClick={() => setSelected(selected?.id === d.id ? null : d)}
                    onMouseEnter={() => setHovered(d.id)}
                    onMouseLeave={() => setHovered(null)}
                    style={{ cursor: 'pointer' }}
                    role="button"
                    aria-label={d.name}
                  >
                    {/* Pulse ring */}
                    <circle cx={cx} cy={cy} r={isAct ? 9 : 6}
                      fill={isAct ? 'rgb(166 138 99 / 0.18)' : 'rgb(166 138 99 / 0.1)'}
                      style={{ transition: 'r 0.3s ease, fill 0.3s ease' }} />
                    {/* Core dot */}
                    <circle cx={cx} cy={cy} r={isAct ? 4 : 3}
                      fill={isAct ? '#A68A63' : 'rgb(166 138 99 / 0.7)'}
                      style={{ transition: 'r 0.3s ease, fill 0.3s ease' }} />
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Active destination preview */}
          <div className="relative overflow-hidden" style={{ background: '#171715', minHeight: 200 }}>
            {activeDestination ? (
              <div key={activeDestination.id} style={{ animation: 'revealUp 0.3s ease' }}>
                <div style={{ height: 130, background: '#2A2820', position: 'relative', overflow: 'hidden' }}>
                  <img src={activeDestination.image} alt={activeDestination.name} className="w-full h-full object-cover" style={{ opacity: 0.7 }} loading="lazy" />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #171715 0%, transparent 55%)' }} />
                </div>
                <div className="p-5 pb-6">
                  <div style={{ fontSize: 8, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgb(166 138 99 / 0.7)', marginBottom: 5 }}>
                    {REGION_LABELS[activeDestination.region]} · {activeDestination.country}
                  </div>
                  <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, color: '#F4F0E8', fontWeight: 400, marginBottom: 3 }}>
                    {activeDestination.name}
                  </div>
                  <div style={{ fontSize: 10, color: '#A68A63', letterSpacing: '0.08em', marginBottom: 10 }}>
                    {activeDestination.propertyName}
                  </div>
                  <div style={{ fontSize: 12, color: 'rgb(244 240 232 / 0.5)', lineHeight: 1.7, marginBottom: 14 }}>
                    {activeDestination.signature}
                  </div>
                  <div style={{ fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgb(244 240 232 / 0.35)', marginBottom: 6 }}>
                    From
                  </div>
                  <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, color: '#F4F0E8', marginBottom: 16 }}>
                    {fmt(activeDestination.priceFromUSD)} <span style={{ fontSize: 10, fontFamily: 'Inter, sans-serif', color: 'rgb(244 240 232 / 0.4)', letterSpacing: '0.14em' }}>/ night</span>
                  </div>
                  <button
                    onClick={() => setDrawer(activeDestination)}
                    className="w-full flex items-center justify-center gap-2 focus:outline-none"
                    style={{ border: '1px solid rgb(244 240 232 / 0.2)', color: '#F4F0E8', padding: '11px 0', fontSize: 9, letterSpacing: '0.24em', textTransform: 'uppercase' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgb(244 240 232 / 0.08)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                  >
                    Explore Stay <ArrowRightIcon size={11} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-6" style={{ minHeight: 200 }}>
                <div style={{ fontSize: 10, color: 'rgb(244 240 232 / 0.25)', letterSpacing: '0.2em', textTransform: 'uppercase', textAlign: 'center', lineHeight: 1.9 }}>
                  Hover or tap a<br />destination pin
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Destination grid by region ────────────────────────────────────────── */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-12 pb-24 lg:pb-28">
        {filtered.length === 0 ? (
          <div className="py-32 text-center">
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 26, color: '#171715', fontWeight: 400 }}>Nothing here yet.</div>
            <p className="mt-2" style={{ fontSize: 14, color: '#89917F' }}>Try a different filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-12 gap-3 sm:gap-4">
            {filtered.map((dest, i) => {
              const spans   = ['col-span-12 sm:col-span-8', 'col-span-12 sm:col-span-4', 'col-span-12 sm:col-span-4', 'col-span-12 sm:col-span-8', 'col-span-12 sm:col-span-6', 'col-span-12 sm:col-span-6'];
              const heights = [420, 420, 360, 360, 400, 400];
              const span    = spans[i % spans.length];
              const height  = heights[i % heights.length];
              return (
                <button
                  key={dest.id}
                  onClick={() => setDrawer(dest)}
                  className={`${span} img-reveal reveal relative text-left group overflow-hidden focus:outline-none`}
                  style={{ height, background: '#DED7CA', transitionDelay: `${i * 0.07}s` }}
                  aria-label={`${dest.name} — ${dest.propertyName}`}
                >
                  <img src={dest.image} alt={`${dest.name}, ${dest.country}`}
                    className="absolute inset-0 w-full h-full object-cover img-zoom" loading="lazy" />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgb(22 21 14 / 0.80) 0%, transparent 55%)' }} />

                  {/* Region badge */}
                  <div className="absolute top-4 left-4 px-2 py-1"
                    style={{ background: 'rgb(22 21 14 / 0.55)', fontSize: 8, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'rgb(244 240 232 / 0.65)' }}>
                    {REGION_LABELS[dest.region]}
                  </div>

                  {/* Pin icon */}
                  <div className="absolute top-4 right-4">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ border: '1px solid rgb(244 240 232 / 0.3)', background: 'rgb(22 21 14 / 0.35)' }}>
                      <LocationIcon size={10} style={{ color: '#F4F0E8' }} />
                    </div>
                  </div>

                  {/* Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7">
                    <div style={{ fontSize: 9, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgb(216 200 168 / 0.55)', marginBottom: 5 }}>
                      {dest.country}
                    </div>
                    <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(18px, 2.2vw, 26px)', color: '#F4F0E8', fontWeight: 400, marginBottom: 3 }}>
                      {dest.name}
                    </div>
                    <div style={{ fontSize: 9.5, color: 'rgb(166 138 99 / 0.85)', letterSpacing: '0.1em', marginBottom: 8 }}>
                      {dest.propertyName}
                    </div>
                    <div className="flex items-center justify-between">
                      <div style={{ fontSize: 11, color: 'rgb(244 240 232 / 0.5)', fontStyle: 'italic' }}>
                        {dest.signature}
                      </div>
                      <div style={{ fontSize: 11, color: '#D8C8A8', letterSpacing: '0.05em', flexShrink: 0, marginLeft: 12 }}>
                        From {fmt(dest.priceFromUSD)}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Destination detail drawer ─────────────────────────────────────────── */}
      {drawer && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-stretch sm:justify-end"
          style={{ background: 'rgb(22 21 14 / 0.6)', backdropFilter: 'blur(6px)' }}
          onClick={e => { if (e.target === e.currentTarget) setDrawer(null); }}
        >
          <div
            className="w-full sm:w-[460px] h-auto sm:h-full overflow-y-auto"
            style={{ background: '#F4F0E8', animation: 'slideUp 0.42s cubic-bezier(0.25,0.46,0.45,0.94)' }}
          >
            {/* Image */}
            <div className="relative img-zoom" style={{ height: 280, background: '#DED7CA' }}>
              <img src={drawer.image} alt={drawer.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgb(22 21 14 / 0.55) 0%, transparent 50%)' }} />
              <button onClick={() => setDrawer(null)} className="absolute top-4 right-4 p-2 focus:outline-none"
                style={{ background: 'rgb(22 21 14 / 0.55)', color: '#F4F0E8' }} aria-label="Close">
                <CloseIcon size={15} />
              </button>
              {/* Price badge */}
              <div className="absolute bottom-4 left-5">
                <div style={{ fontSize: 8.5, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgb(216 200 168 / 0.6)', marginBottom: 4 }}>From</div>
                <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 26, color: '#F4F0E8' }}>
                  {fmt(drawer.priceFromUSD)} <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: 'rgb(244 240 232 / 0.5)' }}>/ night</span>
                </div>
              </div>
            </div>

            <div className="px-6 sm:px-8 py-7">
              <div style={{ fontSize: 8.5, letterSpacing: '0.34em', textTransform: 'uppercase', color: '#89917F', marginBottom: 4 }}>
                {REGION_LABELS[drawer.region]} · {drawer.country}
              </div>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 32, color: '#171715', fontWeight: 400, lineHeight: 1.05, marginBottom: 4 }}>
                {drawer.name}
              </h2>
              <div style={{ fontSize: 11, color: '#A68A63', letterSpacing: '0.1em', marginBottom: 18 }}>
                {drawer.propertyName}
              </div>
              <p style={{ fontSize: 14, color: '#596054', lineHeight: 1.85, marginBottom: 22 }}>
                {drawer.description}
              </p>

              <div className="rule mb-6" />

              <div className="grid grid-cols-2 gap-x-6 gap-y-5 mb-6">
                {[
                  { l: 'Climate', v: drawer.climate },
                  { l: 'Best time', v: drawer.bestTime },
                  { l: 'Signature', v: drawer.signature },
                  { l: 'Coordinates', v: drawer.coords },
                ].map(row => (
                  <div key={row.l}>
                    <div style={{ fontSize: 8.5, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#89917F', marginBottom: 5 }}>{row.l}</div>
                    <div style={{ fontSize: 13, color: '#171715', lineHeight: 1.5 }}>{row.v}</div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => { setDrawer(null); onNavigate('stays'); }}
                className="w-full focus:outline-none transition-all duration-300 flex items-center justify-center gap-2.5"
                style={{ background: '#171715', color: '#F4F0E8', padding: '15px 0', fontSize: 10, letterSpacing: '0.26em', textTransform: 'uppercase' }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#596054'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#171715'; }}
              >
                Explore Stays <ArrowRightIcon size={13} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
