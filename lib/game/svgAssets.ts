const dataUri = (svg: string) => `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

export const svgAssets = {
  player: dataUri(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' fill='none'/><circle cx='16' cy='16' r='11' fill='#ffd9ec'/><circle cx='12' cy='14' r='1.5' fill='#3f325c'/><circle cx='20' cy='14' r='1.5' fill='#3f325c'/><path d='M11 19c2 3 8 3 10 0' stroke='#3f325c' stroke-width='1.7' fill='none' stroke-linecap='round'/><circle cx='24' cy='20' r='5' fill='#ff7ea8'/><path d='M24 17l2 2-2 2-2-2z' fill='#fff'/><rect x='7' y='4' width='4' height='6' rx='2' fill='#ffd9ec'/><rect x='21' y='4' width='4' height='6' rx='2' fill='#ffd9ec'/></svg>`),
  token: dataUri(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><circle cx='12' cy='12' r='9' fill='#fff7b0'/><path d='M12 4l2.2 4.5 4.8.7-3.5 3.4.8 4.8L12 15.7 7.7 17.4l.8-4.8L5 9.2l4.8-.7z' fill='#ffc73a'/><circle cx='17' cy='7' r='2' fill='#ff77af'/></svg>`),
  platform: dataUri(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 16'><rect width='64' height='16' rx='6' fill='#c8d8ff'/><rect y='12' width='64' height='4' fill='#a9c0f0'/></svg>`),
  moon: dataUri(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'><circle cx='24' cy='24' r='14' fill='#fff6be'/><circle cx='30' cy='20' r='10' fill='#f5e7ff'/></svg>`),
  portal: dataUri(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 44'><rect x='4' y='4' width='32' height='36' rx='8' fill='#ffd6ee'/><rect x='10' y='10' width='20' height='24' rx='6' fill='#b9f4ff'/><path d='M20 14v16M12 22h16' stroke='#6f5da8' stroke-width='2'/></svg>`),
  prop: dataUri(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><rect x='2' y='7' width='20' height='14' rx='3' fill='#fff'/><rect x='4' y='9' width='16' height='10' fill='#ffd9ec'/></svg>`)
};

export async function loadAssets() {
  const entries = await Promise.all(Object.entries(svgAssets).map(async ([k, src]) => {
    const img = new Image();
    img.src = src;
    await img.decode();
    return [k, img] as const;
  }));
  return Object.fromEntries(entries) as Record<keyof typeof svgAssets, HTMLImageElement>;
}
