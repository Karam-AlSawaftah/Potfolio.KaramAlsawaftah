import { useEffect, useRef, useState } from "react";

export type BootPhase = "post" | "loading" | "logo" | "transition" | "done";

const PHASE_DURATIONS: Record<Exclude<BootPhase, "done">, number> = {
  post: 2200,
  loading: 1800,
  logo: 1100,
  transition: 500,
};

const PHASE_ORDER: BootPhase[] = ["post", "loading", "logo", "transition", "done"];

export function useBootSequence(skip: boolean) {
  const [phase, setPhase] = useState<BootPhase>(skip ? "done" : "post");
  const [progress, setProgress] = useState(0);
  const timers = useRef<number[]>([]);

  const clearTimers = () => {
    timers.current.forEach((t) => clearTimeout(t));
    timers.current = [];
    const interval = progressInterval.current;
    if (interval) {
      clearInterval(interval);
      progressInterval.current = null;
    }
  };

  const progressInterval = useRef<number | null>(null);

  useEffect(() => {
    if (skip || phase === "done") return;

    if (phase === "loading") {
      setProgress(0);
      const start = Date.now();
      progressInterval.current = window.setInterval(() => {
        const elapsed = Date.now() - start;
        const pct = Math.min(100, (elapsed / PHASE_DURATIONS.loading) * 100);
        setProgress(pct);
        if (pct >= 100 && progressInterval.current) {
          clearInterval(progressInterval.current);
          progressInterval.current = null;
        }
      }, 50);
    }

    const duration = PHASE_DURATIONS[phase as Exclude<BootPhase, "done">];
    const timer = window.setTimeout(() => {
      const idx = PHASE_ORDER.indexOf(phase);
      setPhase(PHASE_ORDER[idx + 1]);
    }, duration);
    timers.current.push(timer);

    return () => {
      clearTimers();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, skip]);

  const skipBoot = () => {
    clearTimers();
    setProgress(100);
    setPhase("done");
  };

  return { phase, progress, skipBoot };
}
