import { Level, Player } from './entities';

export function render(ctx: CanvasRenderingContext2D, level: Level, player: Player, assets: Record<string, HTMLImageElement>, width: number, height: number) {
  ctx.clearRect(0, 0, width, height);

  const bg = ctx.createLinearGradient(0, 0, 0, height);
  bg.addColorStop(0, '#b8e5ff');
  bg.addColorStop(0.55, '#f2dfff');
  bg.addColorStop(1, '#ffcfe8');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  const haze = ctx.createRadialGradient(width * 0.68, 70, 8, width * 0.68, 70, 300);
  haze.addColorStop(0, 'rgba(255,255,255,0.95)');
  haze.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = haze;
  ctx.fillRect(0, 0, width, height);

  for (let i = 0; i < 24; i += 1) {
    const x = 20 + i * 36;
    const y = 24 + (i % 4) * 9;
    ctx.fillStyle = i % 5 === 0 ? 'rgba(255,246,182,0.9)' : 'rgba(255,255,255,0.9)';
    ctx.beginPath();
    ctx.arc(x, y, i % 5 === 0 ? 2.2 : 1.3, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.globalAlpha = 0.28;
  ctx.fillStyle = '#6f5da8';
  level.platforms.forEach((p) => {
    ctx.fillRect(p.x + 4, p.y + p.h - 2, p.w, 8);
  });
  ctx.globalAlpha = 1;

  ctx.drawImage(assets.moon, level.moon.x, level.moon.y, level.moon.w, level.moon.h);

  const time = performance.now() / 1000;
  const phase = (level.dragon.x + level.dragon.y) * 0.015;
  const driftX = Math.sin(time * 1.1 + phase) * 16;
  const flutterY = Math.sin(time * 2.6 + phase) * 7;
  const tilt = Math.sin(time * 2.2 + phase) * 0.08;
  const pulse = (Math.sin(time * 6.4 + phase) + 1) / 2;

  const dragonX = level.dragon.x + driftX;
  const dragonY = level.dragon.y + flutterY;
  const glowRadius = 38 + pulse * 16;
  const dragonGlow = ctx.createRadialGradient(dragonX + level.dragon.w / 2, dragonY + level.dragon.h / 2, 2, dragonX + level.dragon.w / 2, dragonY + level.dragon.h / 2, glowRadius);
  dragonGlow.addColorStop(0, 'rgba(162,255,218,0.62)');
  dragonGlow.addColorStop(1, 'rgba(162,255,218,0)');
  ctx.fillStyle = dragonGlow;
  ctx.fillRect(dragonX - 24, dragonY - 24, level.dragon.w + 48, level.dragon.h + 48);

  ctx.save();
  ctx.translate(dragonX + level.dragon.w / 2, dragonY + level.dragon.h / 2);
  ctx.rotate(tilt);
  const scale = 1 + pulse * 0.04;
  ctx.scale(scale, scale);
  ctx.drawImage(assets.dragon, -level.dragon.w / 2, -level.dragon.h / 2, level.dragon.w, level.dragon.h);
  ctx.restore();

  level.platforms.forEach((p) => ctx.drawImage(assets.platform, p.x, p.y, p.w, p.h));
  level.props.forEach((p) => ctx.drawImage(assets.prop, p.x, p.y, p.w, p.h));

  level.tokens.filter((t) => !t.collected).forEach((t) => {
    const glow = ctx.createRadialGradient(t.x + t.w / 2, t.y + t.h / 2, 2, t.x + t.w / 2, t.y + t.h / 2, 20);
    glow.addColorStop(0, 'rgba(255,241,177,0.88)');
    glow.addColorStop(1, 'rgba(255,241,177,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(t.x - 10, t.y - 10, t.w + 20, t.h + 20);
    ctx.drawImage(assets.token, t.x, t.y, t.w, t.h);
  });

  ctx.drawImage(assets.portal, level.portal.x, level.portal.y, level.portal.w, level.portal.h);

  const playerGlow = ctx.createRadialGradient(player.x + player.w / 2, player.y + player.h / 2, 4, player.x + player.w / 2, player.y + player.h / 2, 26);
  playerGlow.addColorStop(0, 'rgba(255,255,255,0.65)');
  playerGlow.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = playerGlow;
  ctx.fillRect(player.x - 12, player.y - 12, player.w + 24, player.h + 24);
  ctx.drawImage(assets.player, player.x, player.y, player.w, player.h);
}
