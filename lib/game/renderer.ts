import { Level, Player } from './entities';

export function render(ctx: CanvasRenderingContext2D, level: Level, player: Player, assets: Record<string, HTMLImageElement>, width: number, height: number) {
  ctx.clearRect(0, 0, width, height);
  const bg = ctx.createLinearGradient(0, 0, 0, height);
  bg.addColorStop(0, '#d8f3ff');
  bg.addColorStop(0.5, '#f7e9ff');
  bg.addColorStop(1, '#ffe7f1');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  const haze = ctx.createRadialGradient(width * 0.72, 60, 10, width * 0.72, 60, 240);
  haze.addColorStop(0, 'rgba(255,255,255,0.95)');
  haze.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = haze;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  [
    [80, 52, 40],
    [180, 80, 28],
    [320, 46, 36],
    [470, 72, 26],
    [620, 58, 32]
  ].forEach(([x, y, r]) => {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.arc(x + r * 0.8, y + 4, r * 0.7, 0, Math.PI * 2);
    ctx.arc(x - r * 0.8, y + 5, r * 0.65, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  for (let i = 0; i < 14; i += 1) {
    const x = 20 + i * 58;
    const y = 20 + (i % 3) * 14;
    ctx.beginPath();
    ctx.arc(x, y, 1.8, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.drawImage(assets.moon, level.moon.x, level.moon.y, level.moon.w, level.moon.h);
  level.platforms.forEach((p) => ctx.drawImage(assets.platform, p.x, p.y, p.w, p.h));
  level.props.forEach((p) => ctx.drawImage(assets.prop, p.x, p.y, p.w, p.h));
  level.tokens.filter((t) => !t.collected).forEach((t) => ctx.drawImage(assets.token, t.x, t.y, t.w, t.h));
  ctx.drawImage(assets.portal, level.portal.x, level.portal.y, level.portal.w, level.portal.h);
  ctx.drawImage(assets.player, player.x, player.y, player.w, player.h);
}
