'use client';

import { useState } from 'react';

export default function EnvelopeLetter({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="pixel-card glow-sparkle mx-auto max-w-2xl rounded-3xl bg-gradient-to-b from-white to-rose-50 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <button
          className="btn-cute bg-[#fbd2e7] text-violet-700"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? 'Close letter' : 'Open seal 💌'}
        </button>
        <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-600 shadow-sm">
          sealed with a kiss 💌
        </span>
      </div>

      <div className="relative overflow-hidden rounded-2xl bg-sky/30 p-1">
        {!open && <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#f8d3e7] via-transparent to-transparent" />}
        <div
          className={`origin-top rounded-2xl bg-white/80 p-5 transition-all duration-700 ${
            open ? 'max-h-[560px] scale-100 opacity-100' : 'max-h-0 scale-y-90 opacity-0'
          }`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
