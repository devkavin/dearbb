'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { audio } from '@/lib/audio';
import { storage } from '@/lib/storage';
import Modal from './Modal';
import MemoryTimeline from './MemoryTimeline';
import SoundToggle from './SoundToggle';

export default function Header() {
  const initial = useMemo(() => storage.read(), []);
  const [timelineOpen, setTimelineOpen] = useState(false);
  const [muted, setMuted] = useState(initial.muted);
  const [timeline] = useState(initial.timeline);

  useEffect(() => {
    audio.setMuted(muted);
  }, [muted]);

  const toggleSound = () => {
    const next = !muted;
    setMuted(next);
    storage.write({ muted: next });
    audio.setMuted(next);
  };

  return (
    <>
      <header className="sticky top-0 z-20 mb-4 flex items-center justify-between gap-2 border-b border-white/60 bg-white/70 p-3 backdrop-blur-md">
        <div className="flex gap-2">
          <Link className="btn-cute bg-white/90 px-4 py-2 text-sm text-violet-700" href="/">Home</Link>
          <button className="btn-cute bg-white/90 px-4 py-2 text-sm text-violet-700" onClick={() => setTimelineOpen(true)}>Memory Timeline</button>
        </div>
        <SoundToggle muted={muted} onToggle={toggleSound} />
      </header>
      <Modal open={timelineOpen} onClose={() => setTimelineOpen(false)} title="Memory Timeline">
        <MemoryTimeline entries={timeline} />
      </Modal>
    </>
  );
}
