export function vibrate(pattern: number | number[]): void {
  if (typeof window === "undefined") return;
  if (navigator.vibrate) {
    navigator.vibrate(pattern);
  }
}
