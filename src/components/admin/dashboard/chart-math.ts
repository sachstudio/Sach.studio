/** The top of the chart's axis: the tallest bar rounded up to a multiple of four (at least four), so four gridlines land on whole numbers. */
export function axisMax(counts: number[]): number {
  const tallest = Math.max(0, ...counts);
  return Math.max(4, Math.ceil(tallest / 4) * 4);
}

/** The values of the five gridlines, from zero to the top of the axis. */
export function axisTicks(max: number): number[] {
  return [0, 1, 2, 3, 4].map((step) => (max / 4) * step);
}

/** How much of the chart's height a bar fills, as a percentage between 0 and 100. */
export function barHeightPercent(count: number, max: number): number {
  if (max <= 0) return 0;
  return Math.min(100, Math.max(0, (count / max) * 100));
}
