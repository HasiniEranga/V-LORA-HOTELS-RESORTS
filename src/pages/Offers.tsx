import { useState } from 'react';
import type { Page, BookingState } from '../types';
import { offers, destinations, properties, experiences } from '../data';
import { useCurrency } from '../context/Currency';
import { ArrowRightIcon, ArrowLeftIcon, CheckIcon, CalendarIcon, GuestsIcon, LocationIcon, PlusIcon, MinusIcon } from '../components/Icons';

interface OffersProps {
  onNavigate: (page: Page) => void;
  booking: BookingState;
  setBooking: (b: BookingState) => void;
}

const STEPS = [
  { num: 1, label: 'Destination', next: 'Dates' },
  { num: 2, label: 'Dates', next: 'Guests' },
  { num: 3, label: 'Guests', next: 'Room' },
  { num: 4, label: 'Room', next: 'Extras' },
  { num: 5, label: 'Extras', next: 'Review' },
  { num: 6, label: 'Review', next: 'Payment' },
  { num: 7, label: 'Payment', next: '' },
];

function CalendarPicker({ checkIn, checkOut, onChange }: { checkIn: string; checkOut: string; onChange: (ci: string, co: string) => void }) {
  const today = new Date();
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [selecting, setSelecting] = useState<'in' | 'out'>('in');

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();

  const formatDate = (y: number, m: number, d: number) => `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

  const handleDayClick = (d: number) => {
    const date = formatDate(viewYear, viewMonth, d);
    if (selecting === 'in' || !checkIn || date <= checkIn) {
      onChange(date, '');
      setSelecting('out');
    } else {
      onChange(checkIn, date);
      setSelecting('in');
    }
  };

  const isInRange = (d: number) => {
    const date = formatDate(viewYear, viewMonth, d);
    return checkIn && checkOut && date > checkIn && date < checkOut;
  };

  const isCheckIn = (d: number) => formatDate(viewYear, viewMonth, d) === checkIn;
  const isCheckOut = (d: number) => formatDate(viewYear, viewMonth, d) === checkOut;
  const isPast = (d: number) => formatDate(viewYear, viewMonth, d) < formatDate(today.getFullYear(), today.getMonth(), today.getDate());

  return (
    <div className="p-4">
      {/* Progressive disclosure: which date is being selected right now */}
      <div className="flex mb-3 -mx-4" style={{ borderBottom: '1px solid rgb(23 23 21 / 0.07)' }}>
        <button
          onClick={() => setSelecting('in')}
          className="flex-1 py-2.5 text-center transition-all focus:outline-none"
          style={{ fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: selecting === 'in' ? '#171715' : '#89917F', fontWeight: selecting === 'in' ? 600 : 400, borderBottom: selecting === 'in' ? '2px solid #171715' : '2px solid transparent' }}>
          Check-in {checkIn ? `· ${checkIn.slice(5).replace('-', '/')}` : '· Select date'}
        </button>
        <button
          onClick={() => checkIn && setSelecting('out')}
          className="flex-1 py-2.5 text-center transition-all focus:outline-none"
          style={{ fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: selecting === 'out' ? '#171715' : '#89917F', fontWeight: selecting === 'out' ? 600 : 400, borderBottom: selecting === 'out' ? '2px solid #171715' : '2px solid transparent', opacity: !checkIn ? 0.4 : 1 }}>
          Check-out {checkOut ? `· ${checkOut.slice(5).replace('-', '/')}` : '· Select date'}
        </button>
      </div>
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => { if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); } else setViewMonth(m => m - 1); }}
          className="p-2.5 focus:outline-none" style={{ color: '#89917F' }} aria-label="Previous month">
          <ArrowLeftIcon size={14} />
        </button>
        <div className="text-sm font-medium" style={{ color: '#171715' }}>{monthNames[viewMonth]} {viewYear}</div>
        <button onClick={() => { if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); } else setViewMonth(m => m + 1); }}
          className="p-2.5 focus:outline-none" style={{ color: '#89917F' }} aria-label="Next month">
          <ArrowRightIcon size={14} />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-0 mb-2">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
          <div key={d} className="text-center text-[9px] tracking-[0.15em] uppercase py-1" style={{ color: '#89917F' }}>{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-0">
        {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const d = i + 1;
          const inRange = isInRange(d);
          const isCI = isCheckIn(d);
          const isCO = isCheckOut(d);
          const past = isPast(d);
          return (
            <button
              key={d}
              onClick={() => !past && handleDayClick(d)}
              disabled={past}
              className="relative h-11 text-sm transition-colors duration-100 focus:outline-none disabled:opacity-25"
              style={{
                backgroundColor: isCI || isCO ? '#171715' : inRange ? 'rgb(23 23 21 / 0.07)' : 'transparent',
                color: isCI || isCO ? '#F4F0E8' : inRange ? '#171715' : '#171715',
                fontWeight: isCI || isCO ? 500 : 400,
              }}
              aria-label={`${monthNames[viewMonth]} ${d}, ${viewYear}`}
              aria-pressed={isCI || isCO}
            >
              {d}
            </button>
          );
        })}
      </div>
      <div className="flex gap-4 mt-3">
        <div className="text-[9px]" style={{ color: '#89917F' }}>
          Check-in: <strong style={{ color: '#171715' }}>{checkIn || '—'}</strong>
        </div>
        <div className="text-[9px]" style={{ color: '#89917F' }}>
          Check-out: <strong style={{ color: '#171715' }}>{checkOut || '—'}</strong>
        </div>
      </div>
    </div>
  );
}

export default function Offers({ onNavigate, booking, setBooking }: OffersProps) {
  const [bookingStep, setBookingStep] = useState(booking.step || 1);
  const [error, setError] = useState('');
  const [stepDir, setStepDir]       = useState<'forward' | 'back'>('forward');
  const [stepKey, setStepKey]       = useState(0);
  const [guest, setGuest] = useState({ name: '', email: '', card: '', expiry: '', cvc: '' });

  const { fmt } = useCurrency();
  const allRooms = properties.flatMap(p => p.rooms);
  const selectedRoomData = allRooms.find(r => r.id === booking.selectedRoom);
  const selectedExps = experiences.filter(e => booking.experiences.includes(e.id));
  const nights = booking.checkIn && booking.checkOut
    ? Math.max(0, Math.floor((new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / 86400000))
    : 0;
  const roomTotal = selectedRoomData ? selectedRoomData.pricePerNight * Math.max(nights, 1) : 0;
  const expTotal = selectedExps.reduce((s, e) => s + e.price, 0);
  const taxes = Math.round(roomTotal * 0.12);
  const appliedOffer = offers.find(o => o.id === booking.selectedOffer) || null;
  const offerPct = appliedOffer ? (parseInt(appliedOffer.savings, 10) || 0) / 100 : 0;
  const discount = Math.round((roomTotal + expTotal) * offerPct);
  const grandTotal = roomTotal + expTotal + taxes - discount;

  const validateStep = () => {
    if (bookingStep === 1 && !booking.destination) { setError('Please select a destination.'); return false; }
    if (bookingStep === 2 && (!booking.checkIn || !booking.checkOut)) { setError('Please select your check-in and check-out dates.'); return false; }
    if (bookingStep === 2 && booking.checkIn >= booking.checkOut) { setError('Check-out must be after check-in.'); return false; }
    if (bookingStep === 4 && !booking.selectedRoom) { setError('Please select a room.'); return false; }
    if (bookingStep === 7) {
      if (!guest.name.trim()) { setError('Please enter the name for the reservation.'); return false; }
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(guest.email)) { setError('Please enter a valid email address.'); return false; }
      if (guest.card.replace(/\s/g, '').length < 12) { setError('Please enter a valid card number.'); return false; }
      if (!/^\d{2}\/\d{2}$/.test(guest.expiry)) { setError('Please enter the card expiry as MM/YY.'); return false; }
      if (guest.cvc.length < 3) { setError('Please enter the card security code (CVC).'); return false; }
    }
    setError('');
    return true;
  };

  const goNext = () => {
    if (!validateStep()) return;
    if (bookingStep === 7) {
      const confNum = `VEL-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      setBooking({ ...booking, confirmed: true, confirmationNumber: confNum, step: 7, totalPrice: grandTotal });
      onNavigate('journey');
      return;
    }
    setStepDir('forward');
    setStepKey(k => k + 1);
    setBookingStep(s => Math.min(s + 1, 7));
    setBooking({ ...booking, step: Math.min(bookingStep + 1, 7) });
  };

  const goPrev = () => {
    setError('');
    setStepDir('back');
    setStepKey(k => k + 1);
    setBookingStep(s => Math.max(s - 1, 1));
  };

  const adj = (field: 'adults' | 'children' | 'rooms', delta: number) => {
    const min = field === 'rooms' ? 1 : 0;
    const max = field === 'adults' ? 8 : field === 'children' ? 6 : 5;
    setBooking({ ...booking, [field]: Math.max(min, Math.min(max, booking[field] + delta)) });
  };

  return (
    <div className="page-fade min-h-screen" style={{ backgroundColor: '#F4F0E8' }}>
      {/* Hero */}
      <div className="relative flex items-end" style={{ height: '40vh', backgroundColor: '#1a1a18' }}>
        <img
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600&h=700&fit=crop&auto=format"
          alt="VÉLORA reservation — your journey begins"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: 0.55 }}
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgb(23 23 21 / 0.8) 0%, transparent 60%)' }} />
        <div className="relative z-10 max-w-[1280px] w-full mx-auto px-6 lg:px-10 pb-10">
          <div className="text-[9px] tracking-[0.32em] uppercase mb-2" style={{ color: 'rgb(216 200 168 / 0.6)' }}>Offers &amp; Reservation</div>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(28px, 5vw, 56px)', color: '#F4F0E8', fontWeight: 400 }}>
            Your VÉLORA journey<br /><em>starts here.</em>
          </h1>
        </div>
      </div>

      {/* Offers */}
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-12 lg:py-16">
        <div className="text-[9px] tracking-[0.32em] uppercase mb-4" style={{ color: '#89917F' }}>Curated Offers</div>
        <div className="flex gap-5 overflow-x-auto pb-4 scroll-x-smooth">
          {offers.map(offer => (
            <div
              key={offer.id}
              className="flex-shrink-0 group overflow-hidden"
              style={{ width: 300, backgroundColor: '#FFFFFF', border: '1px solid rgb(23 23 21 / 0.06)' }}
            >
              <div className="img-zoom" style={{ height: 200, backgroundColor: '#DED7CA' }}>
                <img src={offer.image} alt={offer.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" loading="lazy" />
              </div>
              <div className="p-6">
                <div className="text-[9px] tracking-[0.25em] uppercase mb-1" style={{ color: '#89917F' }}>
                  {offer.nights}+ nights · Save {offer.savings}
                </div>
                <div className="text-lg mb-1" style={{ fontFamily: 'Playfair Display, serif', color: '#171715' }}>{offer.title}</div>
                <div className="text-xs mb-3" style={{ color: '#596054', fontStyle: 'italic' }}>{offer.subtitle}</div>
                <div className="space-y-1.5 mb-4">
                  {offer.inclusions.slice(0, 3).map(inc => (
                    <div key={inc} className="flex items-start gap-2 text-xs" style={{ color: '#596054' }}>
                      <CheckIcon size={11} style={{ color: '#A68A63', flexShrink: 0, marginTop: 2 }} />
                      {inc}
                    </div>
                  ))}
                  {offer.inclusions.length > 3 && (
                    <div className="text-xs" style={{ color: '#89917F' }}>+{offer.inclusions.length - 3} more inclusions</div>
                  )}
                </div>
                <div className="text-[9px] mb-4" style={{ color: '#89917F', fontStyle: 'italic' }}>{offer.terms}</div>
                <button
                  onClick={() => {
                    setBooking({ ...booking, selectedOffer: offer.id, step: 1 });
                    setBookingStep(1);
                    setStepDir('forward'); setStepKey(k => k + 1);
                    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                  }}
                  className="w-full py-3 text-[10px] tracking-[0.2em] uppercase flex items-center justify-center gap-2 focus:outline-none transition-all"
                  style={{ border: '1px solid rgb(23 23 21 / 0.2)', color: '#171715' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#171715'; (e.currentTarget as HTMLButtonElement).style.color = '#F4F0E8'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = '#171715'; }}
                >
                  Book This Offer <ArrowRightIcon size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Engine */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10 pb-8 lg:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Steps panel */}
          <div className="lg:col-span-2">
            <div className="text-[9px] tracking-[0.32em] uppercase mb-4 sm:mb-6" style={{ color: '#89917F' }}>Book Your Stay</div>

            {/* Applied offer banner */}
            {appliedOffer && (
              <div className="flex items-center justify-between gap-4 mb-5 px-4 py-3"
                style={{ background: 'rgb(166 138 99 / 0.1)', border: '1px solid rgb(166 138 99 / 0.3)' }}>
                <div>
                  <div style={{ fontSize: 9, letterSpacing: '0.24em', textTransform: 'uppercase', color: '#A68A63', marginBottom: 3 }}>
                    Offer applied · Save {appliedOffer.savings}
                  </div>
                  <div style={{ fontSize: 13, color: '#171715' }}>
                    <strong style={{ fontFamily: 'Playfair Display, serif', fontWeight: 500 }}>{appliedOffer.title}</strong>
                    <span style={{ color: '#89917F' }}> · minimum {appliedOffer.nights} nights</span>
                  </div>
                </div>
                <button onClick={() => setBooking({ ...booking, selectedOffer: '' })}
                  className="focus:outline-none flex-shrink-0" aria-label="Remove offer"
                  style={{ fontSize: 9.5, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#89917F', borderBottom: '1px solid rgb(23 23 21 / 0.2)', paddingBottom: 1 }}>
                  Remove
                </button>
              </div>
            )}

            {/* Mobile progress bar — replaces circles */}
            <div className="lg:hidden mb-5">
              <div className="flex items-center justify-between mb-2.5">
                <div style={{ fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#89917F' }}>
                  {STEPS[bookingStep - 1].label}
                </div>
                <div style={{ fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#A68A63' }}>
                  Step {bookingStep} of {STEPS.length}
                </div>
              </div>
              <div style={{ height: 2, background: 'rgb(23 23 21 / 0.1)', position: 'relative' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, background: '#171715', width: `${((bookingStep) / STEPS.length) * 100}%`, transition: 'width 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)' }} />
              </div>
            </div>

            {/* Desktop step indicator — circles */}
            <div className="hidden lg:flex items-center mb-8 overflow-x-auto pb-2">
              {STEPS.map((step, i) => (
                <div key={step.num} className="flex items-center flex-shrink-0">
                  <button
                    onClick={() => bookingStep > step.num && setBookingStep(step.num)}
                    className="flex flex-col items-center gap-1 focus:outline-none"
                    disabled={bookingStep < step.num}
                    aria-current={bookingStep === step.num ? 'step' : undefined}
                  >
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] transition-all"
                      style={{
                        backgroundColor: bookingStep > step.num ? '#171715' : bookingStep === step.num ? '#171715' : 'transparent',
                        border: `1px solid ${bookingStep >= step.num ? '#171715' : 'rgb(23 23 21 / 0.2)'}`,
                        color: bookingStep >= step.num ? '#F4F0E8' : '#89917F',
                      }}
                    >
                      {bookingStep > step.num ? <CheckIcon size={11} /> : step.num}
                    </div>
                    <div className="text-[9px] tracking-[0.15em] uppercase whitespace-nowrap" style={{ color: bookingStep >= step.num ? '#171715' : '#89917F' }}>
                      {step.label}
                    </div>
                  </button>
                  {i < STEPS.length - 1 && (
                    <div className="w-8 h-px mx-2 flex-shrink-0" style={{ backgroundColor: bookingStep > step.num ? '#171715' : 'rgb(23 23 21 / 0.15)' }} />
                  )}
                </div>
              ))}
            </div>

            {/* Step content — key forces remount, class drives directional animation */}
            <div
              key={stepKey}
              className={`p-5 sm:p-6 lg:p-8 pb-28 lg:pb-8 ${stepDir === 'forward' ? 'step-forward' : 'step-back'}`}
              style={{ backgroundColor: '#FFFFFF', border: '1px solid rgb(23 23 21 / 0.06)', overflow: 'hidden' }}
            >

              {/* Step 1: Destination */}
              {bookingStep === 1 && (
                <div>
                  <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, color: '#171715', marginBottom: 20 }}>
                    Where would you like to go?
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {destinations.map(d => (
                      <button
                        key={d.id}
                        onClick={() => setBooking({ ...booking, destination: d.id })}
                        className="flex items-start gap-4 p-4 text-left transition-all focus:outline-none"
                        style={{
                          border: `1px solid ${booking.destination === d.id ? '#171715' : 'rgb(23 23 21 / 0.12)'}`,
                          backgroundColor: booking.destination === d.id ? 'rgb(23 23 21 / 0.03)' : 'transparent',
                        }}
                      >
                        <div className="w-16 h-12 flex-shrink-0 overflow-hidden" style={{ backgroundColor: '#DED7CA' }}>
                          <img src={d.image} alt={d.name} className="w-full h-full object-cover" loading="lazy" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm" style={{ color: '#171715', fontFamily: 'Playfair Display, serif' }}>{d.name}</div>
                          <div className="text-[9px] tracking-[0.18em] uppercase" style={{ color: '#89917F' }}>{d.country} · {d.stayCount} stays</div>
                        </div>
                        {booking.destination === d.id && (
                          <CheckIcon size={14} style={{ color: '#A68A63', flexShrink: 0 }} />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Dates */}
              {bookingStep === 2 && (
                <div>
                  <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, color: '#171715', marginBottom: 20 }}>
                    When would you like to stay?
                  </div>
                  <CalendarPicker
                    checkIn={booking.checkIn}
                    checkOut={booking.checkOut}
                    onChange={(ci, co) => setBooking({ ...booking, checkIn: ci, checkOut: co })}
                  />
                </div>
              )}

              {/* Step 3: Guests */}
              {bookingStep === 3 && (
                <div>
                  <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, color: '#171715', marginBottom: 20 }}>
                    Who is joining you?
                  </div>
                  <div className="space-y-4">
                    {(['adults', 'children', 'rooms'] as const).map(field => {
                      const labels = { adults: 'Adults', children: 'Children', rooms: 'Rooms' };
                      const descs = { adults: 'Age 13+', children: 'Age 0–12', rooms: 'Number of rooms' };
                      return (
                        <div key={field} className="flex items-center justify-between py-4" style={{ borderBottom: '1px solid rgb(23 23 21 / 0.06)' }}>
                          <div>
                            <div className="text-sm" style={{ color: '#171715' }}>{labels[field]}</div>
                            <div className="text-[9px] tracking-[0.15em] uppercase" style={{ color: '#89917F' }}>{descs[field]}</div>
                          </div>
                          <div className="flex items-center gap-4">
                            <button onClick={() => adj(field, -1)}
                              className="counter-btn focus:outline-none"
                              aria-label={`Decrease ${labels[field]}`}>
                              <MinusIcon size={14} />
                            </button>
                            <span className="w-8 text-center" style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, color: '#171715' }}>
                              {booking[field]}
                            </span>
                            <button onClick={() => adj(field, 1)}
                              className="counter-btn focus:outline-none"
                              aria-label={`Increase ${labels[field]}`}>
                              <PlusIcon size={14} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 4: Room */}
              {bookingStep === 4 && (
                <div>
                  <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, color: '#171715', marginBottom: 20 }}>
                    Choose your room.
                  </div>
                  <div className="space-y-3">
                    {(properties.find(p => p.destination === destinations.find(d => d.id === booking.destination)?.name) || properties[0]).rooms.map(room => (
                      <button
                        key={room.id}
                        onClick={() => setBooking({ ...booking, selectedRoom: room.id })}
                        className="w-full flex items-start gap-4 p-4 text-left transition-all focus:outline-none"
                        style={{
                          border: `1px solid ${booking.selectedRoom === room.id ? '#171715' : 'rgb(23 23 21 / 0.12)'}`,
                          backgroundColor: booking.selectedRoom === room.id ? 'rgb(23 23 21 / 0.03)' : 'transparent',
                        }}
                      >
                        <div className="w-20 h-16 flex-shrink-0 overflow-hidden" style={{ backgroundColor: '#DED7CA' }}>
                          <img src={room.image} alt={room.name} className="w-full h-full object-cover" loading="lazy" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm" style={{ color: '#171715', fontFamily: 'Playfair Display, serif' }}>{room.name}</div>
                          <div className="text-[9px] tracking-[0.18em] uppercase" style={{ color: '#89917F' }}>{room.category} · {room.size}m² · {room.view} view</div>
                          <div className="text-sm mt-1" style={{ color: '#171715' }}>{fmt(room.pricePerNight)} / night</div>
                        </div>
                        {booking.selectedRoom === room.id && <CheckIcon size={14} style={{ color: '#A68A63', flexShrink: 0 }} />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 5: Extras */}
              {bookingStep === 5 && (
                <div>
                  <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, color: '#171715', marginBottom: 20 }}>
                    Enhance your stay.
                  </div>
                  <div className="space-y-2">
                    {experiences.slice(0, 5).map(exp => {
                      const isSelected = booking.experiences.includes(exp.id);
                      return (
                        <button
                          key={exp.id}
                          onClick={() => {
                            setBooking({
                              ...booking,
                              experiences: isSelected ? booking.experiences.filter(x => x !== exp.id) : [...booking.experiences, exp.id],
                            });
                          }}
                          className="w-full flex items-center justify-between p-4 text-left transition-all focus:outline-none"
                          style={{
                            border: `1px solid ${isSelected ? '#A68A63' : 'rgb(23 23 21 / 0.1)'}`,
                            backgroundColor: isSelected ? 'rgb(166 138 99 / 0.05)' : 'transparent',
                          }}
                        >
                          <div>
                            <div className="text-sm" style={{ color: '#171715' }}>{exp.name}</div>
                            <div className="text-[9px] uppercase tracking-[0.15em]" style={{ color: '#89917F' }}>{exp.duration} · {fmt(exp.price)}</div>
                          </div>
                          <div className="w-5 h-5 flex items-center justify-center"
                            style={{ border: `1px solid ${isSelected ? '#A68A63' : 'rgb(23 23 21 / 0.2)'}`, backgroundColor: isSelected ? '#A68A63' : 'transparent' }}>
                            {isSelected && <CheckIcon size={11} style={{ color: '#F4F0E8' }} strokeWidth={2.5} />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 6: Review */}
              {bookingStep === 6 && (
                <div>
                  <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, color: '#171715', marginBottom: 20 }}>
                    Review your reservation.
                  </div>
                  {[
                    { label: 'Destination', value: destinations.find(d => d.id === booking.destination)?.name || '—' },
                    { label: 'Check-in', value: booking.checkIn || '—' },
                    { label: 'Check-out', value: booking.checkOut || '—' },
                    { label: 'Guests', value: `${booking.adults} adults${booking.children ? `, ${booking.children} children` : ''}` },
                    { label: 'Room', value: selectedRoomData?.name || '—' },
                    { label: 'Experiences', value: selectedExps.length > 0 ? selectedExps.map(e => e.name).join(', ') : 'None selected' },
                  ].map(row => (
                    <div key={row.label} className="flex justify-between py-3" style={{ borderBottom: '1px solid rgb(23 23 21 / 0.06)' }}>
                      <span className="text-[9px] tracking-[0.2em] uppercase" style={{ color: '#89917F' }}>{row.label}</span>
                      <span className="text-sm text-right max-w-[60%]" style={{ color: '#171715' }}>{row.value}</span>
                    </div>
                  ))}
                  <div className="mt-4 p-4" style={{ backgroundColor: 'rgb(23 23 21 / 0.03)' }}>
                    <div className="text-[9px] tracking-[0.2em] uppercase mb-3" style={{ color: '#89917F' }}>Price Summary</div>
                    {[
                      { label: `Room (${nights || 1} night${nights !== 1 ? 's' : ''})`, val: fmt(roomTotal) },
                      { label: 'Experiences', val: fmt(expTotal) },
                      { label: 'Taxes & fees (12%)', val: fmt(taxes) },
                      ...(discount > 0 ? [{ label: `${appliedOffer!.title} (−${appliedOffer!.savings})`, val: `− ${fmt(discount)}` }] : []),
                    ].map(row => (
                      <div key={row.label} className="flex justify-between py-1.5 text-sm" style={{ color: discount > 0 && row.val.startsWith('−') ? '#A68A63' : '#596054' }}>
                        <span>{row.label}</span>
                        <span>{row.val}</span>
                      </div>
                    ))}
                    <div className="flex justify-between pt-3 mt-2" style={{ borderTop: '1px solid rgb(23 23 21 / 0.1)' }}>
                      <span className="text-sm font-medium" style={{ color: '#171715' }}>Total</span>
                      <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 18, color: '#171715' }}>{fmt(grandTotal)}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 7: Guest details & Payment */}
              {bookingStep === 7 && (
                <div>
                  <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, color: '#171715', marginBottom: 6 }}>
                    Guest details &amp; payment.
                  </div>
                  <p className="text-xs mb-6" style={{ color: '#89917F' }}>
                    Amount due today <strong style={{ color: '#171715' }}>{fmt(grandTotal)}</strong>. Secured with 256-bit encryption.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <label className="block">
                      <span className="text-[9px] tracking-[0.2em] uppercase" style={{ color: '#89917F' }}>Full name</span>
                      <input value={guest.name} onChange={e => setGuest({ ...guest, name: e.target.value })}
                        placeholder="Jane Doe" autoComplete="name"
                        className="w-full mt-1.5 bg-transparent focus:outline-none" style={{ fontSize: 15, color: '#171715', borderBottom: '1px solid rgb(23 23 21 / 0.18)', paddingBottom: 8 }} />
                    </label>
                    <label className="block">
                      <span className="text-[9px] tracking-[0.2em] uppercase" style={{ color: '#89917F' }}>Email</span>
                      <input value={guest.email} onChange={e => setGuest({ ...guest, email: e.target.value })}
                        placeholder="jane@email.com" type="email" autoComplete="email"
                        className="w-full mt-1.5 bg-transparent focus:outline-none" style={{ fontSize: 15, color: '#171715', borderBottom: '1px solid rgb(23 23 21 / 0.18)', paddingBottom: 8 }} />
                    </label>
                  </div>

                  <label className="block mb-4">
                    <span className="text-[9px] tracking-[0.2em] uppercase" style={{ color: '#89917F' }}>Card number</span>
                    <input value={guest.card}
                      onChange={e => { const v = e.target.value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim(); setGuest({ ...guest, card: v }); }}
                      placeholder="4242 4242 4242 4242" inputMode="numeric" autoComplete="cc-number"
                      className="w-full mt-1.5 bg-transparent focus:outline-none" style={{ fontSize: 15, color: '#171715', borderBottom: '1px solid rgb(23 23 21 / 0.18)', paddingBottom: 8, letterSpacing: '0.08em' }} />
                  </label>

                  <div className="grid grid-cols-2 gap-4 mb-5">
                    <label className="block">
                      <span className="text-[9px] tracking-[0.2em] uppercase" style={{ color: '#89917F' }}>Expiry (MM/YY)</span>
                      <input value={guest.expiry}
                        onChange={e => { let v = e.target.value.replace(/\D/g, '').slice(0, 4); if (v.length > 2) v = v.slice(0, 2) + '/' + v.slice(2); setGuest({ ...guest, expiry: v }); }}
                        placeholder="09/28" inputMode="numeric" autoComplete="cc-exp"
                        className="w-full mt-1.5 bg-transparent focus:outline-none" style={{ fontSize: 15, color: '#171715', borderBottom: '1px solid rgb(23 23 21 / 0.18)', paddingBottom: 8 }} />
                    </label>
                    <label className="block">
                      <span className="text-[9px] tracking-[0.2em] uppercase" style={{ color: '#89917F' }}>CVC</span>
                      <input value={guest.cvc}
                        onChange={e => setGuest({ ...guest, cvc: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                        placeholder="123" inputMode="numeric" autoComplete="cc-csc"
                        className="w-full mt-1.5 bg-transparent focus:outline-none" style={{ fontSize: 15, color: '#171715', borderBottom: '1px solid rgb(23 23 21 / 0.18)', paddingBottom: 8 }} />
                    </label>
                  </div>

                  <div className="flex items-start gap-2 p-3" style={{ background: 'rgb(166 138 99 / 0.08)', border: '1px solid rgb(166 138 99 / 0.2)' }}>
                    <span style={{ fontSize: 13 }}>🔒</span>
                    <span className="text-[11px] leading-relaxed" style={{ color: '#596054' }}>
                      This is a demonstration checkout for a fictional resort — <strong>no real payment is taken and no card details are stored or sent.</strong>
                    </span>
                  </div>
                </div>
              )}

              {/* Error — icon + high-contrast message (Nielsen #9) */}
              {error && (
                <div className="mt-4 py-3 px-4 flex items-start gap-2.5" style={{ backgroundColor: 'rgb(166 88 63 / 0.08)', color: '#7A3320', border: '1px solid rgb(166 88 63 / 0.22)' }} role="alert" aria-live="assertive">
                  <span style={{ fontSize: 14, lineHeight: 1, marginTop: 1, flexShrink: 0 }}>⚠</span>
                  <span className="text-xs leading-relaxed">{error}</span>
                </div>
              )}

              {/* Desktop navigation — hidden on mobile */}
              <div className="hidden lg:flex gap-3 mt-6">
                {bookingStep > 1 && (
                  <button onClick={goPrev}
                    className="flex items-center gap-2 px-5 py-3 text-[10px] tracking-[0.22em] uppercase focus:outline-none"
                    style={{ border: '1px solid rgb(23 23 21 / 0.2)', color: '#171715' }}>
                    <ArrowLeftIcon size={12} /> Back
                  </button>
                )}
                <button
                  onClick={goNext}
                  className="flex-1 py-3.5 text-[10px] tracking-[0.25em] uppercase flex items-center justify-center gap-2 transition-all focus:outline-none"
                  style={{ backgroundColor: '#171715', color: '#F4F0E8' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#596054'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#171715'; }}
                >
                  {bookingStep === 7
                    ? 'Confirm & Pay'
                    : `Continue — ${STEPS[bookingStep - 1].next}`}
                  <ArrowRightIcon size={13} />
                </button>
              </div>
            </div>
          </div>

          {/* Price summary sidebar */}
          <div className="hidden lg:block">
            <div className="sticky top-32" style={{ backgroundColor: '#FFFFFF', border: '1px solid rgb(23 23 21 / 0.06)' }}>
              <div className="p-6 border-b" style={{ borderColor: 'rgb(23 23 21 / 0.06)' }}>
                {/* Step progress visibility (Nielsen #1) */}
                <div className="flex items-center justify-between mb-4">
                  <div className="text-[9px] tracking-[0.28em] uppercase" style={{ color: '#89917F' }}>Your Stay</div>
                  <div className="text-[9px] tracking-[0.18em] uppercase" style={{ color: '#A68A63' }}>Step {bookingStep} of {STEPS.length}</div>
                </div>
                <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 18, color: '#171715' }}>
                  {booking.destination ? destinations.find(d => d.id === booking.destination)?.name : 'Select destination'}
                </div>
              </div>
              <div className="p-6 space-y-3">
                {[
                  { icon: <CalendarIcon size={13} />, label: 'Dates', val: booking.checkIn && booking.checkOut ? `${booking.checkIn} – ${booking.checkOut}` : 'Not selected' },
                  { icon: <GuestsIcon size={13} />, label: 'Guests', val: `${booking.adults} adults` },
                  { icon: <LocationIcon size={13} />, label: 'Room', val: selectedRoomData?.name || 'Not selected' },
                ].map(row => (
                  <div key={row.label} className="flex items-start gap-2.5">
                    <span style={{ color: '#89917F', marginTop: 1, flexShrink: 0 }}>{row.icon}</span>
                    <div>
                      <div className="text-[9px] tracking-[0.18em] uppercase" style={{ color: '#89917F' }}>{row.label}</div>
                      <div className="text-xs" style={{ color: '#171715' }}>{row.val}</div>
                    </div>
                  </div>
                ))}
              </div>
              {roomTotal > 0 && (
                <div className="px-6 pb-6">
                  <div className="pt-4" style={{ borderTop: '1px solid rgb(23 23 21 / 0.08)' }}>
                    {[
                      { label: 'Room', val: fmt(roomTotal) },
                      { label: 'Experiences', val: fmt(expTotal) },
                      { label: 'Taxes', val: fmt(taxes) },
                      ...(discount > 0 ? [{ label: `Offer −${appliedOffer!.savings}`, val: `− ${fmt(discount)}` }] : []),
                    ].map(r => (
                      <div key={r.label} className="flex justify-between py-1.5 text-xs" style={{ color: r.val.startsWith('−') ? '#A68A63' : '#596054' }}>
                        <span>{r.label}</span><span>{r.val}</span>
                      </div>
                    ))}
                    <div className="flex justify-between pt-3 mt-1" style={{ borderTop: '1px solid rgb(23 23 21 / 0.08)' }}>
                      <span className="text-xs font-medium" style={{ color: '#171715' }}>Total</span>
                      <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 16, color: '#171715' }}>{fmt(grandTotal)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile fixed bottom navigation */}
      <div className="fixed bottom-0 inset-x-0 z-30 lg:hidden pb-safe" style={{ background: '#F4F0E8', borderTop: '1px solid rgb(23 23 21 / 0.09)' }}>
        <div className="flex gap-2 px-4 pt-3 pb-1">
          {bookingStep > 1 ? (
            <button
              onClick={goPrev}
              className="flex items-center justify-center flex-shrink-0 focus:outline-none"
              style={{ border: '1px solid rgb(23 23 21 / 0.22)', color: '#171715', width: 52, height: 52 }}
              aria-label="Back"
            >
              <ArrowLeftIcon size={16} />
            </button>
          ) : <div style={{ width: 52 }} />}
          <button
            onClick={goNext}
            className="flex-1 flex items-center justify-center gap-2 focus:outline-none"
            style={{ background: '#171715', color: '#F4F0E8', height: 52, fontSize: 10, letterSpacing: '0.24em', textTransform: 'uppercase' }}
          >
            {bookingStep === 7 ? 'Confirm & Pay' : `Continue — ${STEPS[bookingStep - 1].next}`}
            <ArrowRightIcon size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}
