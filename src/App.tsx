import { useState, useEffect, useRef, useCallback } from 'react';
import type { Page, BookingState } from './types';
import { CurrencyProvider } from './context/Currency';
import LoadingScreen from './components/LoadingScreen';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ConciergeModal from './components/ConciergeModal';
import Home from './pages/Home';
import Destinations from './pages/Destinations';
import Stays from './pages/Stays';
import Experiences from './pages/Experiences';
import Offers from './pages/Offers';
import Journey from './pages/Journey';
import heroVideo from '@/imports/IMG_0664__1_.MP4';

const defaultBooking: BookingState = {
  destination: '',
  checkIn: '',
  checkOut: '',
  adults: 2,
  children: 0,
  rooms: 1,
  selectedRoom: '',
  experiences: [],
  selectedOffer: '',
  step: 1,
  confirmed: false,
  confirmationNumber: '',
  totalPrice: 0,
};

/* Custom cursor — dot + lagged ring */
function CustomCursor() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const posRef  = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const animFrame = useRef<number>(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.left = `${e.clientX}px`;
        dotRef.current.style.top  = `${e.clientY}px`;
      }
    };
    const onEnter = () => {
      dotRef.current?.classList.add('hovering');
      ringRef.current?.classList.add('hovering');
    };
    const onLeave = () => {
      dotRef.current?.classList.remove('hovering');
      ringRef.current?.classList.remove('hovering');
    };
    const animate = () => {
      ringPos.current.x += (posRef.current.x - ringPos.current.x) * 0.12;
      ringPos.current.y += (posRef.current.y - ringPos.current.y) * 0.12;
      if (ringRef.current) {
        ringRef.current.style.left = `${ringPos.current.x}px`;
        ringRef.current.style.top  = `${ringPos.current.y}px`;
      }
      animFrame.current = requestAnimationFrame(animate);
    };
    document.addEventListener('mousemove', onMove);
    document.querySelectorAll('a, button, [role="button"], input, select, label').forEach(el => {
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
    });
    animFrame.current = requestAnimationFrame(animate);
    return () => {
      document.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(animFrame.current);
    };
  }, []);

  return (
    <>
      <div ref={dotRef}  className="cursor-dot"  aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
    </>
  );
}

/* Global scroll-reveal observer */
function useScrollReveals(currentPage: Page, loading: boolean) {
  useEffect(() => {
    if (loading) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const io = prefersReduced
      ? null
      : new IntersectionObserver(
          (entries) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                io!.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.01, rootMargin: '0px 0px 0px 0px' }
        );

    // Scan for any not-yet-revealed elements and start observing them.
    // Re-run whenever the DOM changes (page switch, filters, property
    // selection) so dynamically added cards always reveal.
    const scan = () => {
      const els = document.querySelectorAll<HTMLElement>('.reveal:not(.revealed), .img-reveal:not(.revealed)');
      if (prefersReduced) {
        els.forEach(el => el.classList.add('revealed'));
        return;
      }
      els.forEach(el => io!.observe(el));
    };

    let frame = requestAnimationFrame(scan);
    const mo = new MutationObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(scan);
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(frame);
      mo.disconnect();
      io?.disconnect();
    };
  }, [currentPage, loading]);
}

/* Page curtain transition — ivory wipe between page changes */
type CurtainPhase = 'idle' | 'entering' | 'leaving';

export default function App() {
  const [loading,       setLoading]       = useState(true);
  const [currentPage,   setCurrentPage]   = useState<Page>('home');
  const [booking,       setBooking]       = useState<BookingState>(defaultBooking);
  const [showConcierge, setShowConcierge] = useState(false);
  const [curtain,       setCurtain]       = useState<CurtainPhase>('idle');
  const pendingPage = useRef<Page | null>(null);

  useScrollReveals(currentPage, loading);

  const handleNavigate = useCallback((page: Page) => {
    if (page === currentPage) return;

    // Respect reduced motion — skip curtain
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCurrentPage(page);
      window.scrollTo({ top: 0 });
      return;
    }

    pendingPage.current = page;
    setCurtain('entering');

    // After curtain covers the screen, switch page
    setTimeout(() => {
      setCurrentPage(pendingPage.current!);
      window.scrollTo({ top: 0 });
      setCurtain('leaving');
      // After curtain has fully left, reset
      setTimeout(() => setCurtain('idle'), 560);
    }, 440);
  }, [currentPage]);

  const transparentNavPages: Page[] = ['home'];
  const isTransparent = transparentNavPages.includes(currentPage);

  if (loading) {
    return (
      <>
        <LoadingScreen onComplete={() => setLoading(false)} />
        {/* Preload the hero video during the loading screen so it plays
            the moment the home page appears. */}
        <video
          src={heroVideo}
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          tabIndex={-1}
          style={{ position: 'fixed', width: 1, height: 1, opacity: 0, pointerEvents: 'none', bottom: 0, left: 0 }}
        />
      </>
    );
  }

  return (
    <CurrencyProvider>
    <div className="grain-overlay-wrapper relative">
      <div className="grain-overlay" aria-hidden="true" />
      <CustomCursor />

      {/* Ivory page curtain */}
      {curtain !== 'idle' && (
        <div
          className={`page-curtain ${curtain === 'entering' ? 'curtain-enter' : 'curtain-leave'}`}
          aria-hidden="true"
        />
      )}

      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        transparent={isTransparent}
        booking={booking}
      />

      <main id="main-content" tabIndex={-1}>
        {currentPage === 'home' && (
          <Home
            onNavigate={handleNavigate}
            booking={booking}
            setBooking={setBooking}
            onConcierge={() => setShowConcierge(true)}
          />
        )}
        {currentPage === 'destinations' && (
          <div className="pt-16 lg:pt-20">
            <Destinations onNavigate={handleNavigate} />
          </div>
        )}
        {currentPage === 'stays' && (
          <Stays
            onNavigate={handleNavigate}
            booking={booking}
            setBooking={setBooking}
          />
        )}
        {currentPage === 'experiences' && (
          <div className="pt-16 lg:pt-20">
            <Experiences
              onNavigate={handleNavigate}
              booking={booking}
              setBooking={setBooking}
            />
          </div>
        )}
        {currentPage === 'offers' && (
          <Offers
            onNavigate={handleNavigate}
            booking={booking}
            setBooking={setBooking}
          />
        )}
        {currentPage === 'journey' && (
          <Journey
            onNavigate={handleNavigate}
            booking={booking}
          />
        )}
      </main>

      <Footer onNavigate={handleNavigate} />

      <ConciergeModal
        open={showConcierge}
        onClose={() => setShowConcierge(false)}
        onNavigate={handleNavigate}
      />
    </div>
    </CurrencyProvider>
  );
}
