'use client';

import { useEffect, useMemo, useState } from 'react';
import { audio } from '@/lib/audio';

export default function TypedLetterContent({ lines, active }: { lines: string[]; active: boolean }) {
  const fullText = useMemo(() => lines.join('\n\n'), [lines]);
  const [typed, setTyped] = useState('');

  useEffect(() => {
    if (!active) return;

    let cancelled = false;
    const timers: number[] = [];
    let index = 0;
    const tick = () => {
      if (cancelled) return;
      index += 1;
      setTyped(fullText.slice(0, index));
      if (fullText[index - 1] && ![' ', '\n'].includes(fullText[index - 1])) audio.typeKey();
      if (index < fullText.length) {
        const current = fullText[index - 1];
        const delay = current === '\n' ? 120 : current === '.' ? 90 : 28;
        timers.push(window.setTimeout(tick, delay));
      }
    };

    timers.push(window.setTimeout(tick, 240));
    return () => {
      cancelled = true;
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [active, fullText]);

  if (!active) {
    return <div className="space-y-3 text-base leading-relaxed text-slate-700">open the envelope to read ✨</div>;
  }

  return (
    <div className="space-y-3 whitespace-pre-wrap text-base leading-relaxed text-slate-700">
      {typed || ' '}
      <span className="ml-0.5 inline-block h-4 w-2 animate-pulse rounded-sm bg-violet-300 align-middle" />
    </div>
  );
}
