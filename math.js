/** Lissajous curves: x = sin(a t + phase), y = sin(b t). */
export function curvePoint(a, b, phaseDegrees, t) {
  if (![a, b].every(n => Number.isInteger(n) && n >= 1 && n <= 9) || !Number.isFinite(phaseDegrees) || !Number.isFinite(t)) {
    throw new RangeError("Use integer frequencies from 1 to 9 and finite phase and time.");
  }
  return { x: 300 + 165 * Math.sin(a * t + phaseDegrees * Math.PI / 180), y: 200 - 165 * Math.sin(b * t) };
}
export function curvePeriod(a, b) {
  curvePoint(a, b, 0, 0);
  let x = a, y = b;
  while (y) [x, y] = [y, x % y];
  return 2 * Math.PI / x;
}
export function curvePoints(a, b, phaseDegrees, samples = 1200) {
  if (!Number.isInteger(samples) || samples < 60 || samples > 5000) throw new RangeError("Use 60–5000 samples.");
  const period = curvePeriod(a, b);
  return Array.from({ length: samples + 1 }, (_, i) => curvePoint(a, b, phaseDegrees, i / samples * period));
}
