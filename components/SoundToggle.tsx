'use client';

export default function SoundToggle({ muted, onToggle }: { muted: boolean; onToggle: () => void }) {
  return <button onClick={onToggle} className="btn-cute bg-white/90 px-4 py-2 text-sm text-violet-700">{muted ? 'Sound: off' : 'Sound: on'}</button>;
}
