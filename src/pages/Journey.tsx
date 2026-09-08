import type { Page, BookingState } from '../types';
import { destinations, experiences } from '../data';
import { useCurrency } from '../context/Currency';
import { ArrowRightIcon, CheckIcon, PlusIcon } from '../components/Icons';

interface JourneyProps {
  onNavigate: (page: Page) => void;
  booking: BookingState;
}

const TIMELINE = [
  { key: 'arrival', label: 'Arrival', icon: '✈', desc: 'Private transfer from the airport. A welcome ritual and refreshments on arrival.' },
  { key: 'room', label: 'Room', icon: '◻', desc: null },
  { key: 'dining', label: 'Dining', icon: '◇', desc: 'Breakfast served in room or on your terrace. Table reserved at Terrazza for dinner.' },
  { key: 'wellness', label: 'Wellness', icon: '○', desc: 'Ocean Ritual Spa — 10:00 AM. Morning yoga — 07:30 AM.' },
  { key: 'experience', label: 'Experience', icon: '△', desc: null },
  { key: 'departure', label: 'Departure', icon: '→', desc: 'Late checkout until 14:00. Private transfer arranged.' },
];

export default function Journey({ onNavigate, booking }: JourneyProps) {
  const { fmt } = useCurrency();
  const dest = destinations.find(d => d.id === booking.destination);
  const selectedExps = experiences.filter(e => booking.experiences.includes(e.id));

  if (!booking.confirmed) {
    return (
      <div className="page-fade min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F4F0E8' }}>
        <div className="text-center max-w-md px-6">
          <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 32, color: '#171715', fontWeight: 400 }}>
            No reservation yet.
          </div>
          <p className="mt-3 text-sm" style={{ color: '#596054' }}>
            Complete a reservation to view your personal journey.
          </p>
          <button onClick={() => onNavigate('offers')}
            className="mt-8 px-8 py-4 text-xs tracking-[0.22em] uppercase flex items-center gap-2 mx-auto focus:outline-none"
            style={{ backgroundColor: '#171715', color: '#F4F0E8' }}>
            Reserve Now <ArrowRightIcon size={13} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-fade min-h-screen" style={{ backgroundColor: '#F4F0E8' }}>
      {/* Confirmation Banner */}
      <div className="pt-20 lg:pt-24" style={{ backgroundColor: '#171715' }}>
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-12 lg:py-16">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div>
              <div className="text-[9px] tracking-[0.32em] uppercase mb-3" style={{ color: 'rgb(216 200 168 / 0.5)' }}>
                Confirmation · {booking.confirmationNumber}
              </div>
              <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(28px, 5vw, 52px)', color: '#F4F0E8', fontWeight: 400 }}>
                Your journey<br /><em>is reserved.</em>
              </h1>
              <p className="mt-4 text-sm max-w-sm" style={{ color: 'rgb(244 240 232 / 0.5)', lineHeight: 1.8, fontWeight: 300 }}>
                We are preparing everything for your arrival. A detailed itinerary has been sent to your email.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {[
                { label: 'Destination', val: dest?.name || '—' },
                { label: 'Check-in', val: booking.checkIn || '—' },
                { label: 'Check-out', val: booking.checkOut || '—' },
                { label: 'Total', val: fmt(booking.totalPrice) },
              ].map(item => (
                <div key={item.label}>
                  <div className="text-[9px] tracking-[0.22em] uppercase mb-1" style={{ color: 'rgb(244 240 232 / 0.35)' }}>{item.label}</div>
                  <div style={{ color: '#F4F0E8', fontFamily: 'Playfair Display, serif', fontSize: 16 }}>{item.val}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Journey header */}
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 pt-12">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
          <div>
            <div className="text-[9px] tracking-[0.32em] uppercase mb-1" style={{ color: '#89917F' }}>My VÉLORA Journey</div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(24px, 4vw, 40px)', color: '#171715', fontWeight: 400 }}>
              {dest?.name || 'Your Stay'}
            </h2>
          </div>
          <div className="flex gap-3">
            <button className="px-5 py-2.5 text-[10px] tracking-[0.2em] uppercase focus:outline-none"
              style={{ border: '1px solid rgb(23 23 21 / 0.2)', color: '#171715' }}>
              Contact Concierge
            </button>
            <button className="px-5 py-2.5 text-[10px] tracking-[0.2em] uppercase focus:outline-none"
              style={{ backgroundColor: '#171715', color: '#F4F0E8' }}>
              View Reservation
            </button>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 pb-16 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Timeline column */}
          <div className="lg:col-span-2">
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-3.5 top-0 bottom-0 w-px" style={{ backgroundColor: 'rgb(23 23 21 / 0.1)' }} />

              <div className="space-y-0">
                {TIMELINE.map((item, i) => (
                  <div key={item.key} className="relative pl-10 pb-8">
                    {/* Node */}
                    <div
                      className="absolute left-0 w-7 h-7 flex items-center justify-center text-xs"
                      style={{
                        backgroundColor: i < 2 ? '#171715' : '#F4F0E8',
                        border: '1px solid',
                        borderColor: i < 2 ? '#171715' : 'rgb(23 23 21 / 0.15)',
                        color: i < 2 ? '#F4F0E8' : '#89917F',
                        top: 0,
                      }}
                    >
                      {i < 2 ? <CheckIcon size={12} /> : item.icon}
                    </div>

                    <div className="pt-0.5">
                      <div className="text-[9px] tracking-[0.25em] uppercase mb-1" style={{ color: '#89917F' }}>{item.label}</div>

                      {item.key === 'room' ? (
                        <div>
                          <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 16, color: '#171715' }}>
                            {booking.selectedRoom ? (
                              <>Grand Terrace Suite</>
                            ) : 'No room selected'}
                          </div>
                          {dest && (
                            <div className="text-xs mt-0.5" style={{ color: '#596054' }}>{dest.name} · {booking.adults} guests</div>
                          )}
                        </div>
                      ) : item.key === 'experience' ? (
                        <div>
                          {selectedExps.length > 0 ? (
                            <>
                              {selectedExps.map(exp => (
                                <div key={exp.id} className="text-sm mb-1" style={{ color: '#171715', fontFamily: 'Playfair Display, serif' }}>
                                  {exp.name}
                                </div>
                              ))}
                            </>
                          ) : (
                            <button onClick={() => onNavigate('experiences')}
                              className="flex items-center gap-2 text-xs focus:outline-none"
                              style={{ color: '#A68A63' }}>
                              <PlusIcon size={12} /> Add an experience
                            </button>
                          )}
                        </div>
                      ) : (
                        <div className="text-sm" style={{ color: '#596054', lineHeight: 1.7 }}>
                          {item.desc}
                        </div>
                      )}

                      {/* Add button for certain items */}
                      {(item.key === 'dining' || item.key === 'wellness') && (
                        <button className="mt-2 flex items-center gap-1.5 text-[10px] tracking-[0.18em] uppercase focus:outline-none"
                          style={{ color: '#89917F' }}>
                          <PlusIcon size={10} /> Modify
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div className="sticky top-24 space-y-4">
              {/* Destination card */}
              {dest && (
                <div className="overflow-hidden" style={{ backgroundColor: '#FFFFFF', border: '1px solid rgb(23 23 21 / 0.06)' }}>
                  <div style={{ height: 160, backgroundColor: '#DED7CA' }}>
                    <img src={dest.image} alt={dest.name} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <div className="p-5">
                    <div className="text-[9px] tracking-[0.22em] uppercase mb-1" style={{ color: '#89917F' }}>{dest.country}</div>
                    <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 18, color: '#171715' }}>{dest.name}</div>
                    <div className="text-xs mt-2" style={{ color: '#596054', fontStyle: 'italic' }}>{dest.signature}</div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="p-5 space-y-3" style={{ backgroundColor: '#FFFFFF', border: '1px solid rgb(23 23 21 / 0.06)' }}>
                <div className="text-[9px] tracking-[0.25em] uppercase mb-4" style={{ color: '#89917F' }}>Add to your stay</div>
                {[
                  { label: 'Dining reservation', page: 'experiences' as Page },
                  { label: 'Spa treatment', page: 'experiences' as Page },
                  { label: 'Private experience', page: 'experiences' as Page },
                ].map(item => (
                  <button
                    key={item.label}
                    onClick={() => onNavigate(item.page)}
                    className="w-full flex items-center justify-between py-3 text-sm focus:outline-none group"
                    style={{ borderBottom: '1px solid rgb(23 23 21 / 0.06)' }}
                  >
                    <span style={{ color: '#171715' }}>{item.label}</span>
                    <ArrowRightIcon size={13} style={{ color: '#89917F' }} className="transition-transform group-hover:translate-x-1" />
                  </button>
                ))}
              </div>

              {/* Confirmation summary */}
              <div className="p-5" style={{ backgroundColor: '#171715' }}>
                <div className="text-[9px] tracking-[0.22em] uppercase mb-3" style={{ color: 'rgb(244 240 232 / 0.4)' }}>Confirmation</div>
                <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, color: '#F4F0E8' }}>
                  {booking.confirmationNumber}
                </div>
                <div className="mt-4 text-xs leading-relaxed" style={{ color: 'rgb(244 240 232 / 0.45)', fontWeight: 300 }}>
                  Your reservation is confirmed. A full itinerary has been sent to your email. Our concierge team is available 24 hours.
                </div>
                <button className="mt-5 w-full py-3 text-[10px] tracking-[0.22em] uppercase focus:outline-none"
                  style={{ border: '1px solid rgb(244 240 232 / 0.2)', color: 'rgb(244 240 232 / 0.6)' }}>
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
