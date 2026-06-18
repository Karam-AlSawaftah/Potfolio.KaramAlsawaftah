import { useRef, useEffect, useCallback, useState } from "react";
import { useAudioEngine } from "./useAudioEngine";
import { useButterchurn } from "./useButterchurn";
import { playSound } from "../../utils/sounds";
import "./winamp.css";

const SKINS = ["dark", "chrome", "amber", "neon"] as const;
type Skin = typeof SKINS[number];
const SKIN_LABEL: Record<Skin, string> = {
  dark:   "DARK",
  chrome: "CHROME",
  amber:  "AMBER",
  neon:   "NEON",
};

function formatTime(s: number): string {
  if (!isFinite(s) || s < 0) return "0:00";
  return `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, "0")}`;
}

export default function WinampApp() {
  const fileInputRef  = useRef<HTMLInputElement>(null);
  const canvasRef     = useRef<HTMLCanvasElement>(null);
  const canvasWrapRef = useRef<HTMLDivElement>(null);

  const engine      = useAudioEngine();
  const butterchurn = useButterchurn(canvasRef, engine.analyserNode);

  const [isSeeking, setIsSeeking] = useState(false);
  const [seekValue, setSeekValue] = useState(0);
  const [skin, setSkin] = useState<Skin>("dark");

  const cycleSkin = useCallback(() => {
    setSkin(s => SKINS[(SKINS.indexOf(s) + 1) % SKINS.length]);
    playSound("menuCommand");
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    engine.loadFile(file);
    setTimeout(() => { engine.play(); }, 0);
    playSound("menuCommand");
    e.target.value = "";
  }, [engine]);

  const handlePlayPause = useCallback(() => {
    if (engine.playerState === "playing") {
      engine.pause();
      playSound("minimize");
    } else {
      engine.play();
      playSound("restore");
    }
  }, [engine]);

  const handleStop = useCallback(() => {
    engine.stop();
    playSound("minimize");
  }, [engine]);

  useEffect(() => {
    const wrap = canvasWrapRef.current;
    if (!wrap) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        butterchurn.notifyResize(entry.contentRect.width, entry.contentRect.height);
      }
    });
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [butterchurn]);

  const hasTrack = engine.trackName !== "";

  return (
    <div className="winamp-app" data-skin={skin}>
      <input
        ref={fileInputRef}
        type="file"
        accept=".mp3,.wav,.flac,.ogg,.aac"
        className="winamp-app__file-input"
        onChange={handleFileChange}
      />

      <div ref={canvasWrapRef} className="winamp-app__canvas-wrap">
        <canvas ref={canvasRef} />
        {!hasTrack && (
          <div className="winamp-app__idle-overlay">
            <div className="winamp-app__idle-label">BUTTERCHURN VIZ</div>
            <div className="winamp-app__idle-sub">NO TRACK LOADED</div>
            <button
              className="winamp-app__idle-btn"
              onClick={() => fileInputRef.current?.click()}
            >
              [ LOAD FILE ]
            </button>
          </div>
        )}
      </div>

      <div className="winamp-app__controls">
        {/* Row 1: track name + time */}
        <div className="winamp-app__row">
          <span className="winamp-app__track-name">
            {hasTrack ? engine.trackName : "NO TRACK"}
          </span>
          <span className="winamp-app__time">
            {formatTime(isSeeking ? seekValue : engine.currentTime)} / {formatTime(engine.duration)}
          </span>
        </div>

        {/* Row 2: seek bar */}
        <div className="winamp-app__row">
          <input
            type="range"
            className="winamp-app__seek"
            min={0}
            max={engine.duration || 1}
            step={0.25}
            value={isSeeking ? seekValue : engine.currentTime}
            onChange={(e) => setSeekValue(Number(e.target.value))}
            onPointerDown={() => { setIsSeeking(true); setSeekValue(engine.currentTime); }}
            onPointerUp={(e) => {
              setIsSeeking(false);
              engine.seek(Number((e.target as HTMLInputElement).value));
            }}
            disabled={!hasTrack}
          />
        </div>

        {/* Row 3: transport + volume + load */}
        <div className="winamp-app__row">
          <div className="winamp-app__transport">
            <button className="winamp-app__btn" onClick={() => engine.seek(engine.currentTime - 5)} title="Rewind 5s">◀◀</button>
            <button
              className={`winamp-app__btn${engine.playerState === "playing" ? " winamp-app__btn--active" : ""}`}
              onClick={handlePlayPause}
            >
              {engine.playerState === "playing" ? "▐▐" : "▶"}
            </button>
            <button className="winamp-app__btn" onClick={handleStop}>■</button>
            <button className="winamp-app__btn" onClick={() => engine.seek(engine.currentTime + 5)} title="Skip 5s">▶▶</button>
          </div>
          <span className="winamp-app__vol-label">VOL</span>
          <input
            type="range"
            className="winamp-app__vol"
            min={0} max={1} step={0.01}
            value={engine.volume}
            onChange={(e) => engine.setVolume(Number(e.target.value))}
          />
          <button className="winamp-app__btn" onClick={() => fileInputRef.current?.click()}>LOAD</button>
        </div>

        {/* Row 4: preset strip (left) + skin selector (right) */}
        <div className="winamp-app__bottom-row">
          <div className="winamp-app__preset-row">
            <button className="winamp-app__btn" onClick={butterchurn.prevPreset}>◁</button>
            <span className="winamp-app__preset-name" title={butterchurn.presetName}>
              {butterchurn.presetName || "—"}
            </span>
            <button className="winamp-app__btn" onClick={butterchurn.nextPreset}>▷</button>
          </div>
          <button
            className="winamp-app__btn winamp-app__skin-btn"
            onClick={cycleSkin}
            title="Cycle skin"
          >
            {SKIN_LABEL[skin]}
          </button>
        </div>
      </div>
    </div>
  );
}
