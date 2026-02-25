'use client';

import { useMemo, useRef, useState } from 'react';

type Props = {
  onLeft: (down: boolean) => void;
  onRight: (down: boolean) => void;
  onJump: () => void;
};

const DEAD_ZONE = 14;
const MAX_DRAG = 34;

export default function OnScreenControls({ onLeft, onRight, onJump }: Props) {
  const pointerIdRef = useRef<number | null>(null);
  const [knob, setKnob] = useState(0);

  const setDirection = (dx: number) => {
    const clamped = Math.max(-MAX_DRAG, Math.min(MAX_DRAG, dx));
    setKnob(clamped);
    onLeft(clamped < -DEAD_ZONE);
    onRight(clamped > DEAD_ZONE);
  };

  const resetStick = () => {
    pointerIdRef.current = null;
    setKnob(0);
    onLeft(false);
    onRight(false);
  };

  const knobStyle = useMemo(() => ({ transform: `translateX(${knob}px)` }), [knob]);

  return (
    <div className="mt-4 grid grid-cols-[1fr_auto] items-end gap-4 md:hidden" aria-label="Mobile game controls">
      <div className="rounded-3xl border-2 border-white/85 bg-violet-100/85 p-3 shadow-[0_10px_20px_rgba(122,93,191,0.2)]">
        <p className="mb-2 text-center text-[11px] font-semibold uppercase tracking-wide text-violet-700">Move</p>
        <button
          type="button"
          className="relative h-[78px] w-full touch-none rounded-full border-2 border-white/90 bg-gradient-to-b from-white to-violet-200/90"
          onPointerDown={(event) => {
            pointerIdRef.current = event.pointerId;
            event.currentTarget.setPointerCapture(event.pointerId);
            const rect = event.currentTarget.getBoundingClientRect();
            setDirection(event.clientX - (rect.left + rect.width / 2));
          }}
          onPointerMove={(event) => {
            if (pointerIdRef.current !== event.pointerId) return;
            const rect = event.currentTarget.getBoundingClientRect();
            setDirection(event.clientX - (rect.left + rect.width / 2));
          }}
          onPointerUp={resetStick}
          onPointerCancel={resetStick}
        >
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-violet-500">◀</span>
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-lg text-violet-500">▶</span>
          <span
            className="pointer-events-none absolute left-1/2 top-1/2 h-12 w-12 -translate-y-1/2 -translate-x-1/2 rounded-full border-2 border-white/90 bg-gradient-to-b from-fuchsia-200 to-violet-300 shadow-[0_6px_12px_rgba(122,93,191,0.35)]"
            style={knobStyle}
          />
        </button>
      </div>

      <button
        type="button"
        className="btn-cute h-[104px] w-[104px] rounded-full border-2 border-white/90 bg-gradient-to-b from-pink-200 via-rose-200 to-fuchsia-300 text-lg font-bold text-violet-800 shadow-[0_10px_20px_rgba(220,100,173,0.3)]"
        onPointerDown={(event) => {
          event.preventDefault();
          onJump();
        }}
      >
        Jump ✨
      </button>
    </div>
  );
}
