import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
} from "react";
import { NovaSprite } from "./NovaSprite";
import { useGame } from "@/lib/game-store";
import {
  colorFacts,
  colorLessons,
  discoveryStars,
  starPalette,
  type StarColor,
} from "@/data/colorMission";
import "./color-mission.css";
import { FactArrow } from "./FactArrow";
import figmaStar from "@/assets/figma-stars/star.png";

// Shared narration follows the same game sound settings in both missions.
// eslint-disable-next-line react-refresh/only-export-components
export function useNovaVoice() {
  const { state } = useGame();
  const { voiceOn, voiceVolume } = state.settings;
  const speak = useCallback(
    (text: string) => {
      if (!voiceOn || typeof window === "undefined" || !window.speechSynthesis) return;
      window.speechSynthesis.cancel();
      const voice = new SpeechSynthesisUtterance(text);
      voice.rate = 0.88;
      voice.pitch = 1.2;
      voice.volume = voiceVolume;
      window.speechSynthesis.speak(voice);
    },
    [voiceOn, voiceVolume],
  );
  useEffect(() => {
    if (!voiceOn) window.speechSynthesis?.cancel();
  }, [voiceOn]);
  useEffect(() => () => window.speechSynthesis?.cancel(), []);
  return speak;
}

export function StarFace({ color, className = "" }: { color: string; className?: string }) {
  // The lesson supplies color dynamically; retain the original Figma texture.
  const tones: Record<string, string> = {
    "#65adff": "hue-rotate(215deg) saturate(.8) brightness(1.7)",
    "#eef5ff": "saturate(0) brightness(3)",
    "#ffe071": "hue-rotate(52deg) brightness(2)",
    "#ffa458": "hue-rotate(24deg) brightness(1.8)",
    "#ff6c7e": "none",
    "#76edab": "hue-rotate(130deg) brightness(1.8)",
    "#fff4bd": "hue-rotate(48deg) saturate(.3) brightness(2.8)",
    "#b58aff": "hue-rotate(270deg) brightness(1.8)",
    "#b9dcff": "hue-rotate(215deg) saturate(.25) brightness(2.8)",
    "#ff9dd9": "hue-rotate(315deg) saturate(.5) brightness(2)",
  };
  return (
    <div className={`cm-star-face ${className}`} aria-hidden="true">
      <img src={figmaStar} alt="" draggable={false} style={{ filter: tones[color] ?? "none" }} />
    </div>
  );
}

export function Cosmos() {
  return (
    <div className="cm-cosmos" aria-hidden="true">
      <div className="cm-cloud cm-cloud-a" />
      <div className="cm-cloud cm-cloud-b" />
      <div className="cm-ring-planet" />
      <div className="cm-little-moon" />
      {Array.from({ length: 32 }, (_, i) => (
        <i
          key={i}
          style={{
            left: `${(i * 47 + 3) % 100}%`,
            top: `${(i * 29 + 7) % 100}%`,
            animationDelay: `${i % 5}s`,
          }}
        >
          ✦
        </i>
      ))}
    </div>
  );
}

