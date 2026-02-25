'use client';

import { useEffect, useState } from 'react';
import { audio } from '@/lib/audio';

export default function EnvelopeLetter({ children }: { children: (open: boolean) => React.ReactNode }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    audio.paperSlide();
  }, [open]);

  const toggle = () => {
    const next = !open;
    setOpen(next);
    if (next) audio.envelopeOpen();
    else audio.envelopeClose();
  };

  return (
    <div className="pixel-card glow-sparkle mx-auto max-w-2xl rounded-3xl bg-gradient-to-b from-white to-rose-50 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <button className="btn-cute bg-[#fbd2e7] text-violet-700" onClick={toggle} aria-expanded={open} aria-label={open ? 'Seal letter' : 'Open letter'}>
          {open ? 'Seal letter' : 'Open seal 💌'}
        </button>
        <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-600 shadow-sm">sealed with a kiss 💌</span>
      </div>

      <div className="relative min-h-[260px] rounded-2xl bg-[#fde7f2] p-3">
        <div
          className={`letter-sheet relative z-10 mx-auto w-[95%] rounded-2xl border-2 border-violet-100 bg-white/90 p-5 shadow-[0_16px_30px_rgba(140,120,200,0.25)] transition-all duration-700 ${
            open ? 'is-open translate-y-0 scale-100 opacity-100' : 'translate-y-[95px] scale-95 opacity-60'
          }`}
        >
          {children(open)}
        </div>
      </div>
    </div>
  );
}
