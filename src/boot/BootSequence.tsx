import { useEffect } from "react";
import { useBootSequence } from "./useBootSequence";
import PostScreen from "./PostScreen";
import LoadingBar from "./LoadingBar";
import BootLogo from "./BootLogo";
import "./boot.css";

interface BootSequenceProps {
  onDone: () => void;
}

export default function BootSequence({ onDone }: BootSequenceProps) {
  const { phase, skipBoot } = useBootSequence(false);

  useEffect(() => {
    if (phase === "done") {
      onDone();
    }
  }, [phase, onDone]);

  useEffect(() => {
    const handler = () => {
      if (phase !== "transition" && phase !== "done") {
        skipBoot();
      }
    };
    window.addEventListener("pointerdown", handler);
    window.addEventListener("keydown", handler);
    return () => {
      window.removeEventListener("pointerdown", handler);
      window.removeEventListener("keydown", handler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  if (phase === "done") return null;

  return (
    <div className={`boot-screen${phase === "transition" ? " transition-out" : ""}`}>
      {phase === "post" && <PostScreen />}
      {phase === "loading" && <LoadingBar />}
      {(phase === "logo" || phase === "transition") && <BootLogo />}
      <div className="boot-skip-hint">CLICK OR PRESS ANY KEY TO SKIP</div>
    </div>
  );
}
