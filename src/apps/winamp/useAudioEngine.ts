import { useRef, useState, useEffect, useCallback } from "react";

export type PlayerState = "idle" | "playing" | "paused" | "stopped";

export interface AudioEngine {
  playerState: PlayerState;
  trackName: string;
  currentTime: number;
  duration: number;
  volume: number;
  analyserNode: AnalyserNode | null;
  loadFile: (file: File) => void;
  play: () => Promise<void>;
  pause: () => void;
  stop: () => void;
  seek: (seconds: number) => void;
  setVolume: (v: number) => void;
}

export function useAudioEngine(): AudioEngine {
  const audioRef     = useRef<HTMLAudioElement | null>(null);
  const ctxRef       = useRef<AudioContext | null>(null);
  const sourceRef    = useRef<MediaElementAudioSourceNode | null>(null);
  const analyserRef  = useRef<AnalyserNode | null>(null);
  const objectUrlRef = useRef<string | null>(null);

  const [playerState,  setPlayerState]  = useState<PlayerState>("idle");
  const [trackName,    setTrackName]    = useState("");
  const [currentTime,  setCurrentTime]  = useState(0);
  const [duration,     setDuration]     = useState(0);
  const [volume,       setVolumeState]  = useState(0.8);
  const [analyserNode, setAnalyserNode] = useState<AnalyserNode | null>(null);

  useEffect(() => {
    const audio = new Audio();
    audio.crossOrigin = "anonymous";
    audio.preload = "auto";
    audioRef.current = audio;

    const onTime     = () => setCurrentTime(audio.currentTime);
    const onDuration = () => setDuration(audio.duration || 0);
    const onEnded    = () => setPlayerState("stopped");
    audio.addEventListener("timeupdate",     onTime);
    audio.addEventListener("durationchange", onDuration);
    audio.addEventListener("ended",          onEnded);

    return () => {
      audio.removeEventListener("timeupdate",     onTime);
      audio.removeEventListener("durationchange", onDuration);
      audio.removeEventListener("ended",          onEnded);
      audio.pause();
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
      ctxRef.current?.close();
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  // Guard: MediaElementAudioSourceNode can only be created once per <audio> element
  const ensureContext = useCallback(() => {
    if (ctxRef.current) return ctxRef.current;
    const ctx      = new AudioContext();
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 2048;
    const source   = ctx.createMediaElementSource(audioRef.current!);
    source.connect(analyser);
    analyser.connect(ctx.destination);
    ctxRef.current      = ctx;
    sourceRef.current   = source;
    analyserRef.current = analyser;
    setAnalyserNode(analyser);
    return ctx;
  }, []);

  const loadFile = useCallback((file: File) => {
    const audio = audioRef.current!;
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    audio.pause();
    const url = URL.createObjectURL(file);
    objectUrlRef.current = url;
    audio.src = url;
    setTrackName(file.name.replace(/\.[^/.]+$/, ""));
    setCurrentTime(0);
    setDuration(0);
    setPlayerState("stopped");
    ensureContext();
  }, [ensureContext]);

  const play = useCallback(async () => {
    const audio = audioRef.current!;
    if (!audio.src) return;
    const ctx = ensureContext();
    if (ctx.state === "suspended") await ctx.resume();
    await audio.play().catch(() => {});
    setPlayerState("playing");
  }, [ensureContext]);

  const pause = useCallback(() => {
    audioRef.current?.pause();
    setPlayerState("paused");
  }, []);

  const stop = useCallback(() => {
    const audio = audioRef.current!;
    audio.pause();
    audio.currentTime = 0;
    setCurrentTime(0);
    setPlayerState("stopped");
  }, []);

  const seek = useCallback((s: number) => {
    const audio = audioRef.current!;
    if (!audio.src) return;
    audio.currentTime = Math.max(0, Math.min(s, audio.duration || 0));
  }, []);

  const setVolume = useCallback((v: number) => {
    setVolumeState(Math.max(0, Math.min(1, v)));
  }, []);

  return {
    playerState, trackName, currentTime, duration, volume, analyserNode,
    loadFile, play, pause, stop, seek, setVolume,
  };
}
