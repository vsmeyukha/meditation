type Json = unknown

export function readLocalStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function writeLocalStorage<T extends Json>(key: string, value: T): void {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // ignore
  }
}

export const storageKeys = {
  moodLogs: "meditation.moodLogs",
  mixer: "meditation.mixer",
  streak: "meditation.streak",
  intention: "meditation.intention",
} as const

export interface MoodLogEntry {
  id: string
  date: string // ISO
  mood: "bad" | "okay" | "good" | "great"
  energy: "low" | "medium" | "high"
}

export interface MixerState {
  rain: number
  stream: number
  bowls: number
  enabled: boolean
}

export interface StreakState {
  lastPracticeISO?: string
  streakDays: number
}

export function logPractice(): void {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const prev = readLocalStorage<StreakState>(storageKeys.streak, { streakDays: 0 })
  let streakDays = prev.streakDays ?? 0
  const prevDate = prev.lastPracticeISO ? new Date(prev.lastPracticeISO) : undefined
  if (!prevDate) {
    streakDays = 1
  } else {
    const prevDay = new Date(prevDate.getFullYear(), prevDate.getMonth(), prevDate.getDate())
    const diffDays = Math.round((today.getTime() - prevDay.getTime()) / (1000 * 60 * 60 * 24))
    if (diffDays === 0) {
      streakDays = streakDays
    } else if (diffDays === 1) {
      streakDays = streakDays + 1
    } else if (diffDays > 1) {
      streakDays = 1
    }
  }
  writeLocalStorage(storageKeys.streak, { streakDays, lastPracticeISO: now.toISOString() })
}


