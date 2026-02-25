'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import EnvelopeLetter from '@/components/EnvelopeLetter';
import Header from '@/components/Header';
import LdrModeToggle from '@/components/LdrModeToggle';
import { audio } from '@/lib/audio';
import { storage } from '@/lib/storage';

export default function HomePage() {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [muted, setMuted] = useState(false);
  const [ldr, setLdr] = useState(false);

  useEffect(() => {
    const state = storage.read();
    const prefer = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setReducedMotion(state.reducedMotion || prefer);
    setMuted(state.muted);
    setLdr(state.ldrMode);
    audio.setMuted(state.muted);
    audio.ambient(!state.muted);
  }, []);

  const toggleReduced = () => {
    const next = !reducedMotion;
    setReducedMotion(next);
    storage.write({ reducedMotion: next });
  };

  return (
    <main className="pb-10">
      <Header />
      <section className="mx-auto max-w-3xl space-y-5 px-4">
        <div className="pointer-events-none flex justify-center gap-8 text-xl opacity-80">
          <span className={reducedMotion ? '' : 'soft-float'}>✨</span>
          <span className={reducedMotion ? '' : 'soft-float'} style={{ animationDelay: '0.35s' }}>💖</span>
          <span className={reducedMotion ? '' : 'soft-float'} style={{ animationDelay: '0.7s' }}>🌙</span>
        </div>

        <EnvelopeLetter>
          <h1 className="font-pixel text-sm text-violet-700">Dear Jhanvi</h1>
          <div className="mt-3 space-y-3 text-base leading-relaxed text-slate-700">
            <p>bb, this is a little pocket hug for you.</p>
            <p>
              There are so many tiny rituals in my day that quietly belong to you. The late night calls. Singing Soft kitty
              until your breathing slows. Reading the bedtime stories I wrote just to hear that sleepy little voice say
              “one moree.”
            </p>
            <p>
              Even in the most random parts of my day, like when I disappear to “talk to god”, you somehow manage to live
              in my head rent free. That&apos;s just how constant you are in my world.
            </p>
            <p>
              You&apos;re about to conquer your exam, and I need you to know how proud I am of you. I see how hard you&apos;ve
              worked. I believe in you more than you know.
            </p>
            <p>So here&apos;s something small, playful, and made only for you.</p>
            <p>
              Play whenever you want…
              <br />
              and meet me at the mailbox at the end for something special. 💖
            </p>
          </div>
        </EnvelopeLetter>

        <div className="flex flex-wrap gap-3">
          <Link href="/play" className="btn-cute bg-violet-500 text-white shadow-[0_8px_20px_rgba(139,92,246,0.35)]">Start Game</Link>
          <button className="btn-cute bg-white text-violet-700" onClick={() => { const next = !muted; setMuted(next); storage.write({ muted: next }); audio.setMuted(next); audio.ambient(!next); }}>
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
