export function factorial(n: number): number {
  if (n < 0) return NaN;
  let f = 1;
  for (let i = 2; i <= n; i++) f *= i;
  return f;
}

export function choose(n: number, r: number): number {
  if (r < 0 || r > n) return 0;
  return Math.round(factorial(n) / (factorial(r) * factorial(n - r)));
}

export function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}

/** Renders a signed coefficient as a typographic string, e.g. −21 */
export function signed(v: number, digits = 0): string {
  const s = v.toFixed(digits);
  return v < 0 ? `−${Math.abs(Number(s)).toFixed(digits)}` : s;
}
