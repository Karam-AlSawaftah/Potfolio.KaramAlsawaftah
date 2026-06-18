declare module "butterchurn" {
  export interface ButterchurnVisualizer {
    connectAudio(analyserNode: AnalyserNode): void;
    loadPreset(preset: object, blendTime: number): void;
    setRendererSize(width: number, height: number): void;
    render(): void;
  }

  interface ButterchurnStatic {
    createVisualizer(
      audioContext: AudioContext,
      canvas: HTMLCanvasElement,
      options: { width: number; height: number }
    ): ButterchurnVisualizer;
  }

  // butterchurn CJS exports { default: Visualizer }
  const butterchurn: { default: ButterchurnStatic };
  export default butterchurn;
}

declare module "butterchurn-presets" {
  interface ButterchurnPresets {
    getPresets(): Record<string, object>;
  }
  const butterchurnPresets: ButterchurnPresets;
  export default butterchurnPresets;
}
