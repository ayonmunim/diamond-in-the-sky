import { useEffect, useRef, useState, type PointerEvent } from "react";
import { Hand, RotateCcw, Volume2, Info, X, Orbit, Sparkles, MoveDownLeft } from "lucide-react";
import { useGame } from "@/lib/game-store";
import { useSfx } from "@/lib/audio";
import "./star-learning-lab.css";
import { NovaSprite } from "./NovaSprite";
import { GasStarStory } from "./GasStarStory";
import {
  acceptsThinkingTarget,
  cloudOrder,
  coreOrder,
  nextThinkingTarget,
  signalColors,
} from "./star-thinking";

function PixelLabel({ text }: { text: string }) {
  return <span className="orbit-label">{text}</span>;
}
const positions = [
  [18, 25],
  [47, 17],
  [80, 25],
  [85, 55],
  [76, 78],
  [48, 72],
  [20, 77],
  [15, 51],
];
type Phase = "gather" | "gravity" | "fusion" | "star" | "light";
type Drag = { id: number; x: number; y: number; pointer: number };

export function StarLearningLab({
  level,
  onComplete,
}: {
  level: 1 | 2 | 3 | 4 | 5;
  onComplete: () => void;
}) {
  if (level === 1 || level === 2) return <GasStarStory level={level} onComplete={onComplete} />;
  return <ExistingStarLearningLab level={level} onComplete={onComplete} />;
}

