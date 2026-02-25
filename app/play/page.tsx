'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import OnScreenControls from '@/components/OnScreenControls';
import { audio } from '@/lib/audio';
import { createPlayer } from '@/lib/game/entities';
import { startLoop } from '@/lib/game/engine';
import { levels } from '@/lib/game/levels';
import { intersects, updatePlayer } from '@/lib/game/physics';
import { render } from '@/lib/game/renderer';
import { loadAssets } from '@/lib/game/svgAssets';
import { storage } from '@/lib/storage';

const TOTAL = 5;

export default function PlayPage() {
  const initial = useMemo(() => storage.read(), []);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const keys = useRef({ left: false, right: false, jump: false });
  const collectedRef = useRef<string[]>(initial.collectedTokenIds || []);
  const moonClicksRef = useRef(initial.moonClicks);
  const flashTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter();
  const [stage, setStage] = useState(initial.stage || 0);
  const [collected, setCollected] = useState<string[]>(initial.collectedTokenIds || []);
  const [journalOpen, setJournalOpen] = useState(true);
  const [flash, setFlash] = useState('');
  const [reducedMotion] = useState(initial.reducedMotion);
  const [booth, setBooth] = useState(false);
  const [storyTitle, setStoryTitle] = useState('Moonlight Snuggle');
  const [storyLine, setStoryLine] = useState('Then bb smiled and the stars tucked her in.');
  const [memory, setMemory] = useState(initial.timeline);
  const timelineRef = useRef(initial.timeline);

  useEffect(() => {
    audio.setMuted(initial.muted);
    audio.setSceneMusic('game');
    return () => audio.setSceneMusic('none');
  }, [initial.muted]);

  useEffect(() => {
    let stop = () => {};
    let mounted = true;
    loadAssets().then((assets) => {
      if (!mounted || !canvasRef.current) return;
      const ctx = canvasRef.current.getContext('2d');
      if (!ctx) return;

      let currentStage = initial.stage || 0;
      const player = createPlayer(levels[currentStage].spawn.x, levels[currentStage].spawn.y);
      stop = startLoop(() => {
        const level = levels[currentStage];
        if (keys.current.left) player.vx -= 0.6;
        if (keys.current.right) player.vx += 0.6;
        if (keys.current.jump && player.onGround) { player.vy = -8.5; keys.current.jump = false; audio.jump(); }
        updatePlayer(player, level.platforms);

        if (player.y > 380) {
          player.x = level.spawn.x; player.y = level.spawn.y; player.vx = 0; player.vy = 0; audio.oops();
        }

        for (const token of level.tokens) {
          const alreadyCollected = collectedRef.current;
          if (token.collected || alreadyCollected.includes(token.id)) continue;
          if (intersects(player, token)) {
            token.collected = true;
            const nextCollected = [...alreadyCollected, token.id];
            collectedRef.current = nextCollected;
            setCollected(nextCollected);
            storage.write({ collectedTokenIds: nextCollected });
            const nextTimeline = [...timelineRef.current, { id: token.id, note: token.note, sticker: token.sticker, stamp: new Date().toISOString() }];
            storage.write({ timeline: nextTimeline });
            timelineRef.current = nextTimeline;
            setMemory(nextTimeline);
            setFlash(Math.random() > 0.5 ? 'bb moment unlocked ✨' : 'Nikki smile detected 💖');
            if (flashTimeoutRef.current) clearTimeout(flashTimeoutRef.current);
            flashTimeoutRef.current = setTimeout(() => setFlash(''), 1200);
            audio.token();
          }
        }

        if (intersects(player, level.portal)) {
          const count = collectedRef.current.length;
          if (count >= TOTAL && currentStage === levels.length - 1) {
            audio.tada();
            router.push('/reveal');
          } else if (currentStage < levels.length - 1) {
            currentStage += 1;
            setStage(currentStage);
            storage.write({ stage: currentStage });
            player.x = levels[currentStage].spawn.x;
            player.y = levels[currentStage].spawn.y;
          }
        }

        render(ctx, level, player, assets, 820, 360);
      });

      const onKeyDown = (e: KeyboardEvent) => {
        if (['ArrowLeft', 'a', 'A'].includes(e.key)) keys.current.left = true;
        if (['ArrowRight', 'd', 'D'].includes(e.key)) keys.current.right = true;
        if (['ArrowUp', 'w', 'W', ' '].includes(e.key) && player.onGround) { player.vy = -8.5; audio.jump(); }
      };
      const onKeyUp = (e: KeyboardEvent) => {
        if (['ArrowLeft', 'a', 'A'].includes(e.key)) keys.current.left = false;
        if (['ArrowRight', 'd', 'D'].includes(e.key)) keys.current.right = false;
      };
      window.addEventListener('keydown', onKeyDown);
      window.addEventListener('keyup', onKeyUp);

      canvasRef.current.onclick = (evt) => {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;
        const x = ((evt.clientX - rect.left) / rect.width) * 820;
        const y = ((evt.clientY - rect.top) / rect.height) * 360;
        const moon = levels[currentStage].moon;
        if (x >= moon.x && x <= moon.x + moon.w && y >= moon.y && y <= moon.y + moon.h) {
          const clickCount = moonClicksRef.current + 1;
          moonClicksRef.current = clickCount;
          storage.write({ moonClicks: clickCount });
          if (clickCount >= 5) setBooth(true);
        }
      };

      return () => {
        window.removeEventListener('keydown', onKeyDown);
        window.removeEventListener('keyup', onKeyUp);
      };
    });

    return () => {
      mounted = false;
      stop();
      if (flashTimeoutRef.current) clearTimeout(flashTimeoutRef.current);
    };
  }, [initial.stage, router]);

  const downloadStoryCard = () => {
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='560' height='320'><rect width='100%' height='100%' fill='#fff5fd'/><rect x='20' y='20' width='520' height='280' rx='18' fill='#e7f4ff' stroke='#a597db' stroke-width='4'/><text x='44' y='74' font-size='22' fill='#6f57a9'>Bedtime Story Booth</text><text x='44' y='124' font-size='28' fill='#3f315e'>${storyTitle}</text><text x='44' y='172' font-size='18' fill='#4b4664'>${storyLine}</text><text x='44' y='244' font-size='16'>🐾💖✨📖🎶</text></svg>`;
    const a = document.createElement('a');
    a.href = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
    a.download = 'bedtime-story-card.svg';
    a.click();
  };

  const resetGame = () => {
    const currentState = storage.read();
    storage.write({
      stage: 0,
      collectedTokenIds: [],
      timeline: [],
      moonClicks: 0,
      revealChoice: null,
      revealNote: ''
    });

    for (const level of levels) {
      for (const token of level.tokens) token.collected = false;
    }

    setStage(0);
    setCollected([]);
    collectedRef.current = [];
    setMemory([]);
    timelineRef.current = [];
    moonClicksRef.current = 0;
    setBooth(false);
    setFlash('Game reset ✨');
    setTimeout(() => setFlash(''), 1200);
    if (currentState.stage !== 0) {
      window.location.reload();
    }
  };

  return (
    <main className="pb-10">
      <Header />
      <section className="mx-auto max-w-5xl rounded-3xl bg-white/35 p-4 shadow-[0_18px_35px_rgba(150,120,220,0.18)]">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <p className="font-pixel text-xs">Progress: {collected.length}/{TOTAL} tokens · zone {stage + 1}/3</p>
          <div className="flex items-center gap-2">
            <button className="btn-cute bg-white px-3 py-2 text-sm text-violet-700" onClick={() => setJournalOpen((v) => !v)}>Memory Journal</button>
            <button className="btn-cute bg-rose-100 px-3 py-2 text-sm text-rose-700" onClick={resetGame}>Reset Game</button>
          </div>
        </div>

        <canvas ref={canvasRef} width={820} height={360} className="w-full rounded-2xl border-4 border-white bg-white/80 shadow-[0_16px_40px_rgba(120,90,200,0.3)] ring-2 ring-violet-200/70" />
        <OnScreenControls onLeft={(d) => { keys.current.left = d; }} onRight={(d) => { keys.current.right = d; }} onJump={() => { keys.current.jump = true; }} />
        <p className="mt-2 text-center text-xs font-semibold text-violet-700 md:hidden">Use the joystick + jump bubble for mobile play.</p>

        {flash && <p className="mt-3 inline-block rounded-xl bg-white px-3 py-2 text-sm sparkle">{flash}</p>}

        {journalOpen && (
          <div className="mt-3 rounded-2xl bg-white/80 p-3">
            <h2 className="font-semibold">Memory Journal</h2>
            <ul className="mt-2 list-disc pl-5 text-sm">
              {memory.map((m) => <li key={m.id}>{m.sticker} {m.note}</li>)}
            </ul>
          </div>
        )}

        {booth && (
          <div className="mt-4 rounded-2xl bg-white p-4">
            <h3 className="font-pixel text-[10px]">Bedtime Story Booth unlocked 🌙</h3>
            <p className="mt-2 text-sm">Pick an intro: &quot;A sleepy kitten guarded your dreams&quot; · &quot;The moon wrote your name in glitter&quot; · &quot;A tiny star whispered goodnight&quot;</p>
            <input className="mt-2 w-full rounded-lg border p-2" value={storyTitle} onChange={(e) => setStoryTitle(e.target.value)} placeholder="Story title" />
            <input className="mt-2 w-full rounded-lg border p-2" value={storyLine} onChange={(e) => setStoryLine(e.target.value)} placeholder="A short line" />
            <button className="btn-cute mt-2 bg-violet-500 px-4 py-2 text-white" onClick={downloadStoryCard}>Export story SVG card</button>
          </div>
        )}

        {!reducedMotion && <p className="mt-3 text-xs opacity-70">Tip: click the moon 5 times for a secret ✨</p>}
      </section>
    </main>
  );
}
