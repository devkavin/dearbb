'use client';

import { motion } from 'framer-motion';
import { useMemo, useOptimistic, useState, useTransition } from 'react';
import Header from '@/components/Header';
import { storage } from '@/lib/storage';

export default function RevealPage() {
  const initial = useMemo(() => storage.read(), []);
  const [choice, setChoice] = useState<'yes' | 'after-exam' | null>(initial.revealChoice);
  const [note, setNote] = useState(initial.revealNote);
  const [activity, setActivity] = useState('Movie night');
  const [time, setTime] = useState('After exam');
  const [examDate, setExamDate] = useState(initial.reminderDate || '');
  const [reducedMotion] = useState(initial.reducedMotion);
  const [shareState, setShareState] = useState('');
  const [isPending, startTransition] = useTransition();
  const [optimisticChoice, setOptimisticChoice] = useOptimistic(choice, (_, next: 'yes' | 'after-exam') => next);

  const prefilledMessage = useMemo(
    () => `Hey love, I chose: ${optimisticChoice ?? 'still deciding'}${note ? ` | note: ${note}` : ''}.`,
    [optimisticChoice, note]
  );

  const saveChoice = (next: 'yes' | 'after-exam') => {
    setOptimisticChoice(next);
    startTransition(() => {
      setChoice(next);
      storage.write({ revealChoice: next });
    });
  };

  const copyText = async (text: string, successLabel: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setShareState(successLabel);
      setTimeout(() => setShareState(''), 1200);
    } catch {
      setShareState('Clipboard is unavailable in this browser.');
    }
  };

  const downloadDateCard = () => {
    const stamp = new Date().toLocaleString();
    const prettyNote = note || 'No extra note yet';
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='760' height='460'>
      <defs>
        <linearGradient id='bg' x1='0' y1='0' x2='1' y2='1'>
          <stop offset='0%' stop-color='#fff8fc'/>
          <stop offset='50%' stop-color='#f2e8ff'/>
          <stop offset='100%' stop-color='#e4f2ff'/>
        </linearGradient>
        <linearGradient id='card' x1='0' y1='0' x2='1' y2='1'>
          <stop offset='0%' stop-color='#ffffff'/>
          <stop offset='100%' stop-color='#fff7fb'/>
        </linearGradient>
      </defs>
      <rect width='100%' height='100%' fill='url(#bg)'/>
      <circle cx='670' cy='80' r='64' fill='#ffd9ef' opacity='0.7'/>
      <circle cx='110' cy='390' r='72' fill='#dff2ff' opacity='0.8'/>
      <rect x='38' y='38' width='684' height='384' rx='30' fill='url(#card)' stroke='#c9b5ff' stroke-width='4'/>
      <text x='72' y='98' font-size='36' fill='#6d43b7' font-family='Quicksand, sans-serif' font-weight='700'>💌 Dear bb 💖</text>
      <text x='72' y='154' font-size='25' fill='#4f4277' font-family='Quicksand, sans-serif'>Selection: ${optimisticChoice ?? 'pending'}</text>
      <text x='72' y='196' font-size='23' fill='#4f4277' font-family='Quicksand, sans-serif'>Plan: ${activity} · ${time}</text>
      <text x='72' y='242' font-size='19' fill='#5a4f7d' font-family='Quicksand, sans-serif'>${prettyNote.replace(/</g, '&lt;').replace(/>/g, '&gt;').slice(0, 72)}</text>
      <text x='72' y='300' font-size='28' fill='#7f56d9' font-family='Quicksand, sans-serif'>✨ 💖 🎀 🌙 🫶</text>
      <text x='72' y='356' font-size='14' fill='#7a7399' font-family='Quicksand, sans-serif'>Saved: ${stamp}</text>
      <text x='72' y='382' font-size='14' fill='#7a7399' font-family='Quicksand, sans-serif'>made with love for my favorite person</text>
    </svg>`;

    const a = document.createElement('a');
    a.href = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
    a.download = 'dearbb-date-card.svg';
    a.click();
  };

  const pulseAnimation = reducedMotion ? {} : { scale: [1, 1.04, 1], y: [0, -3, 0] };

  return (
    <main className="pb-10">
      <Header />
      <section className="mx-auto max-w-3xl rounded-3xl bg-white/35 p-4 shadow-[0_18px_35px_rgba(150,120,220,0.18)]">
        <div className="pixel-card glow-sparkle relative overflow-hidden rounded-3xl bg-gradient-to-b from-white via-rose-50 to-violet-50 p-5">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_8%,rgba(255,255,255,0.9),transparent_40%),radial-gradient(circle_at_90%_18%,rgba(255,185,228,0.38),transparent_38%),radial-gradient(circle_at_55%_92%,rgba(191,219,254,0.3),transparent_35%)]" />
          <div className="relative">
            <div className="mb-4 rounded-2xl border border-white/70 bg-white/80 p-3 shadow-[0_14px_28px_rgba(167,139,250,0.16)]">
              <div className="flex items-center gap-3">
                <div className="h-16 w-16 rounded-2xl bg-candy p-2 text-center text-xs leading-4">📬<br />mailbox</div>
                <motion.p
                  className="text-sm font-semibold text-violet-700"
                  animate={pulseAnimation}
                  transition={{ duration: 1.9, repeat: Infinity, ease: 'easeInOut' }}
                >
                  Letter opened... invitation incoming 💌
                </motion.p>
              </div>
            </div>

            <h1 className="font-pixel text-xs text-violet-700">Will you go on a date with me after your exam, bb?</h1>
            <p className="mt-3 text-violet-900/90">You decide the day. I’ll follow your schedule. Love, I just want your yes when you feel ready 💖</p>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <button className="btn-cute bg-violet-500 px-4 py-3 text-white shadow-[0_8px_20px_rgba(139,92,246,0.35)]" onClick={() => saveChoice('yes')}>Yes bb 💖</button>
              <button className="btn-cute bg-sky px-4 py-3 text-violet-700" onClick={() => saveChoice('after-exam')}>After my exam — ask me again 🫶</button>
            </div>

            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <span className="rounded-full border border-violet-100 bg-white px-3 py-1 text-violet-700 shadow-sm">Choice: {optimisticChoice ?? 'pending'}</span>
            </div>

            {isPending && <p className="mt-2 text-xs text-violet-700">Saving your choice…</p>}

            {optimisticChoice === 'yes' && (
              <div className="mt-4 rounded-2xl border border-violet-100 bg-[linear-gradient(140deg,rgba(250,245,255,0.95),rgba(244,238,255,0.82),rgba(255,241,248,0.9))] p-4 shadow-[0_16px_30px_rgba(167,139,250,0.14)]">
                {!reducedMotion && <div className="confetti pointer-events-none relative h-24 overflow-hidden">{Array.from({ length: 16 }).map((_, i) => <span key={i} style={{ left: `${i * 6}%`, background: i % 2 ? '#ff8dbf' : '#8dd9ff' }} />)}</div>}
                <h2 className="font-semibold text-violet-800">Date Plan ✨</h2>
                <div className="mt-2 space-y-2 text-sm">
                  <select className="w-full rounded-xl border border-violet-200 bg-white/90 p-2.5 shadow-sm focus:border-violet-400 focus:outline-none" value={activity} onChange={(e) => setActivity(e.target.value)}>
                    <option>Movie night</option><option>Call + mini game</option><option>Online dinner</option>
                  </select>
                  <input className="w-full rounded-xl border border-violet-200 bg-white/90 p-2.5 shadow-sm focus:border-violet-400 focus:outline-none" value={time} onChange={(e) => setTime(e.target.value)} placeholder="After exam or custom time" />
                  <textarea className="min-h-24 w-full rounded-xl border border-violet-200 bg-white/90 p-2.5 shadow-sm focus:border-violet-400 focus:outline-none" placeholder="Message to him" value={note} onChange={(e) => { setNote(e.target.value); storage.write({ revealNote: e.target.value }); }} />
                </div>
              </div>
            )}

            {optimisticChoice === 'after-exam' && (
              <div className="mt-4 rounded-2xl border border-sky-100 bg-[linear-gradient(140deg,rgba(239,248,255,0.95),rgba(232,244,255,0.86),rgba(247,241,255,0.9))] p-4 text-sm shadow-[0_16px_30px_rgba(125,211,252,0.16)]">
                <p>Of course bb. I’m proud of you. After your exam, I’ll ask again properly 💖</p>
                <label className="mt-2 block">Exam done date (optional)
                  <input type="date" className="mt-1 w-full rounded-xl border border-sky-200 bg-white/90 p-2.5 shadow-sm focus:border-sky-400 focus:outline-none" value={examDate} onChange={(e) => setExamDate(e.target.value)} />
                </label>
                <button className="btn-cute mt-2 bg-white px-3 py-2 text-violet-700" onClick={() => storage.write({ reminderDate: examDate })}>Save reminder</button>
                <p className="mt-2 rounded-xl bg-white p-2 text-violet-800">Saved. I’ll be waiting with soft kitty energy 🐾</p>
              </div>
            )}

            <div className="mt-4 rounded-2xl border border-pink-100 bg-[linear-gradient(140deg,rgba(255,255,255,0.95),rgba(255,243,250,0.9),rgba(238,245,255,0.9))] p-4 shadow-[0_16px_30px_rgba(244,114,182,0.13)]">
              <h3 className="font-semibold text-violet-900">Share back to him</h3>
              <p className="mt-1 text-xs text-violet-700">Quick actions for message + date card, wrapped in extra cuteness ✨</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                <button className="btn-cute bg-candy px-3 py-2 text-sm text-violet-700" onClick={() => copyText(prefilledMessage, 'Message copied 💌')}>Copy message</button>
                <button className="btn-cute bg-candy px-3 py-2 text-sm text-violet-700" onClick={downloadDateCard}>Download pretty SVG card</button>
                <button className="btn-cute bg-candy px-3 py-2 text-sm text-violet-700" onClick={() => copyText('🐾💖✨📖🎶', 'Sticker copied ✨')}>Copy a cute sticker</button>
              </div>
              {shareState && <p className="mt-2 text-xs text-violet-700">{shareState}</p>}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
