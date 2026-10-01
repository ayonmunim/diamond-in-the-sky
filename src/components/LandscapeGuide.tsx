import { useState } from "react";
import { Maximize, RotateCw } from "lucide-react";
import { NovaSprite } from "./NovaSprite";

export function LandscapeGuide() {
  const [fallback, setFallback] = useState(false);
  const [portrait, setPortrait] = useState(false);
  const enter = async () => {
    try {
      if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
      const orientation = screen.orientation as ScreenOrientation & {
        lock?: (value: string) => Promise<void>;
      };
      if (!orientation.lock) throw new Error("unsupported");
      await orientation.lock("landscape");
    } catch {
      setFallback(true);
    }
  };
  return (
    <>
      {!portrait && (
        <div className="landscape-guide" role="dialog" aria-label="Landscape play guidance">
          <NovaSprite />
          <RotateCw size={42} />
          <h2>Turn to explore!</h2>
          <p>
            {fallback
              ? "Rotate your device sideways. If needed, turn off rotation lock in your device settings."
              : "Nova's universe plays best sideways."}
          </p>
          <button onClick={enter}>
            Enter landscape <Maximize size={18} />
          </button>
          <button className="portrait-option" onClick={() => setPortrait(true)}>
            Continue in portrait
          </button>
        </div>
      )}
      <button
        className="landscape-fullscreen"
        aria-label="Enter fullscreen landscape"
        onClick={enter}
      >
        <Maximize size={18} />
      </button>
    </>
  );
}
