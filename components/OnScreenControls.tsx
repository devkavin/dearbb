'use client';

export default function OnScreenControls({ onLeft, onRight, onJump }: { onLeft: (down: boolean) => void; onRight: (down: boolean) => void; onJump: () => void }) {
  const bind = (handler: (down: boolean) => void) => ({
    onTouchStart: () => handler(true),
    onTouchEnd: () => handler(false),
    onMouseDown: () => handler(true),
    onMouseUp: () => handler(false),
    onMouseLeave: () => handler(false)
  });

  return (
    <div className="mt-3 flex items-center justify-center gap-3 md:hidden">
      <button className="btn-cute rounded-full bg-white px-5 py-4 text-violet-700" {...bind(onLeft)}>◀</button>
      <button className="btn-cute rounded-full bg-white px-5 py-4 text-violet-700" {...bind(onRight)}>▶</button>
      <button className="btn-cute rounded-full bg-candy px-5 py-4 text-violet-700" onTouchStart={onJump} onMouseDown={onJump}>⤴</button>
    </div>
  );
}
