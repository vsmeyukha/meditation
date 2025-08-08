export type SoundName = "rain" | "stream" | "bowls" | "bell";

const audioCache = new Map<string, HTMLAudioElement>();

function getAudio(src: string): HTMLAudioElement {
  let a = audioCache.get(src);
  if (!a) {
    a = new Audio(src);
    a.loop = false;
    audioCache.set(src, a);
  }
  return a;
}

function ringBellTone(): void {
  try {
    const Ctx: typeof AudioContext | undefined = (
      window as unknown as { AudioContext?: typeof AudioContext }
    ).AudioContext;
    const WebkitCtx: typeof AudioContext | undefined = (
      window as unknown as { webkitAudioContext?: typeof AudioContext }
    ).webkitAudioContext;
    const Impl = Ctx ?? WebkitCtx;
    if (!Impl) return;
    const ctx = new Impl();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine";
    o.frequency.value = 880; // A5
    o.connect(g);
    g.connect(ctx.destination);
    const now = ctx.currentTime;
    g.gain.setValueAtTime(0.0001, now);
    g.gain.linearRampToValueAtTime(0.3, now + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
    o.start();
    o.stop(now + 1.3);
  } catch {
    // ignore
  }
}

export function playBell(): void {
  const a = getAudio("/bell.mp3");
  a.currentTime = 0;
  void a.play().catch(() => ringBellTone());
}

export function playLoop(
  name: Exclude<SoundName, "bell">,
  volume: number,
): HTMLAudioElement {
  const src = `/ambient/${name}.mp3`;
  const a = getAudio(src);
  a.loop = true;
  a.volume = Math.max(0, Math.min(1, volume));
  void a.play();
  return a;
}

export function stopAudio(a?: HTMLAudioElement): void {
  if (!a) return;
  try {
    a.pause();
  } catch {
    // ignore
  }
}
