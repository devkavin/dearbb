'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import EnvelopeLetter from '@/components/EnvelopeLetter';
import Header from '@/components/Header';
import LdrModeToggle from '@/components/LdrModeToggle';
import { audio } from '@/lib/audio';
import { storage } from '@/lib/storage';

type Sparkle = { id: number; x: number; y: number };

export default function HomePage() {
  const initial = useMemo(() => storage.read(), []);
  const [reducedMotion, setReducedMotion] = useState(initial.reducedMotion);
  const [muted, setMuted] = useState(initial.muted);
  const [ldr, setLdr] = useState(initial.ldrMode);
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  useEffect(() => {
    audio.setMuted(muted);
    audio.ambient(!muted);
  }, [muted]);

  const toggleReduced = () => {
    const next = !reducedMotion;
    setReducedMotion(next);
    storage.write({ reducedMotion: next });
  };

  const heroStars = useMemo(() => ['✨', '💖', '🌙', '⭐', '🫶'], []);

  const burstSparkle = (x: number, y: number) => {
    if (reducedMotion) return;
    const fresh = Array.from({ length: 6 }).map((_, idx) => ({ id: Date.now() + idx, x: x + (Math.random() * 50 - 25), y: y + (Math.random() * 30 - 15) }));
    setSparkles((prev) => [...prev.slice(-30), ...fresh]);
    setTimeout(() => setSparkles((prev) => prev.filter((s) => !fresh.find((f) => f.id === s.id))), 700);
  };

  return (
    <main className="pb-10">
      <Header />
      <section className="mx-auto max-w-3xl space-y-5 px-4">
        <div className="relative overflow-hidden rounded-3xl border border-white/70 bg-white/35 p-5">
          <div className="pointer-events-none flex justify-center gap-8 text-xl opacity-80">
            {heroStars.map((star, index) => <span key={star} className={reducedMotion ? '' : 'soft-float'} style={{ animationDelay: `${index * 0.2}s` }}>{star}</span>)}
          </div>
          <button className="mt-4 w-full rounded-2xl bg-white/70 p-3 text-sm text-violet-700" onClick={(event) => {
            const rect = event.currentTarget.getBoundingClientRect();
            burstSparkle(event.clientX - rect.left, event.clientY - rect.top);
          }}>
            Tap here for a tiny constellation burst ✨
          </button>
          <div className="pointer-events-none absolute inset-0">{sparkles.map((sparkle) => <span key={sparkle.id} className="absolute text-xs animate-pop" style={{ left: sparkle.x, top: sparkle.y }}>✨</span>)}</div>
        </div>

        <EnvelopeLetter>
          <h1 className="font-pixel text-sm text-violet-700">Dear Jhanvi</h1>
          <div className="mt-3 space-y-3 text-base leading-relaxed text-slate-700">
            <p>bb, this is a little pocket hug for you.</p>
            <p>There are so many tiny rituals in my day that quietly belong to you. The late night calls. Singing Soft kitty until your breathing slows. Reading the bedtime stories I wrote just to hear that sleepy little voice say “one moree.”</p>
            <p>Even in the most random parts of my day, like when I disappear to “talk to god”, you somehow manage to live in my head rent free. That&apos;s just how constant you are in my world.</p>
            <p>You&apos;re about to conquer your exam, and I need you to know how proud I am of you. I see how hard you&apos;ve worked. I believe in you more than you know.</p>
            <p>So here&apos;s something small, playful, and made only for you.</p>
            <p>Play whenever you want…<br />and meet me at the mailbox at the end for something special. 💖</p>
          </div>
        </EnvelopeLetter>

        <div className="flex flex-wrap gap-3">
          <Link href="/play" className="btn-cute bg-violet-500 text-white shadow-[0_8px_20px_rgba(139,92,246,0.35)]">Start Game</Link>
          <button className="btn-cute bg-white text-violet-700" onClick={() => { const next = !muted; setMuted(next); storage.write({ muted: next }); }}>
            {muted ? 'Unmute Sound' : 'Mute Sound'}
          </button>
          <button className="btn-cute bg-white text-violet-700" onClick={toggleReduced}>Reduced Motion: {reducedMotion ? 'On' : 'Off'}</button>
        </div>

        <LdrModeToggle enabled={ldr} onToggle={() => { const next = !ldr; setLdr(next); storage.write({ ldrMode: next }); }} />
        <p className="text-center text-xs text-violet-700">made with love for my bb ✨</p>
      </section>
    </main>
  );
}
