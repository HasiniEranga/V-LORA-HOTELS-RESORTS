import { useEffect, useRef, useState } from 'react';

/**
 * Shows for at least MIN_MS, then leaves as soon as the hero video is
 * `ready` — so the loader hands off straight into the playing video.
 * Never waits longer than MAX_MS so a slow/failed video can't hang it.
 */
export default function LoadingScreen({ onComplete, ready = true }: { onComplete: () => void; ready?: boolean }) {
  const [, setPct] = useState(0);
  const [out, setOut] = useState(false);
  const readyRef = useRef(ready);
  const leaving = useRef(false);

  useEffect(() => { readyRef.current = ready; }, [ready]);

  useEffect(() => {
    const MIN_MS = 2400, MAX_MS = 7000, start = Date.now();
    const step = setInterval(() => setPct(p => Math.min(p + 1.2, 100)), 28);
    const leave = () => {
      if (leaving.current) return;
      leaving.current = true;
      setOut(true);
      setTimeout(onComplete, 700);
    };
    const poll = setInterval(() => {
      const elapsed = Date.now() - start;
      if ((elapsed >= MIN_MS && readyRef.current) || elapsed >= MAX_MS) {
        clearInterval(poll);
        leave();
      }
    }, 120);
    return () => { clearInterval(step); clearInterval(poll); };
  }, [onComplete]);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{
        backgroundColor: '#171715',
        opacity: out ? 0 : 1,
        transition: 'opacity 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {/* Wordmark */}
      <div className="stagger-1 flex flex-col items-center">
        <span
          style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 'clamp(22px, 4vw, 30px)',
            letterSpacing: '0.38em',
            color: '#F4F0E8',
            fontWeight: 400,
          }}
        >
          VÉLORA
        </span>
        <span
          style={{
            fontSize: 9,
            letterSpacing: '0.38em',
            color: 'rgb(137 145 127 / 0.7)',
            fontWeight: 300,
            marginTop: 6,
            textTransform: 'uppercase',
          }}
        >
          Hotels &amp; Resorts
        </span>
      </div>

      {/* Progress line */}
      <div className="mt-12 w-32 h-px overflow-hidden" style={{ background: 'rgb(244 240 232 / 0.08)' }}>
        <div
          className="h-full load-bar"
          style={{ background: 'rgb(166 138 99 / 0.6)' }}
        />
      </div>
    </div>
  );
}
