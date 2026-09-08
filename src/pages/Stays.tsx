import { useState } from 'react';
import type { Page, Room, BookingState } from '../types';
import { properties } from '../data';
import { useCurrency } from '../context/Currency';
import { CloseIcon, ArrowRightIcon, BedIcon, OceanIcon, GuestsIcon, CompareIcon, CheckIcon, HeartIcon, PlusIcon, MinusIcon } from '../components/Icons';
import BottomSheet from '../components/BottomSheet';

interface StaysProps {
  onNavigate: (p: Page) => void;
  booking: BookingState;
  setBooking: (b: BookingState) => void;
}

export default function Stays({ onNavigate, booking, setBooking }: StaysProps) {
  const { fmt } = useCurrency();
  const [compareList,    setCompareList]    = useState<Room[]>([]);
  const [showCompare,    setShowCompare]    = useState(false);
  const [detailRoom,     setDetailRoom]     = useState<Room | null>(null);
  const [saved,          setSaved]          = useState<string[]>([]);
  const [activeProp,     setActiveProp]     = useState(properties[0]);
  const [loading,        setLoading]        = useState(false);
  const [searched,       setSearched]       = useState(false);
  const [error,          setError]          = useState('');
  const [searchSheet,    setSearchSheet]    = useState(false);  // mobile search sheet
  const [detailSheet,    setDetailSheet]    = useState(false);  // mobile detail sheet

  // Guest adjuster for mobile sheet
  const adjGuests = (delta: number) => setBooking({ ...booking, adults: Math.max(1, Math.min(8, booking.adults + delta)) });

  const rooms = activeProp.rooms;
  const nights = booking.checkIn && booking.checkOut
    ? Math.max(0, Math.floor((new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / 86400000))
    : 0;

  const toggleCompare = (r: Room) =>
    setCompareList(prev => prev.find(x => x.id === r.id) ? prev.filter(x => x.id !== r.id) : prev.length < 3 ? [...prev, r] : prev);

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!booking.checkIn || !booking.checkOut) { setError('Please select check-in and check-out dates.'); return; }
    if (booking.checkIn >= booking.checkOut) { setError('Check-out must be after check-in.'); return; }
    setError('');
    setLoading(true);
    setSearchSheet(false);
    setTimeout(() => { setLoading(false); setSearched(true); }, 1200);
  };

  const selectRoom = (room: Room) => {
    setBooking({ ...booking, selectedRoom: room.id, totalPrice: room.pricePerNight });
    onNavigate('offers');
  };

  const openDetail = (room: Room) => {
    setDetailRoom(room);
    // Mobile: bottom sheet; desktop: centered modal — both handled by same state
    setDetailSheet(true);
  };

  const Chip = ({ children }: { children: React.ReactNode }) => (
    <span style={{ fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', padding: '4px 10px', background: '#F4F0E8', color: '#596054', display: 'inline-block' }}>
      {children}
    </span>
  );

  const searchSummary = [
    booking.checkIn && booking.checkOut
      ? `${new Date(booking.checkIn).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} – ${new Date(booking.checkOut).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`
      : null,
    nights > 0 ? `${nights} night${nights > 1 ? 's' : ''}` : null,
    booking.adults ? `${booking.adults} guest${booking.adults > 1 ? 's' : ''}` : null,
  ].filter(Boolean).join(' · ');

  return (
    <div className="page-fade min-h-screen" style={{ background: '#F4F0E8' }}>

      {/* Page header */}
      <div className="pt-20 sm:pt-24 lg:pt-32 pb-6 sm:pb-10 lg:pb-14" style={{ background: '#F4F0E8' }}>
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="stagger-1" style={{ fontSize: 9, letterSpacing: '0.38em', textTransform: 'uppercase', color: '#89917F', marginBottom: 10 }}>Stays</div>
          <h1 className="stagger-2" style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(32px, 5.5vw, 68px)', color: '#171715', fontWeight: 400, lineHeight: 0.97 }}>
            Choose your<br /><em>way to stay.</em>
          </h1>
        </div>
      </div>

      {/* ── Property selector — horizontal chips, mobile + desktop ── */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-12 mb-4">
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {properties.map(p => (
            <button
              key={p.id}
              onClick={() => { setActiveProp(p); setSearched(false); }}
              className="flex-shrink-0 focus:outline-none transition-all duration-200"
              style={{
                padding: '9px 18px', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase',
                border: `1px solid ${activeProp.id === p.id ? '#171715' : 'rgb(23 23 21 / 0.14)'}`,
                background: activeProp.id === p.id ? '#171715' : 'transparent',
                color: activeProp.id === p.id ? '#F4F0E8' : '#89917F',
                minHeight: 40,
              }}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* ── Desktop sticky booking bar ── */}
      <div className="hidden lg:block sticky top-[76px] z-20 py-4" style={{ background: '#171715' }}>
        <div className="max-w-[1280px] mx-auto px-12">
          <form onSubmit={handleSearch} className="flex items-end gap-8">
            <div className="min-w-[120px] flex-1">
              <div style={{ fontSize: 8.5, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#596054', marginBottom: 6 }}>Check-in</div>
              <input type="date" value={booking.checkIn} onChange={e => setBooking({ ...booking, checkIn: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
                className="w-full bg-transparent focus:outline-none" style={{ fontSize: 14, color: '#F4F0E8', colorScheme: 'dark' }} />
            </div>
            <div className="min-w-[120px] flex-1">
              <div style={{ fontSize: 8.5, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#596054', marginBottom: 6 }}>Check-out</div>
              <input type="date" value={booking.checkOut} onChange={e => setBooking({ ...booking, checkOut: e.target.value })}
                min={booking.checkIn || new Date().toISOString().split('T')[0]}
                className="w-full bg-transparent focus:outline-none" style={{ fontSize: 14, color: '#F4F0E8', colorScheme: 'dark' }} />
            </div>
            <div className="min-w-[90px]">
              <div style={{ fontSize: 8.5, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#596054', marginBottom: 6 }}>Guests</div>
              <select value={booking.adults} onChange={e => setBooking({ ...booking, adults: Number(e.target.value) })}
                className="bg-transparent focus:outline-none" style={{ fontSize: 14, color: '#F4F0E8' }}>
                {[1,2,3,4,5,6].map(n => <option key={n} value={n} style={{ color: '#171715' }}>{n}</option>)}
              </select>
            </div>
            <button type="submit" disabled={loading}
              className="flex-shrink-0 focus:outline-none transition-all duration-200"
              style={{ background: '#A68A63', color: '#F4F0E8', padding: '11px 28px', fontSize: 10, letterSpacing: '0.24em', textTransform: 'uppercase', opacity: loading ? 0.7 : 1, minWidth: 140 }}>
              {loading ? 'Searching…' : 'Search Rooms'}
            </button>
          </form>
          {error && (
            <div className="mt-2 flex items-center gap-2" role="alert">
              <span style={{ color: '#D8C8A8', fontSize: 13 }}>⚠</span>
              <span style={{ fontSize: 11, color: '#D8C8A8', letterSpacing: '0.05em' }}>{error}</span>
            </div>
          )}
          {searched && !loading && (
            <div className="mt-1.5" style={{ fontSize: 10, color: '#596054', letterSpacing: '0.1em' }}>
              {rooms.length} rooms available{nights > 0 ? ` · ${nights} nights` : ''}
            </div>
          )}
        </div>
      </div>

      {/* ── Mobile search bar — compact tap target ── */}
      <div className="lg:hidden mx-4 sm:mx-6 mb-5">
        {searched ? (
          <button
            onClick={() => setSearchSheet(true)}
            className="w-full flex items-center justify-between focus:outline-none"
            style={{ background: '#171715', padding: '14px 18px' }}
          >
            <div>
              <div style={{ fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#596054', marginBottom: 3 }}>
                {rooms.length} rooms available
              </div>
              <div style={{ fontSize: 13, color: '#F4F0E8' }}>{searchSummary || activeProp.name}</div>
            </div>
            <div style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#A68A63' }}>
              Modify
            </div>
          </button>
        ) : (
          <button
            onClick={() => setSearchSheet(true)}
            className="w-full flex items-center justify-between focus:outline-none"
            style={{ border: '1px solid rgb(23 23 21 / 0.18)', padding: '16px 18px', minHeight: 56 }}
          >
            <div style={{ fontSize: 14, color: '#89917F', fontFamily: 'Playfair Display, serif', fontStyle: 'italic' }}>
              Select dates to find rooms
            </div>
            <div style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#171715' }}>
              Search
            </div>
          </button>
        )}
      </div>

      {/* ── Mobile search bottom sheet ── */}
      <BottomSheet open={searchSheet} onClose={() => setSearchSheet(false)} title="Find Your Room">
        <form onSubmit={handleSearch} className="px-5 pb-6 pt-4 flex flex-col gap-0">
          {/* Dates */}
          <div style={{ borderBottom: '1px solid rgb(23 23 21 / 0.08)' }}>
            <div className="py-4">
              <div style={{ fontSize: 9, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#89917F', marginBottom: 8 }}>Check-in</div>
              <input
                type="date"
                value={booking.checkIn}
                onChange={e => setBooking({ ...booking, checkIn: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
                className="w-full focus:outline-none bg-transparent"
                style={{ fontSize: 18, color: '#171715', height: 44 }}
              />
            </div>
          </div>
          <div style={{ borderBottom: '1px solid rgb(23 23 21 / 0.08)' }}>
            <div className="py-4">
              <div style={{ fontSize: 9, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#89917F', marginBottom: 8 }}>Check-out</div>
              <input
                type="date"
                value={booking.checkOut}
                onChange={e => setBooking({ ...booking, checkOut: e.target.value })}
                min={booking.checkIn || new Date().toISOString().split('T')[0]}
                className="w-full focus:outline-none bg-transparent"
                style={{ fontSize: 18, color: '#171715', height: 44 }}
              />
            </div>
          </div>

          {/* Guests */}
          <div className="py-5 flex items-center justify-between" style={{ borderBottom: '1px solid rgb(23 23 21 / 0.08)' }}>
            <div>
              <div style={{ fontSize: 14, color: '#171715' }}>Guests</div>
              <div style={{ fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#89917F', marginTop: 2 }}>Adults</div>
            </div>
            <div className="flex items-center gap-5">
              <button type="button" onClick={() => adjGuests(-1)} disabled={booking.adults <= 1}
                className="counter-btn focus:outline-none" aria-label="Decrease guests">
                <MinusIcon size={16} />
              </button>
              <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, color: '#171715', minWidth: 28, textAlign: 'center' }}>
                {booking.adults}
              </span>
              <button type="button" onClick={() => adjGuests(1)} disabled={booking.adults >= 8}
                className="counter-btn focus:outline-none" aria-label="Increase guests">
                <PlusIcon size={16} />
              </button>
            </div>
          </div>

          {error && (
            <div className="mt-3 flex items-center gap-2 py-3 px-3" style={{ background: 'rgb(166 88 63 / 0.08)', border: '1px solid rgb(166 88 63 / 0.2)' }} role="alert">
              <span style={{ fontSize: 14 }}>⚠</span>
              <span style={{ fontSize: 12, color: '#7A3320' }}>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full flex items-center justify-center gap-2 focus:outline-none"
            style={{ background: '#171715', color: '#F4F0E8', padding: '17px 0', fontSize: 10, letterSpacing: '0.26em', textTransform: 'uppercase', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Searching…' : 'Search Rooms'} {!loading && <ArrowRightIcon size={12} />}
          </button>
        </form>
      </BottomSheet>

      {/* ── Smart match banner ── */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-12 pb-5 sm:pb-6">
        <div className="flex items-center justify-between p-4 sm:p-5" style={{ background: 'rgb(166 138 99 / 0.07)', border: '1px solid rgb(166 138 99 / 0.18)' }}>
          <div className="flex-1 min-w-0 pr-4">
            <div style={{ fontSize: 9, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#A68A63', marginBottom: 4 }}>Smart Match · 96%</div>
            <div style={{ fontSize: 13, color: '#171715' }}>
              <strong style={{ fontFamily: 'Playfair Display, serif', fontWeight: 500 }}>Grand Terrace Suite</strong>
              <span className="hidden sm:inline" style={{ color: '#596054' }}> — Preferred for ocean views, privacy and outdoor space.</span>
            </div>
          </div>
          <button
            onClick={() => openDetail(rooms[0])}
            className="flex-shrink-0 focus:outline-none"
            style={{ border: '1px solid #A68A63', color: '#A68A63', padding: '9px 16px', fontSize: 9.5, letterSpacing: '0.22em', textTransform: 'uppercase', minHeight: 40 }}
          >
            View Room
          </button>
        </div>
      </div>

      {/* ── Compare bar ── */}
      {compareList.length > 0 && (
        <div className="fixed bottom-[52px] lg:bottom-0 inset-x-0 z-30 flex items-center justify-between px-4 sm:px-6 lg:px-12 py-3"
          style={{ background: '#171715', borderTop: '1px solid rgb(244 240 232 / 0.08)' }}>
          <div className="flex items-center gap-3 overflow-hidden">
            <span style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#89917F', flexShrink: 0 }}>
              {compareList.length}/3
            </span>
            <div className="flex gap-1.5 overflow-hidden">
              {compareList.map(r => (
                <div key={r.id} className="px-2 py-1 truncate" style={{ background: 'rgb(244 240 232 / 0.08)', fontSize: 10, color: '#F4F0E8', maxWidth: 100 }}>
                  {r.name}
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button onClick={() => setCompareList([])} className="focus:outline-none" style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#596054', padding: '8px 10px' }}>Clear</button>
            <button onClick={() => setShowCompare(true)} disabled={compareList.length < 2}
              className="focus:outline-none disabled:opacity-30"
              style={{ background: '#A68A63', color: '#F4F0E8', padding: '8px 14px', fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase' }}>
              Compare
            </button>
          </div>
        </div>
      )}

      {/* ── Room grid ── */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-12 pb-24 sm:pb-28 lg:pb-16 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {rooms.map((room, i) => (
          <div key={room.id}
            className="card-lift reveal"
            style={{ background: '#FFFFFF', border: '1px solid rgb(23 23 21 / 0.05)', transitionDelay: `${i * 0.12}s` }}>

            {/* Room image */}
            <div className="relative img-reveal img-zoom" style={{ height: 'clamp(200px, 52vw, 260px)', background: '#DED7CA' }}>
              <button onClick={() => openDetail(room)} className="block w-full h-full focus:outline-none" aria-label={`View ${room.name}`} style={{ display: 'block' }}>
                <img src={room.image} alt={room.name} className="w-full h-full object-cover" loading="lazy" />
              </button>
              {room.matchScore && room.matchScore >= 90 && (
                <div className="absolute top-3 left-3 px-2.5 py-1.5 pointer-events-none"
                  style={{ background: '#A68A63', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#F4F0E8' }}>
                  {room.matchScore}% match
                </div>
              )}
              <div className="absolute top-3 right-3 flex gap-1.5">
                <button
                  onClick={() => setSaved(p => p.includes(room.id) ? p.filter(x => x !== room.id) : [...p, room.id])}
                  className="focus:outline-none"
                  style={{ background: 'rgb(22 21 14 / 0.55)', color: saved.includes(room.id) ? '#A68A63' : '#F4F0E8', padding: 10 }}
                  aria-label={saved.includes(room.id) ? 'Unsave' : 'Save'}>
                  <HeartIcon size={14} />
                </button>
                <button
                  onClick={() => toggleCompare(room)}
                  className="focus:outline-none"
                  style={{ background: compareList.find(r => r.id === room.id) ? '#A68A63' : 'rgb(22 21 14 / 0.55)', color: '#F4F0E8', padding: 10 }}
                  aria-label="Compare">
                  <CompareIcon size={14} />
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-6">
              <div style={{ fontSize: 9, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#89917F', marginBottom: 4 }}>{room.category}</div>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 19, color: '#171715', fontWeight: 400, marginBottom: 12 }}>{room.name}</div>

              {/* Specs */}
              <div className="flex flex-wrap gap-2 sm:gap-3 mb-4 pb-4" style={{ borderBottom: '1px solid rgb(23 23 21 / 0.07)' }}>
                <div className="flex items-center gap-1.5" style={{ fontSize: 12, color: '#596054' }}><BedIcon size={12} style={{ color: '#89917F' }} /> {room.bed}</div>
                <div className="flex items-center gap-1.5" style={{ fontSize: 12, color: '#596054' }}><GuestsIcon size={12} style={{ color: '#89917F' }} /> {room.guests} guests</div>
                <div className="flex items-center gap-1.5" style={{ fontSize: 12, color: '#596054' }}><OceanIcon size={12} style={{ color: '#89917F' }} /> {room.view}</div>
              </div>

              {/* Inclusions */}
              <div className="flex flex-wrap gap-1.5 mb-5">
                {room.hasPool    && <Chip>Pool</Chip>}
                {room.hasButler  && <Chip>Butler</Chip>}
                {room.hasBreakfast && <Chip>Breakfast</Chip>}
                <Chip>{room.size}m²</Chip>
              </div>

              <div className="rule mb-4" />

              <div className="flex items-end justify-between mb-4">
                <div>
                  <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 21, color: '#171715' }}>{fmt(room.pricePerNight)}</div>
                  <div style={{ fontSize: 9.5, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#89917F' }}>
                    per night{nights > 0 && ` · ${fmt(room.pricePerNight * nights)} total`}
                  </div>
                </div>
                <button onClick={() => openDetail(room)} className="focus:outline-none hover-line"
                  style={{ fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#89917F', padding: '8px 0' }}>
                  Details
                </button>
              </div>

              {/* Primary CTA — full width, thumb-friendly height */}
              <button onClick={() => selectRoom(room)}
                className="w-full flex items-center justify-center gap-2 focus:outline-none transition-all duration-200"
                style={{ background: '#171715', color: '#F4F0E8', fontSize: 10, letterSpacing: '0.24em', textTransform: 'uppercase', minHeight: 50 }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#596054'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#171715'; }}>
                Reserve This Room <ArrowRightIcon size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ── Room detail — bottom sheet on mobile, modal on desktop ── */}
      {detailRoom && (
        <>
          {/* Mobile: bottom sheet */}
          <BottomSheet
            open={detailSheet}
            onClose={() => { setDetailSheet(false); setDetailRoom(null); }}
            size="full"
          >
            <div>
              <div className="relative" style={{ height: 240, background: '#DED7CA' }}>
                <img src={detailRoom.image} alt={detailRoom.name} className="w-full h-full object-cover" />
              </div>
              <div className="px-5 py-6">
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <div style={{ fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#89917F', marginBottom: 5 }}>{detailRoom.category} · {detailRoom.size}m²</div>
                    <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, color: '#171715', fontWeight: 400 }}>{detailRoom.name}</h2>
                  </div>
                  <div className="text-right">
                    <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, color: '#171715' }}>{fmt(detailRoom.pricePerNight)}</div>
                    <div style={{ fontSize: 9.5, color: '#89917F', letterSpacing: '0.15em', textTransform: 'uppercase' }}>/ night</div>
                  </div>
                </div>
                <p style={{ fontSize: 14, color: '#596054', lineHeight: 1.8, marginBottom: 20 }}>{detailRoom.description}</p>
                <div className="grid grid-cols-3 gap-3 mb-5">
                  {[['Bed', detailRoom.bed], ['View', detailRoom.view], ['Guests', `Up to ${detailRoom.guests}`]].map(([l, v]) => (
                    <div key={l}>
                      <div style={{ fontSize: 8.5, letterSpacing: '0.26em', textTransform: 'uppercase', color: '#89917F', marginBottom: 4 }}>{l}</div>
                      <div style={{ fontSize: 12, color: '#171715' }}>{v}</div>
                    </div>
                  ))}
                </div>
                <div className="rule mb-4" />
                <div style={{ fontSize: 8.5, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#89917F', marginBottom: 10 }}>Amenities</div>
                <div className="grid grid-cols-2 gap-y-2 gap-x-3 mb-6">
                  {detailRoom.amenities.map(a => (
                    <div key={a} className="flex items-center gap-2" style={{ fontSize: 12, color: '#596054' }}>
                      <CheckIcon size={10} style={{ color: '#A68A63', flexShrink: 0 }} />{a}
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => { selectRoom(detailRoom); setDetailSheet(false); setDetailRoom(null); }}
                  className="w-full flex items-center justify-center gap-2 focus:outline-none"
                  style={{ background: '#171715', color: '#F4F0E8', fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', minHeight: 54 }}>
                  Reserve This Room <ArrowRightIcon size={13} />
                </button>
              </div>
            </div>
          </BottomSheet>

          {/* Desktop: centered modal */}
          <div className="hidden lg:flex fixed inset-0 z-50 items-center justify-center"
            style={{ background: 'rgb(22 21 14 / 0.7)', backdropFilter: 'blur(6px)' }}
            onClick={e => { if (e.target === e.currentTarget) { setDetailRoom(null); setDetailSheet(false); } }}>
            <div className="relative w-full max-w-2xl mx-4 overflow-y-auto"
              style={{ background: '#F4F0E8', maxHeight: '90dvh', animation: 'revealUp 0.4s ease forwards' }}>
              <div className="relative img-zoom" style={{ height: 320, background: '#DED7CA' }}>
                <img src={detailRoom.image} alt={detailRoom.name} className="w-full h-full object-cover" />
                <button onClick={() => { setDetailRoom(null); setDetailSheet(false); }} className="absolute top-4 right-4 p-2 focus:outline-none"
                  style={{ background: 'rgb(22 21 14 / 0.6)', color: '#F4F0E8' }} aria-label="Close">
                  <CloseIcon size={15} />
                </button>
              </div>
              <div className="p-8 lg:p-10">
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <div style={{ fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#89917F', marginBottom: 6 }}>{detailRoom.category} · {detailRoom.size}m²</div>
                    <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 30, color: '#171715', fontWeight: 400 }}>{detailRoom.name}</h2>
                  </div>
                  <div className="text-right">
                    <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 26, color: '#171715' }}>{fmt(detailRoom.pricePerNight)}</div>
                    <div style={{ fontSize: 9.5, color: '#89917F', letterSpacing: '0.15em', textTransform: 'uppercase' }}>per night</div>
                  </div>
                </div>
                <p style={{ fontSize: 14, color: '#596054', lineHeight: 1.85, marginBottom: 22 }}>{detailRoom.description}</p>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {[['Bed', detailRoom.bed], ['View', detailRoom.view], ['Guests', `Up to ${detailRoom.guests}`]].map(([l, v]) => (
                    <div key={l}>
                      <div style={{ fontSize: 8.5, letterSpacing: '0.26em', textTransform: 'uppercase', color: '#89917F', marginBottom: 5 }}>{l}</div>
                      <div style={{ fontSize: 13, color: '#171715' }}>{v}</div>
                    </div>
                  ))}
                </div>
                <div className="rule mb-5" />
                <div style={{ fontSize: 8.5, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#89917F', marginBottom: 12 }}>Amenities</div>
                <div className="grid grid-cols-2 gap-2 mb-8">
                  {detailRoom.amenities.map(a => (
                    <div key={a} className="flex items-center gap-2" style={{ fontSize: 13, color: '#596054' }}>
                      <CheckIcon size={11} style={{ color: '#A68A63', flexShrink: 0 }} />{a}
                    </div>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button onClick={() => { setDetailRoom(null); setDetailSheet(false); }} className="flex-1 focus:outline-none"
                    style={{ border: '1px solid rgb(23 23 21 / 0.2)', color: '#171715', padding: '14px 0', fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase' }}>
                    Back
                  </button>
                  <button onClick={() => { selectRoom(detailRoom); setDetailRoom(null); setDetailSheet(false); }}
                    className="flex-1 flex items-center justify-center gap-2 focus:outline-none transition-all duration-200"
                    style={{ background: '#171715', color: '#F4F0E8', padding: '14px 0', fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#596054'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#171715'; }}>
                    Reserve This Room <ArrowRightIcon size={13} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── Compare modal ── */}
      {showCompare && compareList.length >= 2 && (
        <div className="fixed inset-0 z-50 flex items-end lg:items-center justify-center"
          style={{ background: 'rgb(22 21 14 / 0.7)', backdropFilter: 'blur(6px)' }}
          onClick={e => { if (e.target === e.currentTarget) setShowCompare(false); }}>
          <div className="relative w-full max-w-3xl mx-0 lg:mx-4 overflow-y-auto"
            style={{ background: '#F4F0E8', maxHeight: '90dvh', animation: 'slideUp 0.4s ease' }}>
            <div className="flex items-center justify-between px-5 sm:px-8 py-5" style={{ borderBottom: '1px solid rgb(23 23 21 / 0.07)' }}>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, color: '#171715', fontWeight: 400 }}>Compare Rooms</div>
              <button onClick={() => setShowCompare(false)} className="focus:outline-none p-2" aria-label="Close">
                <CloseIcon size={18} />
              </button>
            </div>
            <div className="p-4 sm:p-6 overflow-x-auto">
              <table className="w-full" style={{ minWidth: 380 }}>
                <thead>
                  <tr>
                    <td className="pb-5 pr-4" style={{ width: 100, fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#89917F' }}>Feature</td>
                    {compareList.map(r => (
                      <td key={r.id} className="pb-5 pr-4 text-center">
                        <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 14, color: '#171715' }}>{r.name}</div>
                        <div style={{ fontSize: 9, color: '#89917F', letterSpacing: '0.18em', textTransform: 'uppercase', marginTop: 2 }}>{r.category}</div>
                      </td>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { l: 'Size', f: (r: Room) => `${r.size}m²` },
                    { l: 'Guests', f: (r: Room) => `Up to ${r.guests}` },
                    { l: 'View', f: (r: Room) => r.view },
                    { l: 'Bed', f: (r: Room) => r.bed },
                    { l: 'Pool', f: (r: Room) => r.hasPool ? '✓' : '—' },
                    { l: 'Butler', f: (r: Room) => r.hasButler ? '✓' : '—' },
                    { l: 'Breakfast', f: (r: Room) => r.hasBreakfast ? '✓' : '—' },
                    { l: 'Price / night', f: (r: Room) => fmt(r.pricePerNight) },
                  ].map(row => (
                    <tr key={row.l} style={{ borderTop: '1px solid rgb(23 23 21 / 0.06)' }}>
                      <td className="py-3 pr-4" style={{ fontSize: 11, color: '#89917F' }}>{row.l}</td>
                      {compareList.map(r => (
                        <td key={r.id} className="py-3 pr-4 text-center" style={{ fontSize: 12, color: '#171715' }}>{row.f(r)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 sm:px-6 pb-6 flex gap-3">
              {compareList.map(r => (
                <button key={r.id} onClick={() => { selectRoom(r); setShowCompare(false); }} className="flex-1 focus:outline-none"
                  style={{ background: '#171715', color: '#F4F0E8', padding: '14px 0', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                  Select
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile sticky CTA */}
      <div className="fixed bottom-0 inset-x-0 z-30 lg:hidden pb-safe" style={{ background: '#F4F0E8', borderTop: '1px solid rgb(23 23 21 / 0.09)' }}>
        <button
          onClick={() => setSearchSheet(true)}
          className="w-full focus:outline-none flex items-center justify-center gap-2"
          style={{ background: '#171715', color: '#F4F0E8', fontSize: 10, letterSpacing: '0.26em', textTransform: 'uppercase', fontWeight: 500, height: 52 }}
        >
          {searched ? 'Modify Search' : 'Search Rooms'} <ArrowRightIcon size={12} />
        </button>
      </div>
    </div>
  );
}
