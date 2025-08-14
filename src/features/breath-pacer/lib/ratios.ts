export type Ratios = {
  inhale: number;
  holdTop: number;
  exhale: number;
  holdBottom: number;
};

export type Profile = "keep" | "box" | "coherent" | "relax" | "478";

export const normalize = (r: Ratios): Ratios => {
  const s = r.inhale + r.holdTop + r.exhale + r.holdBottom || 1;
  return {
    inhale: r.inhale / s,
    holdTop: r.holdTop / s,
    exhale: r.exhale / s,
    holdBottom: r.holdBottom / s,
  };
};

export function ratiosForProfile(profile: Profile, current: Ratios): Ratios {
  switch (profile) {
    case "box":
      return normalize({ inhale: 1, holdTop: 1, exhale: 1, holdBottom: 1 });
    case "coherent":
      return normalize({ inhale: 1, holdTop: 0, exhale: 1, holdBottom: 0 });
    case "relax":
      return normalize({ inhale: 2, holdTop: 0.5, exhale: 3, holdBottom: 0.5 });
    case "478":
      return normalize({ inhale: 4, holdTop: 7, exhale: 8, holdBottom: 0 });
    case "keep":
    default:
      return normalize(current);
  }
}

export function durationsFromCycle(totalSec: number, ratios: Ratios) {
  const clamp = (x: number) =>
    Math.max(0.3, Math.min(60, Math.round(x * 10) / 10));
  return {
    inhaleSec: clamp(totalSec * ratios.inhale),
    holdTopSec: clamp(totalSec * ratios.holdTop),
    exhaleSec: clamp(totalSec * ratios.exhale),
    holdBottomSec: clamp(totalSec * ratios.holdBottom),
  };
}

export function currentRatiosFromDurations(durations: {
  inhaleSec: number;
  holdTopSec: number;
  exhaleSec: number;
  holdBottomSec: number;
}): Ratios {
  const total =
    durations.inhaleSec +
    durations.holdTopSec +
    durations.exhaleSec +
    durations.holdBottomSec;
  return {
    inhale: durations.inhaleSec / total,
    holdTop: durations.holdTopSec / total,
    exhale: durations.exhaleSec / total,
    holdBottom: durations.holdBottomSec / total,
  };
}
