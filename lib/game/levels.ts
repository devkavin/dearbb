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
    platforms: [
      { x: 0, y: 320, w: 820, h: 40 },
      { x: 110, y: 268, w: 170, h: 18 },
      { x: 310, y: 238, w: 160, h: 18 },
      { x: 500, y: 218, w: 150, h: 18 }
    ],
    tokens: [
      { x: 165, y: 233, w: 24, h: 24, ...notes[0] },
      { x: 350, y: 203, w: 24, h: 24, ...notes[1] }
    ],
    portal: { x: 760, y: 276, w: 40, h: 44 },
    moon: { x: 700, y: 20, w: 50, h: 50 },
    props: [{ x: 500, y: 282, w: 24, h: 24 }]
  },
  {
    spawn: { x: 20, y: 250 },
    platforms: [
      { x: 0, y: 320, w: 820, h: 40 },
      { x: 190, y: 270, w: 150, h: 18 },
      { x: 390, y: 244, w: 130, h: 18 },
      { x: 550, y: 220, w: 150, h: 18 }
    ],
    tokens: [
      { x: 230, y: 235, w: 24, h: 24, ...notes[2] },
      { x: 585, y: 186, w: 24, h: 24, ...notes[3] }
    ],
    portal: { x: 760, y: 276, w: 40, h: 44 },
    moon: { x: 700, y: 20, w: 50, h: 50 },
    props: [{ x: 370, y: 282, w: 24, h: 24 }]
  },
  {
    spawn: { x: 20, y: 250 },
    platforms: [
      { x: 0, y: 320, w: 820, h: 40 },
      { x: 170, y: 270, w: 140, h: 18 },
      { x: 350, y: 238, w: 140, h: 18 },
      { x: 530, y: 206, w: 130, h: 18 },
      { x: 670, y: 176, w: 120, h: 18 }
    ],
    tokens: [{ x: 710, y: 144, w: 24, h: 24, ...notes[4] }],
    portal: { x: 760, y: 126, w: 40, h: 44 },
    moon: { x: 700, y: 20, w: 50, h: 50 },
    props: [{ x: 125, y: 282, w: 24, h: 24 }]
  }
];
