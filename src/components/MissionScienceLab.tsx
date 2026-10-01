import { useEffect, useState, type ReactNode } from "react";
import type { StarLevel, StarMission } from "@/data/starMissions";
import { NovaSprite } from "./NovaSprite";
import { useGame } from "@/lib/game-store";
import "./mission-science-lab.css";

export function MissionScienceLab({
  mission,
  level,
  children,
}: {
  mission: StarMission;
  level: StarLevel;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const { state } = useGame();
  const hint = level.storyBeats[level.storyBeats.length - 1] + " " + level.funFact;
  const speak = () => {
    setOpen(true);
    if (!state.settings.voiceOn || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const voice = new SpeechSynthesisUtterance(hint);
    voice.rate = 0.88;
    voice.pitch = 1.25;
    voice.volume = state.settings.voiceVolume;
    window.speechSynthesis.speak(voice);
  };
  useEffect(() => () => window.speechSynthesis?.cancel(), []);
  return (
    <section
      className={`science-lab science-${mission.id}`}
      aria-label={`${mission.name}: ${level.name} gameplay`}
    >
      <header>
        <span>
          MISSION {mission.index} · LEVEL {level.index}
        </span>
        <strong>
          {level.emoji} {level.name}
        </strong>
        <span>
          {mission.badgeEmoji} {mission.badgeName}
        </span>
      </header>
      <div className="science-stage">
        <div className="science-stars" aria-hidden="true" />
        {mission.id === "star-colors" && (
          <div className="science-spectrum" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
            <i />
          </div>
        )}
        {mission.id === "distance-brightness" && (
          <div className="science-distance" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
            <b>✦</b>
          </div>
        )}
        {mission.id === "the-sun" && (
          <div className="science-sun" aria-hidden="true">
            <i />
            <b>☀</b>
          </div>
        )}
        <div className="science-game-card">{children}</div>
        <div className="science-nova">
          {open && <p role="status">{hint}</p>}
          <button onClick={speak} aria-label="Ask Nova for a science hint">
            <NovaSprite />
          </button>
        </div>
      </div>
      <footer>
        <span>Observe · think · test your idea</span>
        <button
          onClick={() => {
            window.speechSynthesis?.cancel();
            setOpen(false);
          }}
        >
          Hide Nova hint
        </button>
      </footer>
    </section>
  );
}