function ExistingStarLearningLab({
  level,
  onComplete,
}: {
  level: 1 | 2 | 3 | 4 | 5;
  onComplete: () => void;
}) {
  const [phase, setPhase] = useState<Phase>(level === 4 ? "light" : "gather");
  const [collected, setCollected] = useState<number[]>([]);
  const [drag, setDrag] = useState<Drag | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [help, setHelp] = useState(false);
  const [hint, setHint] = useState("");
  const [run, setRun] = useState(0);
  const [checkpoint, setCheckpoint] = useState(0);
  const [showSignals, setShowSignals] = useState(true);
  const board = useRef<HTMLDivElement>(null);
  const finished = useRef(false);
  const suppressClick = useRef(false);
  const { state } = useGame();
  const sfx = useSfx();
  const light = phase === "light";
  const clouds = level === 1 || level === 5;
  const total = light ? 3 : level === 2 ? 8 : 4;
  const targetX = light ? [48, 65, 80][checkpoint] : 50;
  const targetY = light ? [32, 68, 50][checkpoint] : 50;
  const expected = nextThinkingTarget(level, collected.length, light);
  const thinkingHint = light
    ? `Guide spark ${collected.length + 1} through beacon ${checkpoint + 1} of 3`
    : level === 2
      ? `Match the next gas: ${collected.length % 4 === 3 ? "He" : "H"}`
      : level === 3
        ? "Remember the signal order; bring each numbered H to the core"
        : `Follow the cloud trail: find cloud ${(expected ?? 0) + 1}`;
  const instruction = light
    ? thinkingHint
    : phase === "gather"
      ? thinkingHint
      : phase === "gravity"
        ? "Pull the orbit into the core"
        : phase === "fusion"
          ? "Fusion releases energy!"
          : "Touch your new star!";
  const lesson = light
    ? "Fusion releases energy inside the star. Energy slowly makes its way outward and escapes as light and heat. Guide these energy sparks to the star surface. This model is much faster than a real star!"
    : level === 3 && phase === "gather"
      ? "The core is already hot and dense. Bring four hydrogen nuclei into it. Through several reactions they form helium and release energy. We are showing a simplified model."
      : phase === "gather"
        ? level === 1
          ? "The Big Bang began the universe's expansion. Much later, hydrogen and helium gas formed clouds. Bring these clouds together to explore how a star begins."
          : "H is hydrogen. He is helium. Stars begin in clouds made mostly of hydrogen, with some helium. Drag the gas circles into the middle. Mixing gas alone does not make it shine."
        : phase === "gravity"
          ? "Gravity pulls gas together. In a big enough cloud, the core gets very hot and dense. Pull the glowing orbit handle inward to model gravity."
          : "In a hot, dense core, hydrogen joins through several steps to make helium and release energy. This is fusion. A star makes its own light and heat!";
  useEffect(() => {
    if (phase !== "fusion") return;
    const timer = window.setTimeout(() => {
      if (level === 5) {
        setCollected([]);
        setPhase("light");
      } else setPhase("star");
    }, 2600);
    return () => window.clearTimeout(timer);
  }, [phase, level]);
  useEffect(() => () => window.speechSynthesis?.cancel(), []);
  const speak = () => {
    if (!state.settings.voiceOn || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const voice = new SpeechSynthesisUtterance(lesson);
    voice.rate = 0.85;
    voice.volume = state.settings.voiceVolume;
    window.speechSynthesis.speak(voice);
  };
  const collect = (id: number) => {
    if ((phase !== "gather" && !light) || collected.includes(id)) return;
    if (!acceptsThinkingTarget(level, collected, id, light)) {
      setHint(`Good try! ${thinkingHint}`);
      setSelected(null);
      return;
    }
    if (light && checkpoint < 2) {
      setCheckpoint((v) => v + 1);
      setSelected(null);
      setHint("");
      sfx("sparkle");
      return;
    }
    setCheckpoint(0);
    const next = [...collected, id];
    setCollected(next);
    setSelected(null);
    setHint("");
    sfx("sparkle");
    if (next.length === total) setPhase(light ? "star" : level === 3 ? "fusion" : "gravity");
  };
  const fuse = () => {
    if (phase !== "gravity") return;
    setPhase("fusion");
    setHint("");
    setSelected(null);
    sfx("success");
  };
  const point = (e: PointerEvent) => {
    const r = board.current!.getBoundingClientRect();
    return {
      x: Math.max(7, Math.min(93, ((e.clientX - r.left) / r.width) * 100)),
      y: Math.max(12, Math.min(88, ((e.clientY - r.top) / r.height) * 100)),
    };
  };
  const start = (e: PointerEvent<HTMLButtonElement>, id: number) => {
    if (drag || (e.pointerType === "mouse" && e.button !== 0)) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    suppressClick.current = false;
    setDrag({ id, pointer: e.pointerId, ...point(e) });
  };
  const move = (e: PointerEvent) => {
    if (!drag || drag.pointer !== e.pointerId) return;
    const p = point(e);
    if (Math.hypot(p.x - drag.x, p.y - drag.y) > 1) suppressClick.current = true;
    setDrag({ ...drag, ...p });
  };
  const end = (e: PointerEvent) => {
    if (!drag || drag.pointer !== e.pointerId) return;
    const p = point(e);
    if (
      Math.hypot(p.x - (drag.id === -1 ? 50 : targetX), p.y - (drag.id === -1 ? 50 : targetY)) <
      (light ? 13 : 17)
    ) {
      if (drag.id === -1) fuse();
      else collect(drag.id);
    } else if (suppressClick.current)
      setHint(light ? "Guide the spark to the glowing beacon" : "Aim for the glowing middle ↘");
    setDrag(null);
  };
  const reset = () => {
    setPhase(level === 4 ? "light" : "gather");
    setCollected([]);
    setDrag(null);
    setSelected(null);
    setHint("");
    setHelp(false);
    setCheckpoint(0);
    setShowSignals(true);
    finished.current = false;
    setRun((v) => v + 1);
    window.speechSynthesis?.cancel();
  };
  const finish = () => {
    if (finished.current) return;
    finished.current = true;
    window.speechSynthesis?.cancel();
    sfx("success");
    onComplete();
  };
  const compression =
    drag?.id === -1
      ? Math.min(1, Math.max(0, (32 - Math.hypot(drag.x - 50, drag.y - 50)) / 20))
      : 0;
  return (
    <section className="orbit-lab" aria-label={`C1 M1 L${level} interactive star mission`}>
      <header className="orbit-top">
        <div className="orbit-score" aria-label={`Mission 1, Level ${level}`}>
          <div>
            <PixelLabel text="MISSION" />
            <span className="orbit-stars" aria-hidden="true">
              {[1, 2, 3, 4, 5].map((i) => (
                <span className={i === 1 ? "purple" : ""} key={i}>
                  ★
                </span>
              ))}
            </span>
          </div>
          <div>
            <PixelLabel text="LEVEL" />
            <span className="orbit-stars" aria-hidden="true">
              {[1, 2, 3, 4, 5].map((i) => (
                <span className={i <= level ? "gold" : ""} key={i}>
                  ★
                </span>
              ))}
            </span>
          </div>
        </div>
        <div className="orbit-tools">
          <button
            aria-label="Hear the learning hint"
            title="Listen"
            disabled={!state.settings.voiceOn}
            onClick={speak}
          >
            <Volume2 />
          </button>
          <button
            aria-label="Show learning guide"
            title="Learning guide"
            aria-expanded={help}
            onClick={() => setHelp(!help)}
          >
            <Info />
          </button>
          <button aria-label="Restart this mission activity" title="Restart" onClick={reset}>
            <RotateCcw />
          </button>
        </div>
      </header>
      <div
        ref={board}
        className={`orbit-world phase-${phase}`}
        data-phase={phase}
        onPointerMove={move}
        onPointerUp={end}
        onPointerCancel={() => {
          setDrag(null);
          suppressClick.current = true;
        }}
      >
        <div className="orbit-nebula" aria-hidden="true" />
        <div className="orbit-starfield" aria-hidden="true">
          {Array.from({ length: 65 }, (_, i) => (
            <i
              key={i}
              style={{
                left: `${(i * 73 + 7) % 100}%`,
                top: `${(i * 37 + 9) % 100}%`,
                animationDelay: `${i % 7}s`,
                width: i % 5 === 0 ? 3 : 1,
                height: i % 5 === 0 ? 3 : 1,
              }}
            />
          ))}
        </div>
        <div className="orbit-planet planet-one" aria-hidden="true" />
        <div className="orbit-planet planet-two" aria-hidden="true" />
        <div className="orbit-comet" aria-hidden="true" />
        {(phase === "gather" || light) && (
          <div className="thinking-trail" aria-label="Thinking trail">
            <span>
              {light
                ? "LIGHT ROUTE"
                : level === 2
                  ? "GAS PATTERN"
                  : level === 3
                    ? "MEMORY SIGNALS"
                    : "CLOUD TRAIL"}
            </span>
            <div>
              {(light
                ? [0, 1, 2]
                : level === 2
                  ? [0, 1, 2, 3, 4, 5, 6, 7]
                  : level === 3
                    ? coreOrder
                    : cloudOrder
              ).map((id, i) => (
                <i
                  key={i}
                  className={
                    (light ? i < checkpoint : i < collected.length)
                      ? "done"
                      : (light ? i === checkpoint : i === collected.length)
                        ? "next"
                        : ""
                  }
                  style={{ borderColor: signalColors[id % 4] }}
                  aria-label={
                    light
                      ? `Beacon ${i + 1}`
                      : level === 2
                        ? i % 4 === 3
                          ? "Helium"
                          : "Hydrogen"
                        : `Signal ${id + 1}`
                  }
                >
                  {light
                    ? "✦"
                    : level === 2
                      ? i % 4 === 3
                        ? "He"
                        : "H"
                      : level === 3 && !showSignals && i >= collected.length
                        ? "?"
                        : id + 1}
                </i>
              ))}
            </div>
            {level === 3 && !light && (
              <button onClick={() => setShowSignals((v) => !v)} aria-pressed={showSignals}>
                {showSignals ? "Ready? Hide signals" : "Show me again"}
              </button>
            )}
          </div>
        )}
        {light && <div className="orbit-light-path" aria-hidden="true" />}
        {level === 1 && phase === "gather" && collected.length === 0 && (
          <div key={run} className="orbit-dawn" aria-hidden="true" />
        )}
        <div className="orbit-caption">
          <span className="orbit-chapter">C1 / STAR NURSERY</span>
          <h2>
            {
              [
                "",
                "A STAR IS BORN",
                "THE STAR MAKER",
                "THE FUSION CORE",
                "JOURNEY OF LIGHT",
                "NOVA’S STAR FINALE",
              ][level]
            }
          </h2>
        </div>
        <div
          className="orbit-target-ring"
          style={{ transform: `translate(-50%,-50%) scale(${1 - compression * 0.42})` }}
          aria-hidden="true"
        />
        <div
          className="orbit-core"
          style={{
            transform: `translate(-50%,-50%) scale(${0.65 + (collected.length / total) * 0.35 - compression * 0.2})`,
          }}
          aria-hidden="true"
        >
          <div className="orbit-core-mist" />
          {collected.map((id, i) => (
            <span
              className={`orbit-core-dot ${id % 4 === 2 ? "he" : ""}`}
              key={id}
              style={{ transform: `rotate(${i * 137}deg) translateX(${24 + i * 3}px)` }}
            />
          ))}
        </div>
        {(phase === "gather" || light) && (
          <button
            className="orbit-drop-target"
            style={{ left: `${targetX}%`, top: `${targetY}%` }}
            aria-label={
              light
                ? `Energy beacon ${checkpoint + 1}: drop here or tap after selecting a spark`
                : "Gas cloud: drop here, or tap after selecting a particle"
            }
            onClick={() => {
              if (selected !== null) collect(selected);
            }}
          >
            <Orbit aria-hidden="true" />
            <span>
              {collected.length}/{total}
            </span>
          </button>
        )}
        {(phase === "gather" || light) &&
          Array.from({ length: total }, (_, id) => {
            if (collected.includes(id)) return null;
            const p =
              light && id === collected.length && checkpoint > 0
                ? [
                    [48, 32],
                    [65, 68],
                  ][checkpoint - 1]
                : light
                  ? [
                      [28, 30],
                      [30, 50],
                      [28, 70],
                    ][id]
                  : positions[clouds || level === 3 ? id * 2 : id];
            const active = drag?.id === id;
            return (
              <button
                key={id}
                data-particle={id}
                className={`orbit-object ${light ? "photon" : clouds ? "cloud" : "atom"} ${id % 4 === 2 ? "he" : "hydrogen"} ${active ? "dragging" : ""} ${selected === id ? "selected" : ""}`}
                style={{ left: `${active ? drag.x : p[0]}%`, top: `${active ? drag.y : p[1]}%` }}
                aria-label={
                  light
                    ? `Energy spark ${id + 1}: drag to the surface`
                    : clouds
                      ? `Gas cloud ${id + 1}: drag to the middle`
                      : `${level !== 3 && id % 4 === 2 ? "Helium" : "Hydrogen"} particle ${id + 1}: drag to the middle`
                }
                onPointerDown={(e) => start(e, id)}
                onClick={() => {
                  if (!suppressClick.current) setSelected(id);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    collect(id);
                  }
                }}
              >
                {(clouds || level === 3 || light) && (
                  <span className="thinking-number" style={{ background: signalColors[id % 4] }}>
                    {id + 1}
                  </span>
                )}
                {light ? (
                  <Sparkles aria-hidden="true" />
                ) : clouds ? (
                  <svg viewBox="0 0 130 95" aria-hidden="true">
                    <defs>
                      <radialGradient id={`cloud-${id}`}>
                        <stop stopColor="#e2eeff" />
                        <stop offset=".5" stopColor={id % 2 ? "#de92ff" : "#86daff"} />
                        <stop offset="1" stopColor="#7051b7" stopOpacity=".1" />
                      </radialGradient>
                    </defs>
                    <path
                      d="M20 65 Q-5 33 29 32 Q33 4 63 17 Q87 0 104 30 Q138 28 122 63 Q113 88 83 76 Q47 99 20 65Z"
                      fill={`url(#cloud-${id})`}
                    />
                    <circle cx="52" cy="48" r="3" fill="#29366a" />
                    <circle cx="76" cy="48" r="3" fill="#29366a" />
                    <path d="M56 59 Q64 65 72 59" fill="none" stroke="#29366a" strokeWidth="3" />
                  </svg>
                ) : (
                  <>
                    <span className="atom-orbit" />
                    <strong>{level !== 3 && id % 4 === 2 ? "He" : "H"}</strong>
                    <span className="atom-satellite" />
                  </>
                )}
              </button>
            );
          })}
        {phase === "gravity" && (
          <>
            <div className="orbit-pull-arrow" aria-hidden="true">
              ← ←
            </div>
            <button
              className={`orbit-gravity ${drag?.id === -1 ? "dragging" : ""}`}
              style={{
                left: `${drag?.id === -1 ? drag.x : 82}%`,
                top: `${drag?.id === -1 ? drag.y : 50}%`,
              }}
              aria-label="Gravity handle: drag into the core, or press Enter"
              onPointerDown={(e) => start(e, -1)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  fuse();
                }
              }}
              onClick={() => {
                if (!suppressClick.current) setSelected(-1);
              }}
            >
              <Orbit />
            </button>
            <button
              className="orbit-drop-target"
              aria-label="Hot core: tap after selecting the gravity handle"
              onClick={() => {
                if (selected === -1) fuse();
              }}
            >
              <span className="orbit-heat">♨</span>
            </button>
          </>
        )}
        {phase === "fusion" && (
          <div className="orbit-fusion" aria-label="Hydrogen fuses into helium and releases energy">
            <span>H</span>
            <span>H</span>
            <span>H</span>
            <span>H</span>
            <strong>He</strong>
            <Sparkles />
          </div>
        )}
        {phase === "star" && (
          <button
            className="orbit-new-star"
            onClick={finish}
            aria-label={`Touch your star to complete L${level}`}
          >
            <svg viewBox="0 0 180 180" aria-hidden="true">
              <defs>
                <radialGradient id="new-star">
                  <stop stopColor="#fff7c8" />
                  <stop offset=".7" stopColor="#ffd46c" />
                  <stop offset="1" stopColor="#ff953a" />
                </radialGradient>
              </defs>
              <path
                d="M90 7 Q102 67 172 89 Q108 106 90 173 Q73 109 8 91 Q71 76 90 7Z"
                fill="url(#new-star)"
                stroke="#fff1b0"
                strokeWidth="2"
              />
              <ellipse cx="73" cy="88" rx="5" ry="8" fill="#222847" />
              <ellipse cx="107" cy="88" rx="5" ry="8" fill="#222847" />
              <path
                d="M73 111 Q90 128 107 111"
                stroke="#222847"
                strokeWidth="5"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
            <Hand className="orbit-tap-hand" />
          </button>
        )}
        <button
          className="orbit-astronaut"
          aria-label="Ask Nova for help"
          onClick={() => {
            setHelp(true);
            speak();
          }}
        >
          <NovaSprite />
        </button>
        <div className="orbit-instruction" aria-live="polite">
          <span className="orbit-gesture" aria-hidden="true">
            {phase === "star" ? <Hand /> : phase === "fusion" ? <Sparkles /> : <MoveDownLeft />}
          </span>
          <span>{hint || instruction}</span>
        </div>
      </div>
      <footer className="orbit-bottom">
        <span>
          <i className="legend-h" /> H <small>Hydrogen</small>
        </span>
        <span>
          <i className="legend-he" /> He <small>Helium</small>
        </span>
        <span className="orbit-model">
          {level === 1
            ? "Millions of years, shown in moments"
            : "A model, not actual sizes or gas amounts"}
        </span>
      </footer>
      {help && (
        <aside className="orbit-help">
          <button aria-label="Close learning guide" onClick={() => setHelp(false)}>
            <X />
          </button>
          <h3>Nova's space note</h3>
          <p>{lesson}</p>
          <p>
            {thinkingHint}. The numbered trail and gas pattern are thinking challenges, not physical
            rules or exact gas proportions. No timer: look again whenever you need.
          </p>
          <p>
            Drag with a finger or mouse. Or select a cloud, then tap the middle. Keyboard: Tab to a
            cloud or orbit handle, then Enter to move it.
          </p>
        </aside>
      )}
    </section>
  );
}
