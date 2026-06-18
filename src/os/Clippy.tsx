import React, { useState, useCallback, useRef } from "react";

const ANIMATIONS = [
  "idle", "think", "cool", "listen", "read", "noted",
  "point right", "point left", "point up", "point down",
  "music", "sleep", "wakeup", "check",
] as const;

type ClipAnim = typeof ANIMATIONS[number];

const MESSAGES = [
  "It looks like you're building a portfolio.\nWould you like help with that?",
  "Hi there! I'm Clippy.\nI live here now.",
  "Nice wallpaper choice.\nI didn't pick it but I endorse it.",
  "Did you know you can right-click\nthe desktop to change wallpapers?",
  "Try opening the Projects app!\n(Double-click the icon.)",
  "This OS runs on React + Zustand.\nPretty chrome. Very cobalt.",
  "CHROME // COBALT\nPortfolio OS v1.0",
  "Still here.\nJust vibing.",
];

const FRAME_COUNTS: Partial<Record<ClipAnim, number>> = {
  sleep: 40,
  wakeup: 40,
};

function getFrames(anim: ClipAnim): number {
  return FRAME_COUNTS[anim] ?? 33;
}

interface ClippyProps {
  size?: number;
}

export default function Clippy({ size = 64 }: ClippyProps) {
  const [visible, setVisible] = useState(true);
  const [dismissed, setDismissed] = useState(false);
  const [anim, setAnim] = useState<ClipAnim>("idle");
  const [msgIdx, setMsgIdx] = useState(0);
  const [showBubble, setShowBubble] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cycleAnim = useCallback(() => {
    const next = ANIMATIONS[Math.floor(Math.random() * ANIMATIONS.length)];
    setAnim(next);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setAnim("idle"), 4000);
  }, []);

  const handleClick = useCallback(() => {
    setShowBubble((v) => !v);
    setMsgIdx((i) => (i + 1) % MESSAGES.length);
    cycleAnim();
  }, [cycleAnim]);

  const handleDismiss = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setVisible(false);
    setTimeout(() => setDismissed(true), 300);
  }, []);

  if (dismissed) return null;

  const frames = getFrames(anim);
  const scale = size / 240;
  const sheetW = 7920 * scale;
  const sheetH = 240 * scale;
  const duration = frames / 24;

  const src = `/clip/clip%20(${encodeURIComponent(anim)})_sheet.png`;

  return (
    <div className={`clippy-wrapper${visible ? "" : " clippy-wrapper--hidden"}`}>
      {showBubble && (
        <div className="clippy-bubble" onClick={handleClick}>
          {MESSAGES[msgIdx].split("\n").map((line, i) => (
            <span key={i}>{line}<br /></span>
          ))}
        </div>
      )}
      <div className="clippy-dismiss" onClick={handleDismiss} title="Dismiss Clippy">×</div>
      <div
        className="clippy-sprite"
        title="It's Clippy!"
        onClick={handleClick}
        style={{
          width: size,
          height: size,
          backgroundPosition: "0 0",
          backgroundRepeat: "no-repeat",
          backgroundSize: `${sheetW}px ${sheetH}px`,
          imageRendering: "pixelated",
          animationName: "clippy-roll",
          animationDuration: `${duration.toFixed(3)}s`,
          animationTimingFunction: `steps(${frames}, end)`,
          animationIterationCount: anim === "idle" ? "infinite" : "1",
          ["--clippy-sheet-w" as string]: `-${sheetW}px`,
          ["--clippy-bg" as string]: `url('${src}')`,
        } as React.CSSProperties}
      />
    </div>
  );
}
