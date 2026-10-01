import { useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { ColorMissionStory, Cosmos, StarFace, useNovaVoice } from "./ColorMission";
import { NovaSprite } from "./NovaSprite";
import { FactArrow } from "./FactArrow";
import {
  distanceBands,
  distanceFacts,
  distanceLessons,
  distanceObjects,
} from "@/data/distanceMission";
import "./distance-mission.css";

function Sphere() {
  return (
    <svg className="dm-sphere" viewBox="0 0 800 380" aria-hidden="true">
      <g fill="none" stroke="#8ddffb" strokeWidth="1.5" opacity=".4">
        {[60, 100, 140, 175].map((r) => (
          <ellipse key={r} cx="400" cy="190" rx={r * 2} ry={r} />
        ))}
        <ellipse cx="400" cy="190" rx="90" ry="175" />
        <ellipse cx="400" cy="190" rx="250" ry="65" transform="rotate(25 400 190)" />
        <path d="M30 190H770M400 10V370M120 40L680 340" />
      </g>
      <text x="400" y="200" textAnchor="middle" fontSize="34">
        🌍
      </text>
    </svg>
  );
}
export function DistanceMissionStory({
  level,
  onStart,
  onExit,
}: {
  level: number;
  onStart: () => void;
  onExit: () => void;
}) {
  return (
    <ColorMissionStory
      level={level}
      customLesson={distanceLessons[level - 1]}
      onStart={onStart}
      onExit={onExit}
      renderScene={(scene) => (
        <div className={`dm-story-scene dm-story-${level} dm-beat-${scene}`}>
          {level === 4 ? (
            <>
              <Sphere />
              <div className="dm-story-planets">🌕 ☀️ 🔴 ✨ 🌌</div>
            </>
          ) : level === 5 ? (
            <>
              <div className="dm-story-targets">
                TRUE <span>➶ 📜</span> FALSE
              </div>
              <p>Deliver your space facts!</p>
            </>
          ) : (
            <>
              <span className="dm-story-earth">{level === 1 && scene === 0 ? "🏘️" : "🌍"}</span>
              <div className="dm-story-light" />
              <div className="dm-story-star">
                <StarFace color="#ffe071" />
              </div>
              <strong>
                {level === 1
                  ? scene === 0
                    ? "100 km on Earth"
                    : "4.25 light-years to Proxima"
                  : level === 2
                    ? ["10 light-years", "100 light-years", "1,000 light-years"][scene]
                    : [
                        "A symbol → a round star",
                        "More surface, more light",
                        "Giant star · same temperature",
                      ][scene]}
              </strong>
            </>
          )}
        </div>
      )}
    />
  );
}

export function DistanceMissionGame({
  level,
  onComplete,
}: {
  level: number;
  onComplete: () => void;
}) {
  const lesson = distanceLessons[level - 1];
  const speak = useNovaVoice();
  const [feedback, setFeedback] = useState(lesson.instruction);
  const [trip, setTrip] = useState<"earth" | "space">("earth");
  const [unit, setUnit] = useState("km");
  const [measure, setMeasure] = useState(0);
  const [value, setValue] = useState(0);
  const [visited, setVisited] = useState<string[]>([]);
  const [placed, setPlaced] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [ghost, setGhost] = useState<{ id: string; x: number; y: number } | null>(null);
  const [factsDone, setFactsDone] = useState(false);
  const [generation, setGeneration] = useState(0);
  const finished = useRef(false);
  const dragging = useRef<{ id: string; x: number; y: number; moved: boolean } | null>(null);
  const suppress = useRef(false);
  const say = (text: string) => {
    setFeedback(text);
    speak(text);
  };
  const mark = (id: string) => setVisited((old) => (old.includes(id) ? old : [...old, id]));
  const distance = Math.round(10 * Math.pow(100, value / 100));
  const received = 100 * Math.pow(10 / distance, 2);
  const done =
    level === 1
      ? visited.length === 2
      : level === 2 || level === 3
        ? visited.length === 3
        : level === 4
          ? placed.length === distanceObjects.length
          : factsDone;
  const progress =
    level === 4
      ? `${placed.length}/${distanceObjects.length}`
      : level === 5
        ? factsDone
          ? "4/4"
          : "4 fact messages"
        : `${visited.length}/${level === 1 ? 2 : 3}`;
  const dock = (id: string, band: string) => {
    const obj = distanceObjects.find((o) => o.id === id);
    if (!obj || placed.includes(id)) return;
    if (obj.band !== band) {
      say(`${obj.name}: ${obj.distance}. Try the matching band!`);
      setSelected(null);
      return;
    }
    setPlaced((old) => [...old, id]);
    setSelected(null);
    say(`Yes! ${obj.name}: ${obj.distance}. ${obj.detail}.`);
  };
  const move = (e: PointerEvent<HTMLButtonElement>) => {
    const d = dragging.current;
    if (!d) return;
    if (Math.hypot(e.clientX - d.x, e.clientY - d.y) > 6) d.moved = true;
    if (d.moved) setGhost({ id: d.id, x: e.clientX, y: e.clientY });
  };
  const release = (e: PointerEvent<HTMLButtonElement>) => {
    const d = dragging.current;
    if (!d) return;
    dragging.current = null;
    suppress.current = d.moved;
    setGhost(null);
    if (d.moved) {
      const target = document
        .elementFromPoint(e.clientX, e.clientY)
        ?.closest<HTMLElement>("[data-distance-band]")?.dataset.distanceBand;
      if (target) dock(d.id, target);
    }
  };
  const reset = () => {
    setTrip("earth");
    setUnit("km");
    setMeasure(0);
    setValue(0);
    setVisited([]);
    setPlaced([]);
    setSelected(null);
    setGhost(null);
    setFactsDone(false);
    setGeneration((v) => v + 1);
    finished.current = false;
    dragging.current = null;
    setFeedback(lesson.instruction);
    window.speechSynthesis?.cancel();
  };
  return (
    <section className="cm-shell cm-game dm-game" aria-label={`Mission 5 level ${level} activity`}>
      <Cosmos />
      <header className="cm-header">
        <strong>MISSION 5 · LEVEL {level}</strong>
        <span>{progress} ✦</span>
        <button onClick={reset}>↻ Restart</button>
      </header>
      <div className="cm-game-heading">
        <h2>{lesson.title}</h2>
        <p>{lesson.instruction}</p>
      </div>
      <div className="dm-playfield">
        {level === 1 && (
          <div className="dm-ruler-game">
            <div className="dm-tabs">
              <button
                aria-pressed={trip === "earth"}
                onClick={() => {
                  setTrip("earth");
                  setMeasure(0);
                }}
              >
                🌍 Earth trip {visited.includes("earth") ? "✓" : ""}
              </button>
              <button
                aria-pressed={trip === "space"}
                onClick={() => {
                  setTrip("space");
                  setMeasure(0);
                }}
              >
                ✦ Star trip {visited.includes("space") ? "✓" : ""}
              </button>
            </div>
            <div className={`dm-journey ${trip}`}>
              <span>{trip === "earth" ? "🏘️" : "🌍"}</span>
              <div className="dm-travel-line">
                <i style={{ left: `${measure}%` }}>✦</i>
              </div>
              <span>{trip === "earth" ? "🏡" : "☀️"}</span>
            </div>
            <output>
              {trip === "earth"
                ? "Two imaginary towns · 100 km apart"
                : "Earth → Proxima Centauri · about 4.25 ly"}
            </output>
            <div className="dm-tabs">
              <button
                aria-pressed={unit === "km"}
                onClick={() => {
                  setUnit("km");
                  setMeasure(0);
                }}
              >
                Kilometers (km)
              </button>
              <button
                aria-pressed={unit === "ly"}
                onClick={() => {
                  setUnit("ly");
                  setMeasure(0);
                }}
              >
                Light-years (ly)
              </button>
            </div>
            <label className="dm-slider">
              Move the light{" "}
              <input
                aria-label="Journey ruler"
                type="range"
                min="0"
                max="100"
                value={measure}
                onChange={(e) => {
                  const next = +e.target.value;
                  setMeasure(next);
                  if (next >= 98) {
                    if (unit === (trip === "earth" ? "km" : "ly")) {
                      mark(trip);
                      say(
                        `Great measuring! ${trip === "earth" ? "Kilometers keep this town trip simple." : "Light-years keep this enormous star trip simple."}`,
                      );
                    } else
                      say(
                        "Both units measure distance, but try the more useful unit for this journey.",
                      );
                  }
                }}
              />
            </label>
            <output className="dm-reading">
              {unit === "km"
                ? Math.round(
                    ((trip === "earth" ? 100 : 4.25 * 9.4607e12) * measure) / 100,
                  ).toLocaleString()
                : (((trip === "earth" ? 100 / 9.4607e12 : 4.25) * measure) / 100).toPrecision(
                    3,
                  )}{" "}
              {unit}
            </output>
            <small>1 light-year ≈ 9.46 trillion km · Each ruler fits its own journey.</small>
          </div>
        )}
        {(level === 2 || level === 3) && (
          <div className="dm-lab">
            <div className="dm-lab-stage">
              <span className="dm-observer">
                🌍<small>Observer</small>
              </span>
              <div className="dm-light-path" />
              <div
                className="dm-changing-star"
                style={
                  {
                    left: level === 2 ? `${25 + value * 0.55}%` : "65%",
                    width: level === 3 ? "auto" : "clamp(70px,15vw,170px)",
                    height: level === 3 ? `${25 + value * 0.7}%` : undefined,
                    opacity: level === 2 ? 0.14 + 0.86 * Math.pow(10 / distance, 0.55) : 1,
                  } as CSSProperties
                }
              >
                {level === 3 && (
                  <span className="dm-symbol" style={{ opacity: Math.max(0, 1 - value / 25) }}>
                    ★
                  </span>
                )}
                <div style={{ opacity: level === 3 ? Math.min(1, value / 25) : 1 }}>
                  <StarFace color="#ffe071" />
                </div>
              </div>
              <div className="dm-wave-fronts">))) ))) )))</div>
            </div>
            <output className="dm-reading">
              {level === 2
                ? `${distance.toLocaleString()} light-years · ${received.toFixed(2)}% light received`
                : `${(1 + value * 0.19).toFixed(1)}× radius · ${Math.pow(1 + value * 0.19, 2).toFixed(0)}× light output`}
            </output>
            <label className="dm-slider">
              {level === 2 ? "Drag distance" : "Drag size"}
              <input
                aria-label={level === 2 ? "Star distance" : "Star size"}
                type="range"
                min="0"
                max="100"
                value={value}
                onChange={(e) => {
                  const n = +e.target.value;
                  setValue(n);
                  const id =
                    n <= 5 ? "small" : n >= 95 ? "large" : n >= 45 && n <= 55 ? "middle" : null;
                  if (id) {
                    mark(id);
                    if (!visited.includes(id))
                      say(
                        level === 2
                          ? `At ${Math.round(10 * Math.pow(100, n / 100))} light-years, the same star looks ${n > 50 ? "much dimmer" : "brighter than it does far away"}.`
                          : `You found the ${id === "large" ? "giant" : id === "middle" ? "medium" : "small"} size. More surface means more light at the same temperature.`,
                      );
                  }
                }}
              />
            </label>
            <div className="dm-scale-labels">
              {(level === 2 ? ["10 ly", "100 ly", "1,000 ly"] : ["Small", "Medium", "Giant"]).map(
                (label, i) => (
                  <span key={label}>
                    {visited.includes(["small", "middle", "large"][i]) ? "✓ " : ""}
                    {label}
                  </span>
                ),
              )}
            </div>
            <small>
              {level === 2
                ? "Same star power · logarithmic distance ruler · visibility boosted; meter follows inverse-square law."
                : "Same temperature and distance · radius comparison, not a real-time stellar evolution simulation."}
            </small>
          </div>
        )}
        {level === 4 && (
          <div className="dm-map">
            <div className="dm-map-space">
              <Sphere />
              <div className="dm-bands">
                {distanceBands.map((b) => (
                  <button
                    key={b.id}
                    data-distance-band={b.id}
                    className={selected ? "ready" : ""}
                    aria-label={`Place object at ${b.label}`}
                    onClick={() =>
                      selected
                        ? dock(selected, b.id)
                        : say("Choose an object, then its distance band.")
                    }
                  >
                    <strong>{b.label}</strong>
                    <small>{b.hint}</small>
                    <span>
                      {distanceObjects
                        .filter((o) => placed.includes(o.id) && o.band === b.id)
                        .map((o) => o.icon)
                        .join(" ")}
                    </span>
                  </button>
                ))}
              </div>
              <small className="dm-map-note">
                Compressed distance bands, not positions or a linear scale. ly = light-year.
              </small>
            </div>
            <div className="dm-object-tray">
              {distanceObjects
                .filter((o) => !placed.includes(o.id))
                .map((o) => (
                  <button
                    key={o.id}
                    data-distance-object={o.id}
                    className={selected === o.id ? "selected" : ""}
                    aria-label={`Select ${o.name}`}
                    onPointerDown={(e) => {
                      if (e.button !== 0) return;
                      dragging.current = { id: o.id, x: e.clientX, y: e.clientY, moved: false };
                      suppress.current = false;
                      e.currentTarget.setPointerCapture(e.pointerId);
                      setSelected(o.id);
                    }}
                    onPointerMove={move}
                    onPointerUp={release}
                    onPointerCancel={() => {
                      dragging.current = null;
                      setGhost(null);
                      suppress.current = true;
                    }}
                    onClick={() => {
                      if (suppress.current) {
                        suppress.current = false;
                        return;
                      }
                      setSelected(o.id);
                      say(`${o.name}. ${o.distance}. ${o.detail}.`);
                    }}
                  >
                    <span>{o.icon}</span>
                    <strong>{o.name}</strong>
                    <small>{o.distance}</small>
                  </button>
                ))}
            </div>
          </div>
        )}
        {level === 5 && !factsDone && (
          <FactArrow
            key={generation}
            facts={distanceFacts}
            say={say}
            onDone={() => setFactsDone(true)}
          />
        )}
        {done && (
          <button
            className="cm-primary dm-complete"
            onClick={() => {
              if (finished.current) return;
              finished.current = true;
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
      {ghost && (
        <div className="dm-ghost" style={{ left: ghost.x, top: ghost.y }}>
          {distanceObjects.find((o) => o.id === ghost.id)?.icon}
        </div>
      )}
    </section>
  );
}
