import { useState } from 'react';
import type { Page } from '../types';

export default function Footer({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) { setDone(true); setEmail(''); }
  };

  const link = (label: string, page: Page) => (
    <button
      key={label}
      onClick={() => onNavigate(page)}
      className="hover-line text-left focus:outline-none transition-colors duration-200"
      style={{ fontSize: 13, color: 'rgb(244 240 232 / 0.45)', fontWeight: 300, lineHeight: 1 }}
      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgb(244 240 232 / 0.8)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgb(244 240 232 / 0.45)'; }}
    >
      {label}
    </button>
  );

  return (
    <footer style={{ background: '#171715', color: '#F4F0E8' }} aria-label="Site footer">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12 pt-20 lg:pt-28 pb-10">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 mb-16 lg:mb-20">

          {/* Brand column */}
          <div className="lg:col-span-4">
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, letterSpacing: '0.28em', marginBottom: 4 }}>
              VÉLORA
            </div>
            <div style={{ fontSize: 8, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgb(244 240 232 / 0.3)', marginBottom: 28 }}>
              Hotels &amp; Resorts
            </div>
            <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 14, color: 'rgb(244 240 232 / 0.35)', fontStyle: 'italic', lineHeight: 1.7, maxWidth: 280, marginBottom: 24 }}>
              "Stay beyond the expected."
            </p>
            <div style={{ fontSize: 12, color: 'rgb(244 240 232 / 0.3)', lineHeight: 2, fontWeight: 300 }}>
              <div>hello@velora.com</div>
              <div>+44 20 3456 7890</div>
              <div>London · Geneva · Singapore</div>
            </div>
          </div>

          {/* Explore */}
          <div className="lg:col-span-2 lg:col-start-6">
            <div style={{ fontSize: 8.5, letterSpacing: '0.32em', textTransform: 'uppercase', color: 'rgb(244 240 232 / 0.25)', marginBottom: 20 }}>Explore</div>
            <div className="flex flex-col gap-4">
              {([['Destinations','destinations'],['Stays','stays'],['Experiences','experiences'],['Offers','offers']] as [string,Page][]).map(([l,p]) => link(l,p))}
            </div>
          </div>

          {/* Company */}
          <div className="lg:col-span-2">
            <div style={{ fontSize: 8.5, letterSpacing: '0.32em', textTransform: 'uppercase', color: 'rgb(244 240 232 / 0.25)', marginBottom: 20 }}>Company</div>
            <div className="flex flex-col gap-4">
              {['About', 'Contact', 'Careers', 'Press', 'Sustainability'].map(t => (
                <button key={t} className="hover-line text-left focus:outline-none transition-colors"
                  style={{ fontSize: 13, color: 'rgb(244 240 232 / 0.45)', fontWeight: 300 }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgb(244 240 232 / 0.8)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgb(244 240 232 / 0.45)'; }}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-3 lg:col-start-10">
            <div style={{ fontSize: 8.5, letterSpacing: '0.32em', textTransform: 'uppercase', color: 'rgb(244 240 232 / 0.25)', marginBottom: 20 }}>
              Stories from VÉLORA
            </div>
            <p style={{ fontSize: 13, color: 'rgb(244 240 232 / 0.38)', lineHeight: 1.8, fontWeight: 300, marginBottom: 20, maxWidth: 260 }}>
              Occasional notes on travel, place and the quiet art of staying well.
            </p>
            {done ? (
              <div style={{ fontSize: 13, color: '#A68A63', fontStyle: 'italic', fontFamily: 'Playfair Display, serif' }}>
                Thank you. We will be in touch.
              </div>
            ) : (
              <form onSubmit={submit} className="flex flex-col gap-4">
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="Your email"
                  required
                  className="bg-transparent focus:outline-none"
                  style={{
                    fontSize: 13, color: '#F4F0E8', fontWeight: 300,
                    borderBottom: '1px solid rgb(244 240 232 / 0.15)',
                    paddingBottom: 10,
                  }}
                  aria-label="Email for newsletter"
                />
                <button
                  type="submit"
                  className="self-start focus:outline-none transition-all duration-300"
                  style={{ fontSize: 9.5, letterSpacing: '0.24em', textTransform: 'uppercase', color: '#A68A63', border: '1px solid rgb(166 138 99 / 0.4)', padding: '10px 22px' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#A68A63'; (e.currentTarget as HTMLButtonElement).style.color = '#F4F0E8'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = '#A68A63'; }}
                >
                  Subscribe
                </button>
              </form>
            )}

            <div className="flex gap-5 mt-8">
              {['IG','FB','TW','YT'].map(s => (
                <button key={s} className="hover-line focus:outline-none"
                  style={{ fontSize: 9.5, letterSpacing: '0.2em', color: 'rgb(244 240 232 / 0.25)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgb(244 240 232 / 0.7)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgb(244 240 232 / 0.25)'; }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="rule-light pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div style={{ fontSize: 10, color: 'rgb(244 240 232 / 0.2)', letterSpacing: '0.08em' }}>
            © 2026 VÉLORA Hotels &amp; Resorts. All rights reserved.
          </div>
          <div className="flex gap-5">
            {['Privacy','Terms','Accessibility','Cookies'].map(t => (
              <button key={t} className="hover-line focus:outline-none"
                style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgb(244 240 232 / 0.22)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgb(244 240 232 / 0.6)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgb(244 240 232 / 0.22)'; }}>
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
