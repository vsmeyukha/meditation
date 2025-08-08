type ChannelName = "rain" | "stream" | "bowls"

interface EngineState {
  ctx: AudioContext
  master: GainNode
  channels: Record<ChannelName, { gain: GainNode }>
  nodes: {
    rain?: AudioBufferSourceNode
    stream?: AudioBufferSourceNode
    bowls?: OscillatorNode[]
    bowlsBuf?: AudioBufferSourceNode
    bowlsGain?: GainNode
  }
  samples: Partial<Record<ChannelName, AudioBuffer>>
}

let engine: EngineState | null = null

function createContext(): AudioContext {
  const Ctx: typeof AudioContext | undefined = (window as unknown as { AudioContext?: typeof AudioContext }).AudioContext
  const WebkitCtx: typeof AudioContext | undefined = (window as unknown as { webkitAudioContext?: typeof AudioContext })
    .webkitAudioContext
  const Impl = Ctx ?? WebkitCtx
  if (!Impl) throw new Error("AudioContext not supported")
  const ctx = new Impl()
  return ctx
}

function createNoiseBuffer(ctx: AudioContext, lengthSeconds: number): AudioBuffer {
  const sampleRate = ctx.sampleRate
  const buffer = ctx.createBuffer(1, sampleRate * lengthSeconds, sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < data.length; i++) {
    data[i] = Math.random() * 2 - 1 // white noise
  }
  return buffer
}

function makePinkish(ctx: AudioContext, source: AudioNode): AudioNode {
  // Use gentle lowpass to soften
  const lowpass = ctx.createBiquadFilter()
  lowpass.type = "lowpass"
  lowpass.frequency.value = 2000
  source.connect(lowpass)
  return lowpass
}

function makeBrownish(ctx: AudioContext, source: AudioNode): AudioNode {
  const lowpass = ctx.createBiquadFilter()
  lowpass.type = "lowpass"
  lowpass.frequency.value = 800
  source.connect(lowpass)
  return lowpass
}

function ensureEngine(): EngineState {
  if (engine) return engine
  const ctx = createContext()
  const master = ctx.createGain()
  master.gain.value = 0.9
  master.connect(ctx.destination)
  const channels: EngineState["channels"] = {
    rain: { gain: ctx.createGain() },
    stream: { gain: ctx.createGain() },
    bowls: { gain: ctx.createGain() },
  }
  channels.rain.gain.connect(master)
  channels.stream.gain.connect(master)
  channels.bowls.gain.connect(master)
  engine = { ctx, master, channels, nodes: {}, samples: {} }
  return engine
}

async function loadSample(name: ChannelName): Promise<AudioBuffer | null> {
  const e = ensureEngine()
  if (e.samples[name]) return e.samples[name]!
  const exts = ["mp3", "wav", "ogg"]
  for (const ext of exts) {
    try {
      const res = await fetch(`/ambient/${name}.${ext}`)
      if (!res.ok) continue
      const buf = await res.arrayBuffer()
      const audio = await e.ctx.decodeAudioData(buf)
      e.samples[name] = audio
      return audio
    } catch {
      // try next ext
    }
  }
  return null
}

export async function setEnabledAmbient(enabled: boolean, volumes: Record<ChannelName, number>): Promise<void> {
  const e = ensureEngine()
  if (enabled) {
    await e.ctx.resume()
    // Rain: try sample, fallback to brown-ish noise
    if (!e.nodes.rain) {
      const sample = await loadSample("rain")
      const src = e.ctx.createBufferSource()
      src.buffer = sample ?? createNoiseBuffer(e.ctx, 2)
      src.loop = true
      const shaped = sample ? src : makeBrownish(e.ctx, src)
      shaped.connect(e.channels.rain.gain)
      src.start()
      e.nodes.rain = src
    }
    // Stream: try sample, fallback to pink-ish noise
    if (!e.nodes.stream) {
      const sample = await loadSample("stream")
      const src = e.ctx.createBufferSource()
      src.buffer = sample ?? createNoiseBuffer(e.ctx, 2)
      src.loop = true
      const shaped = sample ? src : makePinkish(e.ctx, src)
      shaped.connect(e.channels.stream.gain)
      src.start()
      e.nodes.stream = src
    }
    // Bowls: sample preferred, then synthesized chord
    if (!e.nodes.bowlsGain) {
      const g = e.ctx.createGain()
      g.gain.value = 0.0
      g.connect(e.channels.bowls.gain)
      e.nodes.bowlsGain = g
    }
    if (!e.nodes.bowls && !e.nodes.bowlsBuf) {
      const sample = await loadSample("bowls")
      if (sample) {
        const src = e.ctx.createBufferSource()
        src.buffer = sample
        src.loop = true
        src.connect(e.nodes.bowlsGain!)
        src.start()
        e.nodes.bowlsBuf = src
      } else {
        const base = 432 // Hz
        const osc1 = e.ctx.createOscillator()
        osc1.type = "sine"
        osc1.frequency.value = base
        osc1.connect(e.nodes.bowlsGain!)
        const osc2 = e.ctx.createOscillator()
        osc2.type = "sine"
        osc2.frequency.value = base * 1.5
        osc2.detune.value = 2
        osc2.connect(e.nodes.bowlsGain!)
        const osc3 = e.ctx.createOscillator()
        osc3.type = "sine"
        osc3.frequency.value = base * 2
        osc3.detune.value = -3
        osc3.connect(e.nodes.bowlsGain!)
        osc1.start()
        osc2.start()
        osc3.start()
        e.nodes.bowls = [osc1, osc2, osc3]
      }
    }
    setAmbientVolumes(volumes)
  } else {
    // stop sources
    if (e.nodes.rain) {
      try { e.nodes.rain.stop() } catch {}
      e.nodes.rain.disconnect()
      e.nodes.rain = undefined
    }
    if (e.nodes.stream) {
      try { e.nodes.stream.stop() } catch {}
      e.nodes.stream.disconnect()
      e.nodes.stream = undefined
    }
    if (e.nodes.bowls) {
      for (const o of e.nodes.bowls) {
        try { o.stop() } catch {}
        o.disconnect()
      }
      e.nodes.bowls = undefined
    }
    if (e.nodes.bowlsBuf) {
      try { e.nodes.bowlsBuf.stop() } catch {}
      e.nodes.bowlsBuf.disconnect()
      e.nodes.bowlsBuf = undefined
    }
  }
}

export function setAmbientVolumes(volumes: Record<ChannelName, number>): void {
  const e = ensureEngine()
  e.channels.rain.gain.gain.value = clamp(volumes.rain)
  e.channels.stream.gain.gain.value = clamp(volumes.stream)
  const bowlsTarget = clamp(volumes.bowls)
  if (e.nodes.bowlsGain) {
    e.nodes.bowlsGain.gain.linearRampToValueAtTime(bowlsTarget, e.ctx.currentTime + 0.2)
  }
}

function clamp(v: number): number {
  if (Number.isNaN(v)) return 0
  return Math.max(0, Math.min(1, v))
}


