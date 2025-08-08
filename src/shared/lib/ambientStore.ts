import {
  readLocalStorage,
  storageKeys,
  writeLocalStorage,
  MixerState,
} from "./storage";
import { setAmbientVolumes, setEnabledAmbient } from "./ambientEngine";

type Listener = () => void;

class AmbientStore {
  private listeners = new Set<Listener>();
  private state: MixerState = readLocalStorage<MixerState>(storageKeys.mixer, {
    rain: 0.3,
    stream: 0.2,
    bowls: 0.1,
    enabled: false,
  });

  getState(): MixerState {
    return this.state;
  }

  subscribe(fn: Listener) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  private notify() {
    for (const fn of this.listeners) fn();
  }

  async setEnabled(enabled: boolean) {
    this.state = { ...this.state, enabled };
    writeLocalStorage(storageKeys.mixer, this.state);
    await setEnabledAmbient(enabled, {
      rain: this.state.rain,
      stream: this.state.stream,
      bowls: this.state.bowls,
    });
    this.notify();
  }

  setVolume(key: keyof Omit<MixerState, "enabled">, value: number) {
    this.state = { ...this.state, [key]: value };
    writeLocalStorage(storageKeys.mixer, this.state);
    if (this.state.enabled) {
      setAmbientVolumes({
        rain: this.state.rain,
        stream: this.state.stream,
        bowls: this.state.bowls,
      });
    }
    this.notify();
  }
}

export const ambientStore = new AmbientStore();
