import { useState, useEffect, useRef } from 'react';
import type { Page, BookingState } from '../types';
import { MenuIcon, CloseIcon } from './Icons';
import { destinations } from '../data';
import { useCurrency, CURRENCIES } from '../context/Currency';
import type { CurrencyCode } from '../types';

interface NavbarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  transparent?: boolean;
  booking?: BookingState;
}

const NAV: { label: string; page: Page }[] = [
  { label: 'Destinations', page: 'destinations' },
  { label: 'Stays',        page: 'stays' },
  { label: 'Experiences',  page: 'experiences' },
  { label: 'Offers',       page: 'offers' },
];

const LANGUAGES = [
  { code: 'EN', label: 'English' },
  { code: 'FR', label: 'Français' },
  { code: 'DE', label: 'Deutsch' },
  { code: 'JA', label: '日本語' },
];

export default function Navbar({ currentPage, onNavigate, transparent = false, booking }: NavbarProps) {
  const [scrolled,     setScrolled]     = useState(false);
  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [langOpen,     setLangOpen]     = useState(false);
  const [langCode,     setLangCode]     = useState('EN');
  const [toast,        setToast]        = useState('');
  const toastTimer  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const currencyRef = useRef<HTMLDivElement>(null);
  const langRef     = useRef<HTMLDivElement>(null);

  const { currency, setCurrencyCode } = useCurrency();

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 48);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (currencyRef.current && !currencyRef.current.contains(e.target as Node)) setCurrencyOpen(false);
      if (langRef.current     && !langRef.current.contains(e.target as Node))     setLangOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 2400);
  };

  const handleCurrency = (code: CurrencyCode) => {
    setCurrencyCode(code);
    setCurrencyOpen(false);
    const meta = CURRENCIES.find(c => c.code === code)!;
    showToast(`Prices updated to ${meta.code}.`);
  };

  const ghost  = transparent && !scrolled && !mobileOpen;
  const fg     = ghost ? '#F4F0E8'                 : '#171715';
  const fgDim  = ghost ? 'rgb(244 240 232 / 0.5)'  : '#89917F';
  const fgMid  = ghost ? 'rgb(244 240 232 / 0.75)' : '#596054';

  const destName = booking?.destination ? destinations.find(d => d.id === booking.destination)?.name : null;
  const hasActiveBooking = !!(destName || booking?.checkIn);
  const bookingSummary = [
    destName,
    booking?.checkIn && booking?.checkOut
      ? `${new Date(booking.checkIn).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} – ${new Date(booking.checkOut).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`
      : null,
    booking?.adults ? `${booking.adults} ${booking.adults === 1 ? 'guest' : 'guests'}` : null,
  ].filter(Boolean).join(' · ');

  const dropdownBase: React.CSSProperties = {
    position: 'absolute', top: 'calc(100% + 10px)', right: 0,
    background: '#F4F0E8', minWidth: 220, zIndex: 100,
    border: '1px solid rgb(23 23 21 / 0.1)',
    boxShadow: '0 12px 48px rgb(23 23 21 / 0.12)',
    animation: 'revealUp 0.22s ease forwards',
  };

  return (
    <>
      {/* Currency-switched toast */}
      {toast && (
        <div
          className="fixed bottom-24 left-1/2 z-[9999] -translate-x-1/2 px-5 py-3 pointer-events-none"
          style={{ background: '#171715', color: '#F4F0E8', fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', animation: 'revealUp 0.3s ease' }}
          role="status" aria-live="polite"
        >
          {toast}
        </div>
      )}

      <header className="fixed top-0 inset-x-0 z-40 transition-all duration-500" aria-label="Main navigation">
        <div className={ghost ? '' : 'nav-solid'}>
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-12">
            <div className="flex items-center justify-between h-[68px] lg:h-[76px]">

              {/* Logo */}
              <button onClick={() => onNavigate('home')} className="flex flex-col gap-[3px] focus:outline-none" aria-label="VÉLORA — home">
                <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 17, letterSpacing: '0.32em', color: fg, lineHeight: 1, transition: 'color 0.4s ease' }}>
                  VÉLORA
                </span>
                <span style={{ fontSize: 7.5, letterSpacing: '0.32em', color: fgDim, textTransform: 'uppercase', fontWeight: 300, transition: 'color 0.4s ease' }}>
                  Hotels &amp; Resorts
                </span>
              </button>

              {/* Desktop nav */}
              <nav className="hidden lg:flex items-center gap-9" aria-label="Pages">
                {NAV.map(({ label, page }) => {
                  const isActive = currentPage === page;
                  return (
                    <button
                      key={page}
                      onClick={() => onNavigate(page)}
                      className="relative focus:outline-none transition-colors duration-300"
                      style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: isActive ? 500 : 400, color: isActive ? fg : fgMid, paddingBottom: 4 }}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      {label}
                      <span style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, background: isActive ? (ghost ? 'rgb(244 240 232 / 0.7)' : '#171715') : 'transparent', transition: 'background 0.3s ease' }} aria-hidden="true" />
                    </button>
                  );
                })}
              </nav>

              {/* Right cluster */}
              <div className="hidden lg:flex items-center gap-5">
                {hasActiveBooking && currentPage !== 'offers' && currentPage !== 'journey' && (
                  <button
                    onClick={() => onNavigate('offers')}
                    className="focus:outline-none flex items-center gap-2"
                    style={{ fontSize: 10, letterSpacing: '0.12em', color: ghost ? 'rgb(216 200 168 / 0.85)' : '#A68A63', borderBottom: `1px solid ${ghost ? 'rgb(216 200 168 / 0.4)' : 'rgb(166 138 99 / 0.4)'}`, paddingBottom: 2 }}
                  >
                    {bookingSummary}
                  </button>
                )}

                {/* Language */}
                <div ref={langRef} style={{ position: 'relative' }}>
                  <button
                    onClick={() => { setLangOpen(v => !v); setCurrencyOpen(false); }}
                    className="focus:outline-none flex items-center gap-1"
                    style={{ fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: fgDim }}
                    aria-expanded={langOpen}
                  >
                    {langCode} <span style={{ fontSize: 8, marginTop: 1 }}>▾</span>
                  </button>
                  {langOpen && (
                    <div style={dropdownBase}>
                      <div style={{ padding: '10px 16px 8px', fontSize: 8, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#89917F', borderBottom: '1px solid rgb(23 23 21 / 0.07)' }}>Language</div>
                      {LANGUAGES.map(l => (
                        <button key={l.code} onClick={() => { setLangCode(l.code); setLangOpen(false); }}
                          className="w-full text-left flex items-center justify-between focus:outline-none"
                          style={{ padding: '10px 16px', fontSize: 12, color: l.code === langCode ? '#171715' : '#596054', background: l.code === langCode ? 'rgb(23 23 21 / 0.03)' : 'transparent' }}>
                          {l.label}
                          {l.code === langCode && <span style={{ fontSize: 9, color: '#A68A63' }}>✓</span>}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Currency */}
                <div ref={currencyRef} style={{ position: 'relative' }}>
                  <button
                    onClick={() => { setCurrencyOpen(v => !v); setLangOpen(false); }}
                    className="focus:outline-none flex items-center gap-1"
                    style={{ fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: fgDim }}
                    aria-expanded={currencyOpen}
                  >
                    {currency.code} <span style={{ fontSize: 8, marginTop: 1 }}>▾</span>
                  </button>
                  {currencyOpen && (
                    <div style={dropdownBase}>
                      <div style={{ padding: '10px 16px 8px', fontSize: 8, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#89917F', borderBottom: '1px solid rgb(23 23 21 / 0.07)' }}>Select Currency</div>
                      {CURRENCIES.map(c => (
                        <button key={c.code} onClick={() => handleCurrency(c.code)}
                          className="w-full text-left flex items-center justify-between focus:outline-none"
                          style={{ padding: '10px 16px', fontSize: 12, color: c.code === currency.code ? '#171715' : '#596054', background: c.code === currency.code ? 'rgb(23 23 21 / 0.03)' : 'transparent' }}>
                          <span>{c.label}</span>
                          <span style={{ fontSize: 10, letterSpacing: '0.1em', color: '#89917F' }}>{c.code}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => onNavigate('offers')}
                  className="focus:outline-none transition-all duration-300"
                  style={{ fontSize: 10, letterSpacing: '0.24em', textTransform: 'uppercase', color: fg, padding: '9px 22px', border: `1px solid ${ghost ? 'rgb(244 240 232 / 0.35)' : 'rgb(23 23 21 / 0.35)'}` }}
                  onMouseEnter={e => { const b = e.currentTarget; b.style.background = ghost ? 'rgb(244 240 232 / 0.12)' : '#171715'; b.style.color = '#F4F0E8'; }}
                  onMouseLeave={e => { const b = e.currentTarget; b.style.background = 'transparent'; b.style.color = fg; }}
                >
                  Reserve
                </button>
              </div>

              {/* Mobile burger */}
              <button
                className="lg:hidden p-2 focus:outline-none"
                onClick={() => setMobileOpen(v => !v)}
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileOpen}
                style={{ color: fg }}
              >
                {mobileOpen ? <CloseIcon size={20} /> : <MenuIcon size={20} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        className="fixed inset-0 z-30 lg:hidden flex flex-col"
        style={{ background: '#171715', opacity: mobileOpen ? 1 : 0, pointerEvents: mobileOpen ? 'all' : 'none', transition: 'opacity 0.38s ease' }}
        aria-hidden={!mobileOpen}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <div className="flex flex-col justify-center h-full px-8 gap-10 mt-16">
          <nav className="flex flex-col gap-5" aria-label="Pages">
            {[{ label: 'Home', page: 'home' as Page }, ...NAV].map(({ label, page }) => {
              const isActive = currentPage === page;
              return (
                <button
                  key={page}
                  onClick={() => { onNavigate(page); setMobileOpen(false); }}
                  className="text-left focus:outline-none"
                  style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(30px, 8vw, 44px)', color: isActive ? '#A68A63' : '#F4F0E8', fontWeight: 400, lineHeight: 1.15 }}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {label}
                </button>
              );
            })}
          </nav>

          {hasActiveBooking && (
            <div style={{ fontSize: 12, color: 'rgb(166 138 99 / 0.8)', letterSpacing: '0.05em', borderTop: '1px solid rgb(244 240 232 / 0.08)', paddingTop: 20 }}>
              In progress: {bookingSummary}
            </div>
          )}

          {/* Mobile currency + lang */}
          <div className="flex items-center gap-6" style={{ borderTop: '1px solid rgb(244 240 232 / 0.08)', paddingTop: 20 }}>
            <select value={currency.code} onChange={e => handleCurrency(e.target.value as CurrencyCode)}
              className="bg-transparent focus:outline-none"
              style={{ fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgb(244 240 232 / 0.55)', colorScheme: 'dark' }}>
              {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code} — {c.label}</option>)}
            </select>
            <select value={langCode} onChange={e => setLangCode(e.target.value)}
              className="bg-transparent focus:outline-none"
              style={{ fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgb(244 240 232 / 0.55)', colorScheme: 'dark' }}>
              {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.code}</option>)}
            </select>
          </div>

          <button
            onClick={() => { onNavigate('offers'); setMobileOpen(false); }}
            className="self-start focus:outline-none"
            style={{ fontSize: 10, letterSpacing: '0.26em', textTransform: 'uppercase', color: '#A68A63', border: '1px solid rgb(166 138 99 / 0.4)', padding: '14px 28px' }}
          >
            Reserve Your Stay
          </button>

          <div style={{ fontSize: 11, color: 'rgb(244 240 232 / 0.28)', letterSpacing: '0.05em', fontWeight: 300 }}>
            hello@velora.com · +44 20 3456 7890
          </div>
        </div>
      </div>
    </>
  );
}
