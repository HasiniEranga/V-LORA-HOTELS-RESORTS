import { useEffect, useRef } from 'react';
import { CloseIcon } from './Icons';

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  /** "full" snaps sheet to 92dvh; "auto" fits content up to 85dvh */
  size?: 'auto' | 'full';
}

const DISMISS_THRESHOLD = 110; // px downward drag to close

export default function BottomSheet({ open, onClose, title, children, size = 'auto' }: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const startY   = useRef(0);
  const dragY    = useRef(0);

  /* Body scroll lock */
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  /* Keyboard dismiss */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  /* Swipe-to-dismiss — only trigger on the handle area drag */
  const onTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
    dragY.current  = 0;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    const delta = Math.max(0, e.touches[0].clientY - startY.current);
    dragY.current = delta;
    if (sheetRef.current) {
      sheetRef.current.style.transition = 'none';
      sheetRef.current.style.transform  = `translateY(${delta}px)`;
    }
  };
  const onTouchEnd = () => {
    if (dragY.current > DISMISS_THRESHOLD) {
      onClose();
    } else if (sheetRef.current) {
      sheetRef.current.style.transition = '';
      sheetRef.current.style.transform  = '';
    }
    dragY.current = 0;
  };

  const maxH = size === 'full' ? '92dvh' : '85dvh';

  return (
    <div
      className="fixed inset-0 z-50 flex items-end"
      style={{
        background:     open ? 'rgb(22 21 14 / 0.55)' : 'transparent',
        backdropFilter: open ? 'blur(4px)'            : 'none',
        pointerEvents:  open ? 'all'                  : 'none',
        transition:     'background 0.35s ease, backdrop-filter 0.35s ease',
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      aria-hidden={!open}
    >
      <div
        ref={sheetRef}
        className="w-full"
        style={{
          background:  '#F4F0E8',
          maxHeight:   maxH,
          display:     'flex',
          flexDirection: 'column',
          transform:   open ? 'translateY(0)' : 'translateY(100%)',
          transition:  'transform 0.44s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        }}
      >
        {/* Drag handle — full-width touch target */}
        <div
          className="flex-shrink-0 flex justify-center items-center"
          style={{ height: 36, cursor: 'grab', touchAction: 'none' }}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          aria-hidden="true"
        >
          <div style={{ width: 40, height: 4, background: 'rgb(23 23 21 / 0.14)', borderRadius: 2 }} />
        </div>

        {/* Header */}
        {title && (
          <div
            className="flex-shrink-0 flex items-center justify-between px-5 pb-4"
            style={{ borderBottom: '1px solid rgb(23 23 21 / 0.07)' }}
          >
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, color: '#171715', fontWeight: 400, lineHeight: 1.2 }}>
              {title}
            </div>
            <button
              onClick={onClose}
              className="focus:outline-none"
              style={{ padding: 10, color: '#89917F', marginRight: -10 }}
              aria-label="Close"
            >
              <CloseIcon size={16} />
            </button>
          </div>
        )}

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto overscroll-contain" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
