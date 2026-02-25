import { Level } from './entities';

const notes = [
  { id: 'soft-kitty', note: 'I sing Soft kitty, warm kitty until your eyes go sleepy, bb.', sticker: '🎶💖' },
  { id: 'bedtime-story', note: 'Our bedtime stories are still my favorite tiny world to read to you.', sticker: '📖✨' },
  { id: 'talking-god', note: 'Even your “talking to god” updates somehow become my cutest notifications.', sticker: '🚪⭐' },
  { id: 'exam-power', note: 'Exam mode activated: you are brilliant, steady, and unstoppable.', sticker: '✏️🌟' },
  { id: 'after-exam-date', note: 'Final memory unlocked: let’s plan our after-exam date adventure.', sticker: '📅💘' }
];

export const levels: Level[] = [
  {
    spawn: { x: 30, y: 250 },
    platforms: [{ x: 0, y: 320, w: 820, h: 40 }, { x: 120, y: 260, w: 140, h: 18 }, { x: 340, y: 220, w: 170, h: 18 }],
    tokens: [
      { x: 150, y: 225, w: 24, h: 24, ...notes[0] },
      { x: 390, y: 185, w: 24, h: 24, ...notes[1] }
    ],
    portal: { x: 760, y: 276, w: 40, h: 44 },
    moon: { x: 700, y: 20, w: 50, h: 50 },
    props: [{ x: 500, y: 282, w: 24, h: 24 }]
  },
  {
    spawn: { x: 20, y: 250 },
    platforms: [{ x: 0, y: 320, w: 820, h: 40 }, { x: 220, y: 260, w: 120, h: 18 }, { x: 480, y: 230, w: 150, h: 18 }],
    tokens: [
      { x: 250, y: 226, w: 24, h: 24, ...notes[2] },
      { x: 540, y: 196, w: 24, h: 24, ...notes[3] }
    ],
    portal: { x: 760, y: 276, w: 40, h: 44 },
    moon: { x: 700, y: 20, w: 50, h: 50 },
    props: [{ x: 370, y: 282, w: 24, h: 24 }]
  },
  {
    spawn: { x: 20, y: 250 },
    platforms: [{ x: 0, y: 320, w: 820, h: 40 }, { x: 200, y: 250, w: 120, h: 18 }, { x: 420, y: 210, w: 120, h: 18 }, { x: 650, y: 170, w: 120, h: 18 }],
    tokens: [{ x: 680, y: 138, w: 24, h: 24, ...notes[4] }],
    portal: { x: 760, y: 126, w: 40, h: 44 },
    moon: { x: 700, y: 20, w: 50, h: 50 },
    props: [{ x: 125, y: 282, w: 24, h: 24 }]
  }
];
