import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { NovaSprite } from "./NovaSprite";
import { useGame } from "@/lib/game-store";
import "./gas-star-story.css";

const scenes = [
  [
    "THE BIG BANG",
    "About 13.8 billion years ago",
    "The universe was extremely hot and dense. Space expanded and cooled. This is not a bomb exploding into empty space.",
  ],
  [
    "THE FIRST ATOMS",
    "About 380,000 years later",
    "As the universe cooled, atoms formed: mostly hydrogen and helium. There were no stars yet.",
  ],
  [
    "THE FIRST STAR CLOUDS",
    "Hundreds of millions of years later",
    "Gravity gathered gas into dense clouds. The exact time the first stars appeared is still being studied. Let's explore a simplified model!",
  ],
];
const gases = [
  { symbol: "H", name: "Hydrogen", color: "#71dbff", x: 18, y: 35, good: true },
  { symbol: "O₂", name: "Oxygen", color: "#ff9caa", x: 77, y: 28, good: false },
  { symbol: "He", name: "Helium", color: "#c39bff", x: 20, y: 73, good: true },
  { symbol: "N₂", name: "Nitrogen", color: "#92e3ab", x: 81, y: 70, good: false },
];
type Stage = "intro" | "choose" | "cloud" | "collapse" | "fusion" | "star";
export function GasStarStory({ level, onComplete }: { level: 1 | 2; onComplete: () => void }) {
  const [stage, setStage] = useState<Stage>(level === 1 ? "intro" : "choose");
  const [scene, setScene] = useState(0);
  const [paused, setPaused] = useState(false);
  const [chosen, setChosen] = useState<string[]>([]);
  const [nova, setNova] = useState(
    "Find hydrogen and helium, the main ingredients of the first stars.",
  );
  const { state } = useGame();
  const reduced = useReducedMotion();
  const finished = useRef(false);
  const lastSpoken = useRef("");
  const say = (text: string, force = false) => {
    setNova(text);
    if (
      !state.settings.voiceOn ||
      !window.speechSynthesis ||
      (!force && lastSpoken.current === text)
    )
      return;
    lastSpoken.current = text;
    window.speechSynthesis.cancel();
    const speech = new SpeechSynthesisUtterance(text);
    speech.rate = 0.88;
    speech.pitch = 1.25;
    speech.volume = state.settings.voiceVolume;
    window.speechSynthesis.speak(speech);
  };
  useEffect(() => () => window.speechSynthesis?.cancel(), []);
  useEffect(() => {
    if (stage !== "intro" || paused) return;
    const timer = setTimeout(() => {
      if (scene < 2) setScene((v) => v + 1);
      else setStage("choose");
    }, 9000);
    return () => clearTimeout(timer);
  }, [stage, scene, paused]);
  useEffect(() => {
    if (stage !== "collapse" && stage !== "fusion") return;
    const timer = setTimeout(() => {
      if (stage === "collapse") {
        setStage("fusion");
        setNova(
          "The core becomes hot and dense enough for hydrogen fusion. Fusion produces helium and releases energy.",
        );
      } else {
        setStage("star");
        setNova(
          "A star is born! Its core releases energy through fusion. You helped build our model of a star.",
        );
      }
    }, 4500);
    return () => clearTimeout(timer);
  }, [stage]);
  const choose = (symbol: string) => {
    const gas = gases.find((g) => g.symbol === symbol)!;
    if (stage !== "choose" || chosen.includes(symbol)) return;
    if (!gas.good) {
      say(
        `${gas.name}. This gas exists today, but it was not a main ingredient of the first star clouds. Look for hydrogen and helium!`,
        true,
      );
      return;
    }
    const next = [...chosen, symbol];
    setChosen(next);
    say(
      `${gas.name} joins our cloud. ${next.length === 2 ? "Both gases are here. Gas alone does not light up: now we need gravity!" : "Find the other gas."}`,
      true,
    );
    if (next.length === 2) setStage("cloud");
  };
  const reset = () => {
    window.speechSynthesis?.cancel();
    lastSpoken.current = "";
    finished.current = false;
    setChosen([]);
    setScene(0);
    setPaused(false);
    setStage(level === 1 ? "intro" : "choose");
    setNova("Find hydrogen and helium, the main ingredients of the first stars.");
  };
  return (
    <section
      className={`gas-story gas-${stage}`}
      aria-label={`C1 M1 L${level} gas and star activity`}
    >
      <header>
        <strong>MISSION 1 · LEVEL {level}</strong>
        <button onClick={reset}>↻ Restart</button>
      </header>
      <div className="gas-space">
        <div className="gas-stars" aria-hidden="true" />
        {stage === "intro" ? (
          <>
            <motion.div
              key={scene}
              className={`bang-scene bang-scene-${scene}`}
              aria-hidden="true"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {Array.from({ length: 24 }, (_, i) => (
                <i
                  key={i}
                  style={{
                    transform: `rotate(${i * 137.5}deg) translateX(${35 + i * 5}px)`,
                    animationPlayState: paused ? "paused" : "running",
                    animation: reduced ? "none" : undefined,
                  }}
                />
              ))}
              <div
                className="bang-glow"
                style={{ animationPlayState: paused ? "paused" : "running" }}
              />
            </motion.div>
            <div className="bang-captions" aria-live="polite">
              <small>{scenes[scene][1]}</small>
              <h2>{scenes[scene][0]}</h2>
              <p>{scenes[scene][2]}</p>
            </div>
            <div className="bang-controls">
              <button onClick={() => setPaused((v) => !v)}>{paused ? "▶ Play" : "Ⅱ Pause"}</button>
              <button onClick={() => say(scenes[scene][2], true)}>♫ Hear Nova</button>
              <button
                onClick={() => {
                  window.speechSynthesis?.cancel();
                  if (scene < 2) setScene((v) => v + 1);
                  else setStage("choose");
                }}
              >
                {scene < 2 ? "Next scene →" : "Explore the gases →"}
              </button>
              <button onClick={() => setStage("choose")}>Skip animation</button>
            </div>
          </>
        ) : (
          <>
            <h2 className="gas-title">
              {stage === "choose"
                ? "FIND THE STAR INGREDIENTS"
                : stage === "cloud"
                  ? "YOUR GAS CLOUD"
                  : stage === "collapse"
                    ? "GRAVITY GATHERS THE GAS"
                    : stage === "fusion"
                      ? "FUSION BEGINS"
                      : "YOUR NEW STAR"}
            </h2>
            <div className="gas-bowl" aria-label="Collected gas cloud">
              {chosen.map((symbol, i) => (
                <motion.span
                  key={symbol}
                  className="gas-collected"
                  initial={reduced ? false : { x: i === 0 ? -170 : 170, y: 50, scale: 0.4 }}
                  animate={{ x: i === 0 ? -28 : 28, y: 0, scale: 1 }}
                  transition={{ duration: 0.65 }}
                >
                  {symbol}
                </motion.span>
              ))}
              {stage === "choose" && <small>H + He</small>}
              {(stage === "collapse" || stage === "fusion") && <div className="gas-hot-core" />}
              {stage === "star" && (
                <button
                  className="gas-born-star"
                  aria-label={`Complete level ${level}`}
                  onClick={() => {
                    if (!finished.current) {
                      finished.current = true;
                      window.speechSynthesis?.cancel();
                      onComplete();
                    }
                  }}
                >
                  ✦<small>Touch your star</small>
                </button>
              )}
            </div>
            {(stage === "choose" || stage === "cloud") &&
              gases
                .filter((g) => !chosen.includes(g.symbol))
                .map((g) => (
                  <button
                    key={g.symbol}
                    className="gas-choice"
                    disabled={stage !== "choose"}
                    style={{
                      left: `${g.x}%`,
                      top: `${g.y}%`,
                      borderColor: g.color,
                      color: g.color,
                    }}
                    aria-label={`Select ${g.name}`}
                    onMouseEnter={() => say(g.name)}
                    onFocus={() => say(g.name)}
                    onClick={() => choose(g.symbol)}
                  >
                    <span className="gas-orbit" />
                    <strong>{g.symbol}</strong>
                    <small>{g.name}</small>
                  </button>
                ))}
            {stage === "cloud" && (
              <button
                className="gas-gravity"
                onClick={() => {
                  setStage("collapse");
                  say(
                    "Gravity pulls a big enough gas cloud inward. The core gets hotter and denser. We are speeding up a very long process.",
                    true,
                  );
                }}
              >
                ◎ Let gravity gather the cloud
              </button>
            )}
            <div className="gas-nova">
              <button aria-label="Hear Nova's hint" onClick={() => say(nova, true)}>
                <NovaSprite />
              </button>
              <p aria-live="polite">{nova}</p>
            </div>
          </>
        )}
      </div>
      <footer>
        <span>2D learning model · not real times, sizes or gas proportions</span>
        <a
          href="https://science.nasa.gov/mission/webb/science-overview/science-explainers/what-were-the-first-stars-like/"
          target="_blank"
          rel="noreferrer"
        >
          NASA science ↗
        </a>
      </footer>
    </section>
  );
}
