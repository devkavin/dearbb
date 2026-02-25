'use client';

import { useEffect, useMemo, useState } from 'react';
import Header from '@/components/Header';
import { storage } from '@/lib/storage';

export default function RevealPage() {
  const [choice, setChoice] = useState<'yes' | 'after-exam' | null>(null);
  const [note, setNote] = useState('');
  const [activity, setActivity] = useState('Movie night');
  const [time, setTime] = useState('After exam');
  const [examDate, setExamDate] = useState('');
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const saved = storage.read();
    setChoice(saved.revealChoice);
    setNote(saved.revealNote);
    setReducedMotion(saved.reducedMotion);
    setExamDate(saved.reminderDate || '');
  }, []);

  const prefilledMessage = useMemo(() => `Hey love, I chose: ${choice ?? 'still deciding'}${note ? ` | note: ${note}` : ''}.`, [choice, note]);

  const saveChoice = (next: 'yes' | 'after-exam') => {
    setChoice(next);
    storage.write({ revealChoice: next });
  };

  const downloadDateCard = () => {
    const stamp = new Date().toLocaleString();
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='640' height='360'><rect width='100%' height='100%' fill='#f7eaff'/><rect x='28' y='28' width='584' height='304' rx='18' fill='#ffffff' stroke='#b9a2ee' stroke-width='4'/><text x='52' y='90' font-size='34' fill='#6a4ca5'>Dear bb</text><text x='52' y='145' font-size='22' fill='#3f3856'>Selection: ${choice ?? 'pending'}</text><text x='52' y='185' font-size='20' fill='#4f4a63'>Plan: ${activity} at ${time}</text><text x='52' y='225' font-size='18' fill='#4f4a63'>${note || 'No extra note yet'}</text><text x='52' y='280' font-size='20'>💖 ⭐ 📖 🎶</text><text x='52' y='315' font-size='14' fill='#64607a'>${stamp}</text></svg>`;
    const a = document.createElement('a');
    a.href = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
    a.download = 'dearbb-date-card.svg';
    a.click();
  };

  return (
    <main className="pb-10">
      <Header />
      <section className="mx-auto max-w-3xl rounded-3xl bg-white/30 p-4 shadow-[0_18px_35px_rgba(150,120,220,0.18)]">
        <div className="pixel-card glow-sparkle rounded-3xl bg-gradient-to-b from-white to-rose-50 p-5">
          <div className="mb-4 flex items-end gap-2">
            <div className="h-20 w-20 rounded-2xl bg-candy p-2 text-center text-xs">📬<br/>mailbox</div>
            <p className="animate-pop text-sm">Letter opened... invitation incoming 💌</p>
          </div>

          <h1 className="font-pixel text-xs text-violet-700">Will you go on a date with me after your exam, bb?</h1>
          <p className="mt-3">You decide the day. I’ll follow your schedule. Nikki, I just want your yes when you feel ready 💖</p>

          <div className="mt-4 flex flex-wrap gap-3">
            <button className="btn-cute bg-violet-500 px-4 py-3 text-white shadow-[0_8px_20px_rgba(139,92,246,0.35)]" onClick={() => saveChoice('yes')}>Yes bb 💖</button>
            <button className="btn-cute bg-sky px-4 py-3 text-violet-700" onClick={() => saveChoice('after-exam')}>After my exam — you’ll ask me again 🫶</button>
          </div>

          {choice === 'yes' && (
            <div className="mt-4 rounded-2xl bg-lavender/50 p-4">
              {!reducedMotion && <div className="confetti pointer-events-none relative h-24 overflow-hidden">{Array.from({ length: 16 }).map((_, i) => <span key={i} style={{ left: `${i * 6}%`, background: i % 2 ? '#ff8dbf' : '#8dd9ff' }} />)}</div>}
              <h2 className="font-semibold">Date Plan</h2>
              <div className="mt-2 space-y-2 text-sm">
                <select className="w-full rounded-lg border p-2" value={activity} onChange={(e) => setActivity(e.target.value)}>
                  <option>Movie night</option><option>Call + mini game</option><option>Online dinner</option>
                </select>
                <input className="w-full rounded-lg border p-2" value={time} onChange={(e) => setTime(e.target.value)} placeholder="After exam or custom time" />
                <textarea className="w-full rounded-lg border p-2" placeholder="Message to him" value={note} onChange={(e) => { setNote(e.target.value); storage.write({ revealNote: e.target.value }); }} />
              </div>
            </div>
          )}

          {choice === 'after-exam' && (
            <div className="mt-4 rounded-2xl bg-sky/40 p-4 text-sm">
              <p>Of course bb. I’m proud of you. After your exam, I’ll ask again properly 💖</p>
              <label className="mt-2 block">Exam done date (optional)
                <input type="date" className="mt-1 w-full rounded-lg border p-2" value={examDate} onChange={(e) => setExamDate(e.target.value)} />
              </label>
              <button className="btn-cute mt-2 bg-white px-3 py-2 text-violet-700" onClick={() => storage.write({ reminderDate: examDate })}>Save reminder</button>
              <p className="mt-2 rounded-lg bg-white p-2">Saved. I’ll be waiting with soft kitty energy 🐾</p>
            </div>
          )}

          <div className="mt-4 rounded-2xl bg-white/70 p-4">
            <h3 className="font-semibold">Share back to him</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              <button className="btn-cute bg-candy px-3 py-2 text-sm text-violet-700" onClick={() => navigator.clipboard.writeText(prefilledMessage)}>Copy message</button>
              <button className="btn-cute bg-candy px-3 py-2 text-sm text-violet-700" onClick={downloadDateCard}>Download SVG date card</button>
              <button className="btn-cute bg-candy px-3 py-2 text-sm text-violet-700" onClick={() => navigator.clipboard.writeText('🐾💖✨📖🎶')}>Copy a cute sticker</button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
