'use client';

import { MemoryEntry } from '@/lib/storage';

export default function MemoryTimeline({ entries }: { entries: MemoryEntry[] }) {
  if (!entries.length) return <p className="text-sm">No memories unlocked yet — go collect some tokens 🌸</p>;
  return (
    <ul className="space-y-2">
      {entries.map((entry) => (
        <li key={entry.id} className="rounded-xl bg-lavender/50 p-3 text-sm">
          <div className="font-semibold">{entry.sticker} {entry.note}</div>
          <div className="text-xs opacity-70">{new Date(entry.stamp).toLocaleString()}</div>
        </li>
      ))}
    </ul>
  );
}