export function ColorMissionStory({
  level,
  onStart,
  onExit,
  customLesson,
  renderScene,
}: {
  level: number;
  onStart: () => void;
  onExit: () => void;
  customLesson?: { title: string; lines: string[] };
  renderScene?: (scene: number) => React.ReactNode;
}) {
  const lesson = customLesson ?? colorLessons[level - 1];
  const [scene, setScene] = useState(0);
  const [paused, setPaused] = useState(false);
  const [ended, setEnded] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const elapsedRef = useRef(0);
  const speak = useNovaVoice();
  const duration = Math.max(11000, lesson.lines[scene].split(" ").length * 460);
  useEffect(() => {
    speak(lesson.lines[scene]);
  }, [scene, lesson, speak]);
  useEffect(() => {
    if (paused || ended) return;
    let previous = performance.now();
    const timer = window.setInterval(() => {
      const now = performance.now();
      elapsedRef.current += Math.min(now - previous, 500);
      previous = now;
      setElapsed(elapsedRef.current);
      if (elapsedRef.current >= duration) {
        elapsedRef.current = 0;
        setElapsed(0);
        if (scene < 2) setScene((v) => v + 1);
        else setEnded(true);
      }
    }, 100);
    return () => window.clearInterval(timer);
  }, [paused, ended, duration, scene]);
  const next = () => {
    window.speechSynthesis?.cancel();
    elapsedRef.current = 0;
    setElapsed(0);
    if (scene < 2) setScene((v) => v + 1);
    else setEnded(true);
  };
  const replay = () => {
    elapsedRef.current = 0;
    setElapsed(0);
    setEnded(false);
    setScene(0);
    setPaused(false);
    if (scene === 0) speak(lesson.lines[0]);
  };
  return (
    <section
      className={`cm-story cm-shell ${paused ? "cm-paused" : ""}`}
      aria-label={`Mission ${customLesson ? 5 : 4} level ${level} cartoon story`}
    >
      <Cosmos />
      <header className="cm-header">
        <button onClick={onExit} aria-label="Exit story">
          ←
        </button>
        <strong>
          MISSION {customLesson ? 5 : 4} · LEVEL {level}
        </strong>
        <button onClick={onStart}>Skip Intro</button>
      </header>
      <div className={`cm-cartoon scene-${scene}`}>
        <div className="cm-story-heading">
          <small>NOVA'S {customLesson ? "DISTANCE" : "COLOR"} ADVENTURE</small>
          <h1>{lesson.title}</h1>
        </div>
        {renderScene ? (
          renderScene(scene)
        ) : (
          <div className="cm-story-stars">
            {(level === 4 ? [...starPalette].reverse() : starPalette).map((star, i) => (
              <div
                key={star.id}
                className="cm-cartoon-star"
                style={{ "--star": star.hex, "--delay": `${i * -0.7}s` } as CSSProperties}
              >
                <StarFace color={star.hex} />
                <strong>{star.name}</strong>
                {level === 3 ? (
                  <small>
                    {star.kelvin.toLocaleString()} K<br />
                    {star.example}
                  </small>
                ) : level === 2 ? (
                  <small>{star.zone.toUpperCase()}</small>
                ) : (
                  <small>{scene === 0 ? "✦" : star.example}</small>
                )}
              </div>
            ))}
          </div>
        )}
        <div className="cm-story-nova">
          <NovaSprite />
        </div>
        {!customLesson && level === 3 && (
          <div className="cm-cartoon-thermometer" aria-hidden="true" />
        )}
        {!customLesson && level === 4 && (
          <div className="cm-cartoon-arrows" aria-hidden="true">
            → → → →
          </div>
        )}
        {!customLesson && level === 5 && (
          <div className="cm-cartoon-targets" aria-hidden="true">
            <span>◎ ✓</span>
            <span>◎ ×</span>
          </div>
        )}
      </div>
      <div className="cm-story-caption">
        <p aria-live="polite">
          {ended ? "Your adventure is ready. Let's explore together!" : lesson.lines[scene]}
        </p>
        <progress
          value={ended ? 3 : scene + Math.min(1, elapsed / duration)}
          max={3}
          aria-label="Story progress"
        />
        <div className="cm-story-controls">
          <button onClick={replay}>↻ Replay</button>
          <button
            aria-label={paused ? "Play story" : "Pause story"}
            onClick={() => {
              setPaused((v) => !v);
              if (paused) window.speechSynthesis?.resume();
              else window.speechSynthesis?.pause();
            }}
          >
            {paused ? "▶ Play" : "Ⅱ Pause"}
          </button>
          <button onClick={() => speak(lesson.lines[scene])}>♫ Hear Nova</button>
          {ended ? (
            <button className="cm-primary" onClick={onStart}>
              Start adventure →
            </button>
          ) : (
            <button onClick={next}>Next scene →</button>
          )}
        </div>
      </div>
    </section>
  );
}

