'use client';

import { useEffect } from 'react';
import { audio } from '@/lib/audio';

export default function ClickSoundLayer() {
  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target?.closest('button, a, input, select, textarea, summary')) return;
      audio.click();
    };

    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, []);

  return null;
}
