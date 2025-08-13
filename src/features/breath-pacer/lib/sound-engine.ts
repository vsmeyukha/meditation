export class SoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain!: GainNode;
  private src!: AudioBufferSourceNode;
  private breathGain!: GainNode;

  async init() {
    if (this.ctx) return;
    this.ctx = new (window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext)();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0; // начнём с тишины (для fade-in)
    this.masterGain.connect(this.ctx.destination);

    this.breathGain = this.ctx.createGain();
    this.breathGain.gain.value = 1;
    this.breathGain.connect(this.masterGain);
  }

  async loadAndLoop(url: string) {
    if (!this.ctx) throw new Error("Call init() after user gesture");
    const res = await fetch(url);
    const arr = await res.arrayBuffer();
    const buf = await this.ctx.decodeAudioData(arr);

    this.src = this.ctx.createBufferSource();
    this.src.buffer = buf;
    this.src.loop = true;
    this.src.connect(this.breathGain);
  }

  start(fadeSec = 1.5) {
    if (!this.ctx || !this.src) return;
    const t = this.ctx.currentTime;
    this.src.start(t);
    // fade-in
    this.masterGain.gain.setValueAtTime(0, t);
    this.masterGain.gain.linearRampToValueAtTime(1, t + fadeSec);
  }

  stop(fadeSec = 1.0) {
    if (!this.ctx || !this.src) return;
    const t = this.ctx.currentTime;
    // fade-out
    this.masterGain.gain.cancelScheduledValues(t);
    this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, t);
    this.masterGain.gain.linearRampToValueAtTime(0, t + fadeSec);
    this.src.stop(t + fadeSec + 0.05);
  }

  /** Синхронизация громкости с дыханием */
  scheduleBreathCycle(params: {
    inhale: number;
    holdTop?: number;
    exhale: number;
    holdBottom?: number;
  }) {
    if (!this.ctx) return;
    const { inhale, holdTop = 0, exhale, holdBottom = 0 } = params;
    const t0 = this.ctx.currentTime;
    const cycle = inhale + holdTop + exhale + holdBottom;

    // Запланируем 4 шага огибающей
    const g = this.breathGain.gain;
    g.cancelScheduledValues(t0);
    g.setValueAtTime(0.4, t0); // hold bottom - самый тихий уровень
    g.linearRampToValueAtTime(1.0, t0 + inhale); // вдох
    g.setValueAtTime(1.0, t0 + inhale + holdTop); // верхняя пауза
    g.linearRampToValueAtTime(0.4, t0 + inhale + holdTop + exhale); // выдох
    g.setValueAtTime(0.4, t0 + cycle); // нижняя пауза (hold bottom)

    // Зациклить расписание точно через время цикла
    // Используем точное время AudioContext для избежания дрифта
    setTimeout(() => this.scheduleBreathCycle(params), cycle * 1000);
  }
}