export function ColorMissionGame({ level, onComplete }: { level: number; onComplete: () => void }) {
  const lesson = colorLessons[level - 1];
  const [placed, setPlaced] = useState<string[]>([]);
  const [collected, setCollected] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState(lesson.instruction);
  const [typed, setTyped] = useState(["", "", "", "", ""]);
  const [round, setRound] = useState(0);
  const [generation, setGeneration] = useState(0);
  const [hover, setHover] = useState<string | null>(null);
  const [drag, setDrag] = useState<{ id: string; x: number; y: number } | null>(null);
  const dragging = useRef<{
    id: string;
    x: number;
    y: number;
    pointer: number;
    moved: boolean;
  } | null>(null);
  const suppress = useRef(false);
  const finished = useRef(false);
  const speak = useNovaVoice();
  const done = level === 5 ? round === colorFacts.length : placed.length === 5;
  const say = (text: string) => {
    setFeedback(text);
    speak(text);
  };
  useEffect(() => {
    speak(lesson.lines[0]);
  }, [lesson, speak]);
  const discover = (name: string) => {
    const star = discoveryStars.find((s) => s.name === name)!;
    if (collected.includes(name)) return;
    if (!star.family) {
      say(
        `${name} is a fantasy choice here. A star's combined light does not normally look ${name.toLowerCase()} to our eyes. Try another color!`,
      );
      return;
    }
    setCollected((v) => [...v, name]);
    setPlaced((v) => (v.includes(star.family!) ? v : [...v, star.family!]));
    say(`${name}! It settles into our ${star.family} color home.`);
  };
  const dock = (id: string, target: string) => {
    if (placed.includes(id)) return;
    const star = starPalette.find((s) => s.id === id)!;
    if ((level === 2 ? star.zone : String(star.kelvin)) !== target) {
      say(
        level === 2
          ? `${star.name} needs a different harbor. ${star.zone === "hot" ? "Try Hot." : star.zone === "warm" ? "Try Warm." : "Try Cool."}`
          : `Try again: ${star.name} belongs at ${star.kelvin.toLocaleString()} kelvin.`,
      );
      setSelected(null);
      return;
    }
    setPlaced((v) => [...v, id]);
    setSelected(null);
    say(
      `${star.name} matched! ${level === 3 ? `${star.example} is our example.` : "One more star has found its harbor."}`,
    );
  };
  const startDrag = (e: PointerEvent<HTMLButtonElement>, id: string) => {
    if (e.button !== 0 || dragging.current) return;
    dragging.current = { id, x: e.clientX, y: e.clientY, pointer: e.pointerId, moved: false };
    suppress.current = false;
    e.currentTarget.setPointerCapture(e.pointerId);
    setSelected(id);
  };
  const moveDrag = (e: PointerEvent<HTMLButtonElement>) => {
    const d = dragging.current;
    if (!d || d.pointer !== e.pointerId) return;
    if (Math.hypot(e.clientX - d.x, e.clientY - d.y) > 7) d.moved = true;
    if (d.moved) setDrag({ id: d.id, x: e.clientX, y: e.clientY });
  };
  const endDrag = (e: PointerEvent<HTMLButtonElement>) => {
    const d = dragging.current;
    if (!d || d.pointer !== e.pointerId) return;
    dragging.current = null;
    suppress.current = d.moved;
    setDrag(null);
    if (d.moved) {
      const target = document
        .elementFromPoint(e.clientX, e.clientY)
        ?.closest<HTMLElement>("[data-color-dock]")?.dataset.colorDock;
      if (target) dock(d.id, target);
      else
        setFeedback(
          "Bring the star to a glowing target. You can also select it, then tap its target.",
        );
    }
  };
  const starButton = (star: StarColor) => (
    <button
      key={star.id}
      data-color-star={star.id}
      className={`cm-piece ${selected === star.id ? "selected" : ""}`}
      aria-label={`Select ${star.name} star`}
      onPointerDown={(e) => startDrag(e, star.id)}
      onPointerMove={moveDrag}
      onPointerUp={endDrag}
      onPointerCancel={() => {
        dragging.current = null;
        setDrag(null);
        suppress.current = true;
      }}
      onClick={() => {
        if (suppress.current) {
          suppress.current = false;
          return;
        }
        setSelected(star.id);
        say(
          `${star.name}. ${level === 3 ? `${star.kelvin.toLocaleString()} kelvin.` : `Find the ${star.zone} harbor.`}`,
        );
      }}
    >
      <StarFace color={star.hex} />
      <strong>{star.name}</strong>
    </button>
  );
  const target = (id: string, label: string, children: React.ReactNode) => (
    <button
      key={id}
      className={`cm-dock ${selected ? "ready" : ""}`}
      data-color-dock={id}
      aria-label={`Place star at ${label}`}
      onClick={() => {
        if (selected) dock(selected, id);
        else say("Select a star first, then choose its target.");
      }}
    >
      <strong>{label}</strong>
      <div>{children}</div>
    </button>
  );
  const reset = () => {
    setPlaced([]);
    setCollected([]);
    setSelected(null);
    setTyped(["", "", "", "", ""]);
    setRound(0);
    setGeneration((v) => v + 1);
    setDrag(null);
    dragging.current = null;
    suppress.current = false;
    finished.current = false;
    setFeedback(lesson.instruction);
    window.speechSynthesis?.cancel();
  };
  return (
    <section
      className={`cm-game cm-shell cm-level-${level}`}
      aria-label={`Mission 4 level ${level} interactive colors`}
    >
      <Cosmos />
      <header className="cm-header">
        <strong>MISSION 4 · LEVEL {level}</strong>
        <span>{level === 5 ? Math.min(round, 5) : placed.length}/5 ✦</span>
        <button onClick={reset} aria-label="Restart color activity">
          ↻ Restart
        </button>
      </header>
      <div className="cm-game-heading">
        <h2>{lesson.title}</h2>
        <p>{lesson.instruction}</p>
      </div>
      <div className="cm-playfield">
        {level === 1 && (
          <>
            <div className="cm-discovery-grid">
              {discoveryStars.map((star) => (
                <button
                  key={star.name}
                  disabled={collected.includes(star.name)}
                  className="cm-discovery-star"
                  aria-label={`Discover ${star.name}`}
                  style={{ "--star": star.hex } as CSSProperties}
                  onMouseEnter={() => setHover(star.name)}
                  onMouseLeave={() => setHover(null)}
                  onFocus={() => setHover(star.name)}
                  onBlur={() => setHover(null)}
                  onClick={() => discover(star.name)}
                >
                  <StarFace color={star.hex} />
                  <span
                    className={
                      hover === star.name || collected.includes(star.name) ? "revealed" : ""
                    }
                    style={{ color: star.hex }}
                  >
                    {star.name}
                  </span>
                  {collected.includes(star.name) && <b>✓</b>}
                </button>
              ))}
            </div>
            <div className="cm-color-homes">
              {starPalette.map((star) => (
                <div
                  key={star.id}
                  className={placed.includes(star.id) ? "filled" : ""}
                  style={{ "--star": star.hex } as CSSProperties}
                >
                  <div>{placed.includes(star.id) ? <StarFace color={star.hex} /> : "✧"}</div>
                  <strong>{star.name}</strong>
                </div>
              ))}
            </div>
          </>
        )}
        {level === 2 && (
          <>
            <div className="cm-harbors">
              {["hot", "warm", "cool"].map((zone) =>
                target(
                  zone,
                  `${zone === "hot" ? "☀" : zone === "warm" ? "◉" : "❄"} ${zone.toUpperCase()}`,
                  starPalette
                    .filter((s) => s.zone === zone && placed.includes(s.id))
                    .map((s) => (
                      <span key={s.id}>
                        <StarFace color={s.hex} />
                        <small>{s.name}</small>
                      </span>
                    )),
                ),
              )}
            </div>
            <div className="cm-star-tray">
              {starPalette.filter((s) => !placed.includes(s.id)).map(starButton)}
            </div>
          </>
        )}
        {level === 3 && (
          <>
            <div className="cm-temperature-axis">
              <span>COOLER</span>
              <span>Surface temperature · kelvin →</span>
              <span>HOTTER</span>
            </div>
            <div className="cm-thermometer">
              <div className="cm-heat-line" />
              {[...starPalette].reverse().map((s) =>
                target(
                  String(s.kelvin),
                  `${s.kelvin.toLocaleString()} K`,
                  placed.includes(s.id) ? (
                    <span>
                      <StarFace color={s.hex} />
                      <small>
                        {s.name} · {s.example}
                      </small>
                    </span>
                  ) : (
                    <span className="cm-empty-star">✧</span>
                  ),
                ),
              )}
            </div>
            <div className="cm-star-tray">
              {[starPalette[1], starPalette[4], starPalette[0], starPalette[3], starPalette[2]]
                .filter((s) => !placed.includes(s.id))
                .map(starButton)}
            </div>
            <small className="cm-scale-note">
              Rounded learning examples · temperature markers are evenly spaced
            </small>
          </>
        )}
        {level === 4 && (
          <>
            <div className="cm-temperature-axis">
              <span>COOLEST</span>
              <span>Follow the arrows →</span>
              <span>HOTTEST</span>
            </div>
            <div className="cm-word-trail">
              {[...starPalette].reverse().map((star, i) => (
                <div className="cm-word-step" key={star.id}>
                  <div
                    className={`cm-word-circle ${placed.includes(star.id) ? "filled" : ""}`}
                    style={{ "--star": star.hex } as CSSProperties}
                  >
                    {placed.includes(star.id) ? (
                      <>
                        <StarFace color={star.hex} />
                        <strong>{star.name}</strong>
                      </>
                    ) : (
                      <>
                        <small>{i + 1}</small>
                        <input
                          aria-label={`Color ${i + 1} from coolest to hottest`}
                          autoComplete="off"
                          autoCapitalize="none"
                          spellCheck={false}
                          value={typed[i]}
                          placeholder="Color name"
                          onChange={(e) => {
                            const value = e.target.value;
                            setTyped((v) => v.map((old, index) => (index === i ? value : old)));
                            if (value.trim().toLowerCase() === star.id) {
                              setPlaced((v) => (v.includes(star.id) ? v : [...v, star.id]));
                              say(`${star.name}! Your star is ready.`);
                            }
                          }}
                          onBlur={() => {
                            if (typed[i] && !placed.includes(star.id))
                              setFeedback(
                                "Keep trying. Follow red, orange, yellow, white, blue. A matching name brings a star to life.",
                              );
                          }}
                        />
                      </>
                    )}
                  </div>
                  {i < 4 && (
                    <span className="cm-step-arrow" aria-hidden="true">
                      ➜
                    </span>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
        {level === 5 && !done && (
          <FactArrow
            key={generation}
            facts={colorFacts}
            say={say}
            onDone={() => setRound(colorFacts.length)}
          />
        )}
        {done && (
          <button
            className="cm-claim cm-primary"
            onClick={() => {
              if (finished.current) return;
              finished.current = true;
              window.speechSynthesis?.cancel();
              onComplete();
            }}
          >
            ✦ Meet Nova for your award ✦
          </button>
        )}
      </div>
      <footer className="cm-nova-guide">
        <button aria-label="Hear Nova's guidance" onClick={() => speak(feedback)}>
          <NovaSprite />
        </button>
        <p role="status">{feedback}</p>
      </footer>
      {drag && (
        <div className="cm-drag-ghost" style={{ left: drag.x, top: drag.y }}>
          <StarFace color={starPalette.find((s) => s.id === drag.id)!.hex} />
        </div>
      )}
    </section>
  );
}

export function ColorMissionAward({
  missionNumber = 4,
  level,
  stars,
  gems,
  xp,
  badgeName,
  onNext,
  onReplay,
}: {
  missionNumber?: number;
  level: number;
  stars: number;
  gems: number;
  xp: number;
  badgeName?: string;
  onNext: () => void;
  onReplay: () => void;
}) {
  const speak = useNovaVoice();
  useEffect(() => {
    speak(
      missionNumber === 5
        ? "Congratulations, explorer! You made a wonderful distance discovery. Nova is proud of your exploring!"
        : level === 5
          ? "Wonderful exploring! You completed the color mission. Let's celebrate your Color Coder award!"
          : "You did it! Another color discovery. Here is your explorer medal!",
    );
  }, [level, missionNumber, speak]);
  return (
    <section
      className="cm-award cm-shell"
      aria-label={
        missionNumber === 5 ? "Nova distance award celebration" : "Nova color award celebration"
      }
    >
      <Cosmos />
      <div className="cm-award-title">
        <small>
          MISSION {missionNumber} · LEVEL {level} COMPLETE
        </small>
        <h2>
          {level === 5
            ? missionNumber === 5
              ? "LIGHT-YEAR WANDERER!"
              : "COLOR CODER!"
            : "BRILLIANT DISCOVERY!"}
        </h2>
      </div>
      <div className="cm-award-stage">
        <div className="cm-award-halo" />
        <div className="cm-award-nova">
          <NovaSprite />
        </div>
        {starPalette.map((s, i) => (
          <div
            key={s.id}
            className={`cm-orbit-medal medal-${i}`}
            style={{ "--star": s.hex } as CSSProperties}
          >
            <StarFace color={s.hex} />
          </div>
        ))}
        <div className="cm-main-medal">
          <span>✦</span>
          <strong>{badgeName ?? (level === 5 ? "Mission complete" : `Explorer ${level}`)}</strong>
        </div>
        <div className="cm-award-sparkles" aria-hidden="true">
          ✧ ✨ ✦ ✨ ✧
        </div>
      </div>
      <div className="cm-award-loot" aria-label={`${stars} stars, ${gems} gems, ${xp} experience`}>
        <span>★ {stars}</span>
        <span>💎 +{gems}</span>
        <span>✧ +{xp} XP</span>
      </div>
      <div className="cm-award-buttons">
        <button onClick={onReplay}>↻ Play again</button>
        <button className="cm-primary" onClick={onNext}>
          {level === 5 ? "Mission hub →" : "Next adventure →"}
        </button>
      </div>
    </section>
  );
}
