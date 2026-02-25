export type MemoryEntry = { id: string; note: string; stamp: string; sticker: string };
export type RevealChoice = 'yes' | 'after-exam' | null;

export type AppState = {
  collectedTokenIds: string[];
  stage: number;
  timeline: MemoryEntry[];
  muted: boolean;
  reducedMotion: boolean;
  revealChoice: RevealChoice;
  revealNote: string;
  reminderDate?: string;
  ldrMode: boolean;
  moonClicks: number;
};

const KEY = 'dearbb-state-v1';
const defaultState: AppState = {
  collectedTokenIds: [],
  stage: 0,
  timeline: [],
  muted: false,
  reducedMotion: false,
  revealChoice: null,
  revealNote: '',
  ldrMode: false,
  moonClicks: 0
};

export const storage = {
  read(): AppState {
    if (typeof window === 'undefined') return defaultState;
    try {
      const raw = window.localStorage.getItem(KEY);
      if (!raw) return defaultState;
      return { ...defaultState, ...JSON.parse(raw) as Partial<AppState> };
    } catch {
      return defaultState;
    }
  },
  write(next: Partial<AppState>) {
    if (typeof window === 'undefined') return;
    const merged = { ...storage.read(), ...next };
    window.localStorage.setItem(KEY, JSON.stringify(merged));
  },
  pushTimeline(entry: Omit<MemoryEntry, 'stamp'>) {
    const state = storage.read();
    if (state.timeline.some((t) => t.id === entry.id)) return;
    state.timeline.push({ ...entry, stamp: new Date().toISOString() });
    storage.write({ timeline: state.timeline });
  }
};
