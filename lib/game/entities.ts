export type Rect = { x: number; y: number; w: number; h: number };

export type Player = Rect & { vx: number; vy: number; onGround: boolean };
export type Token = Rect & { id: string; note: string; sticker: string; collected?: boolean };
export type Level = { platforms: Rect[]; tokens: Token[]; portal: Rect; moon: Rect; props: Rect[]; spawn: { x: number; y: number } };

export const createPlayer = (x: number, y: number): Player => ({ x, y, w: 32, h: 32, vx: 0, vy: 0, onGround: false });
