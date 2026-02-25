'use client';

import Link from 'next/link';
import { type MouseEvent, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import EnvelopeLetter from '@/components/EnvelopeLetter';
import Header from '@/components/Header';
import LdrModeToggle from '@/components/LdrModeToggle';
import TypedLetterContent from '@/components/TypedLetterContent';
import { audio } from '@/lib/audio';
import { storage } from '@/lib/storage';

const LETTER_LINES = [
  'bb, this is a little pocket hug for you.',
  'There are so many tiny rituals in my day that quietly belong to you. The late night calls. Singing Soft kitty until your breathing slows. Reading the bedtime stories I wrote just to hear that sleepy little voice say “one moree.”',
  'Even in the most random parts of my day, like when I disappear to “talk to god”, you somehow manage to live in my head rent free. That\'s just how constant you are in my world.',
  'You\'re about to conquer your exam, and I need you to know how proud I am of you. I see how hard you\'ve worked. I believe in you more than you know.',
  'So here\'s something small, playful, and made only for you.',
  'Play whenever you want… and meet me at the mailbox at the end for something special. 💖'
];

export default function HomePage() {
  const initial = useMemo(() => storage.read(), []);
  const confettiRef = useRef<((options?: import('canvas-confetti').Options) => Promise<undefined> | null) | null>(null);
  const [reducedMotion, setReducedMotion] = useState(initial.reducedMotion);
  const [muted, setMuted] = useState(initial.muted);
  const [ldr, setLdr] = useState(initial.ldrMode);

  useEffect(() => {
    audio.setMuted(muted);
    audio.setSceneMusic('website');
    return () => audio.setSceneMusic('none');
  }, [muted]);

  const toggleReduced = () => {
    const next = !reducedMotion;
    setReducedMotion(next);
    storage.write({ reducedMotion: next });
  };

  const heroStars = useMemo(() => ['✨', '💖', '🌙', '⭐', '🫶'], []);

  const burstSparkle = async (event: MouseEvent<HTMLButtonElement>) => {
    if (reducedMotion) return;

    if (!confettiRef.current) {
      const loaded = await import('canvas-confetti');
      confettiRef.current = (loaded.default ?? loaded) as unknown as (options?: import('canvas-confetti').Options) => Promise<undefined> | null;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    const confetti = confettiRef.current;
    if (!confetti) return;

    void confetti({
      particleCount: 80,
      spread: 70,
      startVelocity: 35,
      gravity: 0.85,
      ticks: 180,
      origin: { x, y },
      scalar: 0.9,
      colors: ['#f9a8d4', '#c4b5fd', '#7dd3fc', '#fde68a']
    });

    void confetti({
      particleCount: 20,
      spread: 45,
      startVelocity: 25,
      origin: { x, y: Math.max(0.1, y - 0.05) },
      shapes: ['star'],
      scalar: 1.1,
      colors: ['#f0abfc', '#f9a8d4', '#a5b4fc']
    });
  };

  return (
    <main className="pb-10">
      <Header />
      <section className="mx-auto max-w-3xl space-y-5 px-4">
        <div className="relative overflow-hidden rounded-3xl border border-white/70 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.85),_rgba(238,229,255,0.85),_rgba(219,234,254,0.88))] p-5 shadow-[0_24px_45px_rgba(139,92,246,0.2)]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_12%,rgba(255,255,255,0.75),transparent_42%),radial-gradient(circle_at_82%_25%,rgba(125,211,252,0.45),transparent_40%),radial-gradient(circle_at_55%_80%,rgba(249,168,212,0.35),transparent_35%)]" />
          <div className="relative">
            <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-violet-500/80">Wish Station</p>
            <div className="mt-3 flex justify-center gap-8 text-2xl opacity-90">
              {heroStars.map((star, index) => (
                <motion.span
                  key={star}
                  className={reducedMotion ? '' : 'soft-float'}
                  style={{ animationDelay: `${index * 0.2}s` }}
                  animate={reducedMotion ? undefined : { y: [0, -8, 0], rotate: [0, 6, -3, 0], scale: [1, 1.08, 1] }}
                  transition={{ duration: 2 + index * 0.15, repeat: Infinity, ease: 'easeInOut' }}
                >
                  {star}
                </motion.span>
              ))}
            </div>
            <p className="mt-3 text-center text-sm text-violet-700">Tap the button and make a bigger, prettier constellation wish.</p>
            <button className="btn-cute mt-4 w-full border border-white/70 bg-white/80 text-sm text-violet-700 shadow-[0_12px_24px_rgba(139,92,246,0.18)]" onClick={burstSparkle}>
              Launch a cute constellation burst ✨💖
            </button>
          </div>
        </div>

        <EnvelopeLetter>
          {(open) => (
            <>
              <h1 className="font-pixel text-sm text-violet-700">Dear Jhanvi</h1>
              <div className="mt-3">
                <TypedLetterContent key={open ? 'open' : 'closed'} lines={LETTER_LINES} active={open} />
              </div>
            </>
          )}
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
