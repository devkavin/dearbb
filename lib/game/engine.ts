export function startLoop(step: (dt: number) => void) {
  let frame = 0;
  let last = performance.now();
  const tick = (time: number) => {
    const dt = Math.min((time - last) / 16.67, 2);
    last = time;
    step(dt);
    frame = requestAnimationFrame(tick);
  };
  frame = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(frame);
}
