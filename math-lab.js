import { curvePoint, curvePeriod, curvePoints } from "./math.js";

export function initMathLab() {
  const svg = document.querySelector("#math-canvas");
  if (!svg) return;
  const curve = svg.querySelector("#math-curve");
  const dot = svg.querySelector("#math-point");
  const a = document.querySelector("#frequency-a");
  const b = document.querySelector("#frequency-b");
  const phase = document.querySelector("#curve-phase");
  const trace = document.querySelector("#curve-trace");
  const play = document.querySelector("#animate-curve");
  const presets = [...document.querySelectorAll("[data-curve]")];
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  let frame = 0, running = false, started = 0, progress = 0;
  function position() {
    const p = curvePoint(Number(a.value), Number(b.value), Number(phase.value), progress * curvePeriod(Number(a.value), Number(b.value)));
    dot.setAttribute("cx", p.x);
    dot.setAttribute("cy", p.y);
    trace.value = String(Math.round(progress * 100));
    document.querySelector("#curve-trace-value").textContent = `${Math.round(progress * 100)}%`;
  }
  function stop() {
    running = false;
    cancelAnimationFrame(frame);
    play.textContent = "Trace the curve";
    play.setAttribute("aria-pressed", "false");
  }
  function render() {
    const points = curvePoints(Number(a.value), Number(b.value), Number(phase.value));
    curve.setAttribute("points", points.map(p => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(" "));
    for (const input of [a, b, phase]) document.querySelector(`#${input.id}-value`).textContent = `${input.value}${input === phase ? "°" : ""}`;
    document.querySelector("#equation-a").textContent = a.value;
    document.querySelector("#equation-b").textContent = b.value;
    document.querySelector("#equation-phase").textContent = phase.value;
    document.querySelector("#curve-ratio").textContent = `Frequency ratio ${a.value}:${b.value}`;
    svg.querySelector("#curve-title").textContent = `Lissajous curve: frequencies ${a.value} and ${b.value}, phase ${phase.value} degrees`;
    presets.forEach(button => button.setAttribute("aria-pressed", String(button.dataset.curve === `${a.value},${b.value},${phase.value}`)));
    position();
  }
  for (const input of [a, b, phase]) input.addEventListener("input", () => { stop(); progress = 0; render(); });
  trace.addEventListener("input", () => { stop(); progress = Number(trace.value) / 100; position(); });
  presets.forEach(button => button.addEventListener("click", () => {
    stop();
    [a.value, b.value, phase.value] = button.dataset.curve.split(",");
    progress = 0;
    render();
  }));
  function tick(now) {
    progress = ((now - started) / 10000) % 1;
    position();
    if (running) frame = requestAnimationFrame(tick);
  }
  play.addEventListener("click", () => {
    if (running) { stop(); return; }
    running = true;
    started = performance.now() - progress * 10000;
    play.textContent = "Pause trace";
    play.setAttribute("aria-pressed", "true");
    frame = requestAnimationFrame(tick);
  });
  reducedMotion.addEventListener("change", stop);
  document.addEventListener("visibilitychange", () => { if (document.hidden) stop(); });
  addEventListener("pagehide", stop);
  document.querySelector("#math-controls").hidden = false;
  render();
}
