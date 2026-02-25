'use client';

export default function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/40 p-4" onClick={onClose}>
      <div className="pixel-card w-full max-w-xl rounded-2xl bg-white p-4" onClick={(e) => e.stopPropagation()}>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-pixel text-xs text-violet-700">{title}</h2>
          <button className="rounded-lg bg-candy px-3 py-1" onClick={onClose}>close</button>
        </div>
        {children}
      </div>
    </div>
  );
}
