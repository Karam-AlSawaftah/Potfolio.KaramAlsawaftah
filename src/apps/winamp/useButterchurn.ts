import { useRef, useEffect, useCallback, useState } from "react";
import type { RefObject } from "react";
import _butterchurnLib from "butterchurn";
import _butterchurnPresets from "butterchurn-presets";
import type { ButterchurnVisualizer } from "butterchurn";

// butterchurn's CJS bundle exports { default: Visualizer }.
// Handle both Vite interop patterns: unwrapped (Visualizer) or wrapped ({ default: Visualizer }).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Butterchurn: { createVisualizer: (...args: any[]) => ButterchurnVisualizer } =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ((_butterchurnLib as any).default ?? _butterchurnLib) as any;

// butterchurn-presets exports the class directly (module.exports = PresetClass).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const butterchurnPresets: { getPresets(): Record<string, object> } =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (_butterchurnPresets as any);

const BLEND_TIME = 2.7;
const CYCLE_MS   = 30_000;

let cachedPresets: [string, object][] | null = null;
function getPresets(): [string, object][] {
  if (!cachedPresets) cachedPresets = Object.entries(butterchurnPresets.getPresets());
  return cachedPresets;
}

export interface ButterchurnControls {
  prevPreset:   () => void;
  nextPreset:   () => void;
  presetName:   string;
  notifyResize: (w: number, h: number) => void;
}

export function useButterchurn(
  canvasRef:    RefObject<HTMLCanvasElement | null>,
  analyserNode: AnalyserNode | null,
): ButterchurnControls {
  const vizRef         = useRef<ButterchurnVisualizer | null>(null);
  const rafRef         = useRef<number>(0);
  const cycleTimerRef  = useRef<ReturnType<typeof setInterval> | null>(null);
  const presetIndexRef = useRef(0);
  const [presetName, setPresetName] = useState("");

  const loadPresetAt = useCallback((index: number, blend = BLEND_TIME) => {
    const presets = getPresets();
    const i = ((index % presets.length) + presets.length) % presets.length;
    presetIndexRef.current = i;
    const [name, preset] = presets[i];
    vizRef.current?.loadPreset(preset, blend);
    setPresetName(name);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !analyserNode) return;

    // Guard: WebGL 2 required — check without creating a context on the canvas
    if (typeof WebGL2RenderingContext === "undefined") {
      console.warn("Butterchurn: WebGL 2 not supported.");
      return;
    }

    const rect = canvas.getBoundingClientRect();
    const w = Math.max(Math.round(rect.width),  1);
    const h = Math.max(Math.round(rect.height), 1);
    canvas.width  = w;
    canvas.height = h;

    let viz: ButterchurnVisualizer;
    try {
      viz = Butterchurn.createVisualizer(
        analyserNode.context as AudioContext,
        canvas,
        { width: w, height: h }
      );
    } catch (err) {
      console.error("Butterchurn init failed:", err);
      return;
    }

    viz.connectAudio(analyserNode);
    vizRef.current = viz;

    loadPresetAt(Math.floor(Math.random() * getPresets().length), 0);

    const loop = () => { rafRef.current = requestAnimationFrame(loop); viz.render(); };
    rafRef.current = requestAnimationFrame(loop);

    cycleTimerRef.current = setInterval(() => {
      loadPresetAt(presetIndexRef.current + 1);
    }, CYCLE_MS);

    return () => {
      cancelAnimationFrame(rafRef.current);
      if (cycleTimerRef.current) clearInterval(cycleTimerRef.current);
      vizRef.current = null;
    };
  }, [canvasRef, analyserNode, loadPresetAt]);

  const notifyResize = useCallback((w: number, h: number) => {
    const cw = Math.max(Math.round(w), 1);
    const ch = Math.max(Math.round(h), 1);
    if (canvasRef.current) { canvasRef.current.width = cw; canvasRef.current.height = ch; }
    vizRef.current?.setRendererSize(cw, ch);
  }, [canvasRef]);

  const prevPreset = useCallback(() => loadPresetAt(presetIndexRef.current - 1), [loadPresetAt]);
  const nextPreset = useCallback(() => loadPresetAt(presetIndexRef.current + 1), [loadPresetAt]);

  return { prevPreset, nextPreset, presetName, notifyResize };
}
