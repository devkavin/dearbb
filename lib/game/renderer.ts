import { Level, Player } from './entities';

export function render(ctx: CanvasRenderingContext2D, level: Level, player: Player, assets: Record<string, HTMLImageElement>, width: number, height: number) {
  ctx.clearRect(0, 0, width, height);
  const bg = ctx.createLinearGradient(0, 0, 0, height);
  bg.addColorStop(0, '#dff4ff');
  bg.addColorStop(1, '#fbe2f2');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  ctx.drawImage(assets.moon, level.moon.x, level.moon.y, level.moon.w, level.moon.h);
  level.platforms.forEach((p) => ctx.drawImage(assets.platform, p.x, p.y, p.w, p.h));
  level.props.forEach((p) => ctx.drawImage(assets.prop, p.x, p.y, p.w, p.h));
  level.tokens.filter((t) => !t.collected).forEach((t) => ctx.drawImage(assets.token, t.x, t.y, t.w, t.h));
  ctx.drawImage(assets.portal, level.portal.x, level.portal.y, level.portal.w, level.portal.h);
  ctx.drawImage(assets.player, player.x, player.y, player.w, player.h);
}
