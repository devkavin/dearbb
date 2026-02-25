'use client';

export default function LdrModeToggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <div className="rounded-2xl border border-white/70 bg-white/65 p-3 text-xs shadow-sm">
      <button className="btn-cute bg-sky px-4 py-2 text-violet-700" onClick={onToggle}>LDR mode: {enabled ? 'on' : 'off'}</button>
      {enabled && <p className="mt-2 text-violet-700">distance: far · love: max · sleepy bb: likely</p>}
    </div>
  );
}
