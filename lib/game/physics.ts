import { Player, Rect } from './entities';

export const intersects = (a: Rect, b: Rect) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;

export function updatePlayer(player: Player, platforms: Rect[]) {
  player.vy += 0.45;
  player.x += player.vx;
  player.y += player.vy;
  player.vx *= 0.82;
  player.onGround = false;

  for (const p of platforms) {
    if (!intersects(player, p)) continue;
    const overlapBottom = p.y + p.h - player.y;
    const overlapTop = player.y + player.h - p.y;
    if (overlapTop < overlapBottom && player.vy >= 0) {
      player.y = p.y - player.h;
      player.vy = 0;
      player.onGround = true;
    } else if (overlapBottom < overlapTop && player.vy < 0) {
      player.y = p.y + p.h;
      player.vy = 0;
    }
  }
}
