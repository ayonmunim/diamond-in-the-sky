import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ChevronUp, ChevronDown, X, ExternalLink, Sparkles } from "lucide-react";
import {
  CATEGORY_LABEL,
  celestialObjects,
  formatMeasure,
  objectsByLevel,
  scaleLevels,
  type CelestialObject,
} from "@/data/celestialObjects";
import { CartoonIcon, type IconKind } from "@/components/CartoonIcon";
import { useGame } from "@/lib/game-store";
import { useSfx } from "@/lib/audio";

import { useExplorerTravel } from "./useExplorerTravel";
import { PlanetComparison } from "./PlanetComparison";
import { planetDiameters } from "@/data/explorerImagery";
import { explorerImagery, discoveryMissions } from "@/data/explorerImagery";
import "@/explorer-phase.css";

const MAX = scaleLevels.length - 1;
/** How much each whole scale level magnifies on stage. */
const STEP = 3.2;
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

export function UniverseExplorer() {
  const reduce = useReducedMotion();
  const [z, setZ] = useExplorerTravel(MAX, !!reduce);
  const moved = useRef(false);
  const [selected, setSelected] = useState<CelestialObject | null>(null);
  const [comparing, setComparing] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);

  const sfx = useSfx();
  const { state, discoverObject, reachScale } = useGame();

  const nearest = Math.round(z);
  const level = scaleLevels[clamp(nearest, 0, MAX)];

  useEffect(() => {
    reachScale(nearest);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nearest]);

  const nudge = useCallback((d: number) => setZ((v) => clamp(v + d, 0, MAX)), [setZ]);

  /* wheel / trackpad: non-passive so the page never scrolls behind the stage */
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const dy = e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? 100 : 1);
      setZ((v) => clamp(v + dy * 0.0022, 0, MAX));
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [setZ]);

  /* touch drag = travel through scales */
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    let last: number | null = null;
    let gap: number | null = null;
    let travel = 0;
    const distance = (e: TouchEvent) =>
      Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY,
      );
    const start = (e: TouchEvent) => {
      moved.current = false;
      travel = 0;
      last = e.touches[0].clientY;
      gap = e.touches.length > 1 ? distance(e) : null;
    };
    const move = (e: TouchEvent) => {
      if (last === null) return;
      const y = e.touches[0].clientY;
      travel += Math.abs(last - y);
      if (e.touches.length > 1) {
        const next = distance(e);
        const previousGap = gap;
        if (previousGap !== null) setZ((v) => v + Math.log(Math.max(1, previousGap) / Math.max(1, next)) * 2);
        gap = next;
        moved.current = true;
      } else {
        if (gap === null) setZ((v) => v + (last! - y) * 0.006);
        gap = null;
        if (travel > 8) moved.current = true;
      }
      last = y;
    };
    const end = () => {
      last = null;
      gap = null;
    };
    el.addEventListener("touchstart", start, { passive: true });
    el.addEventListener("touchmove", move, { passive: true });
    el.addEventListener("touchend", end);
    el.addEventListener("touchcancel", end);
    return () => {
      el.removeEventListener("touchstart", start);
      el.removeEventListener("touchmove", move);
      el.removeEventListener("touchend", end);
      el.removeEventListener("touchcancel", end);
    };
  }, [setZ]);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "PageDown") {
      e.preventDefault();
      nudge(1);
    }
    if (e.key === "ArrowUp" || e.key === "PageUp") {
      e.preventDefault();
      nudge(-1);
    }
    if (e.key === "Home") {
      e.preventDefault();
      setZ(0);
    }
    if (e.key === "End") {
      e.preventDefault();
      setZ(MAX);
    }
  };

  const open = (o: CelestialObject) => {
    if (moved.current) {
      moved.current = false;
      return;
    }
    setSelected(o);
    sfx("click");
    discoverObject(o.id);
  };

  /* only levels close to the current scale are mounted */
  const visible = useMemo(() => scaleLevels.filter((l) => Math.abs(l.index - z) < 1.15), [z]);
  const discovered = state.discoveredObjects?.length ?? 0;
  const mission = discoveryMissions.find((m) =>
    m.ids.some((id) => !state.discoveredObjects?.includes(id)),
  );
  const nextObject =
    mission &&
    celestialObjects.find(
      (o) => mission.ids.includes(o.id) && !state.discoveredObjects?.includes(o.id),
    );

  return (
    <div className="universe-explorer fixed inset-0 overflow-hidden bg-[oklch(0.09_0.04_270)]">
      {/* mood wash for the current scale */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-[background] duration-700"
        style={{
          background: `radial-gradient(120% 90% at 50% 55%, oklch(0.26 0.13 ${level.hue} / 0.85), oklch(0.08 0.04 270) 70%)`,
        }}
      />

      <div
        className="explorer-stars"
        aria-hidden
        style={{ transform: `scale(${1 + z * 0.018}) rotate(${z * 0.15}deg)` }}
      />
      {/* the zoom stage */}
      <div
        ref={stageRef}
        role="application"
        tabIndex={0}
        aria-label="Universe Explorer. Use arrow up and down to travel through astronomical scales."
        onKeyDown={onKey}
        className="absolute inset-0 touch-none outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gold/70"
      >
        {visible.map((l) => {
          const d = l.index - z;
          const scale = Math.pow(STEP, d);
          const opacity = clamp(1 - Math.abs(d) * 1.25, 0, 1);
          return (
            <div
              key={l.index}
              aria-hidden={Math.abs(d) > 0.5}
              className="pointer-events-none absolute inset-0 will-change-transform"
              style={{
                transform: `scale(${scale})`,
                opacity,
                zIndex: Math.round(10 - Math.abs(d) * 4),
              }}
            >
              {objectsByLevel(l.index).map((o) => (
                <ObjectNode
                  key={o.id}
                  o={o}
                  reduce={!!reduce}
                  interactive={Math.abs(d) <= 0.5}
                  discovered={state.discoveredObjects?.includes(o.id) ?? false}
                  onOpen={() => open(o)}
                />
              ))}
            </div>
          );
        })}
      </div>

      {/* scale readout */}
      <div className="explorer-readout pointer-events-none absolute left-3 top-3 z-20 max-w-[15rem] sm:left-6 sm:top-6 sm:max-w-sm">
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/55">
          Explore universe · Scale {nearest + 1}/17
        </p>
        <p className="font-display text-2xl font-bold leading-tight text-white sm:text-4xl">
          {formatMeasure(level.spanValue, level.spanUnit).n}{" "}
          <span className="text-gradient-gold">{level.spanUnit}</span>
        </p>
        <p className="mt-0.5 text-sm font-semibold text-white/90">{level.name}</p>
        <p className="mt-1 text-xs leading-snug text-white/60">{level.caption}</p>
        <p className="mt-2 text-[10px] text-white/45">
          Schematic journey · sizes & spacing not to scale
        </p>
        {level.speculative && (
          <p className="mt-2 inline-block rounded-full bg-pink/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-pink ring-1 ring-pink/40">
            Theoretical — not observed
          </p>
        )}
      </div>

      {/* discoveries counter */}
      <div className="absolute right-3 top-3 z-20 flex items-center gap-1.5 rounded-full bg-white/8 px-3 py-1.5 text-[11px] font-semibold text-white/85 ring-1 ring-white/15 backdrop-blur-sm sm:right-6 sm:top-6">
        <Sparkles className="h-3.5 w-3.5 text-gold" />
        {discovered}/{celestialObjects.length} discovered
      </div>

      <section className="explorer-mission" aria-label="Discovery mission">
        <strong>{mission ? "DISCOVERY MISSION" : "EXPEDITION COMPLETE"}</strong>
        <p>{mission?.title ?? "All four missions discovered!"}</p>
        {mission && (
          <progress
            aria-label="Mission discoveries"
            value={mission.ids.filter((id) => state.discoveredObjects?.includes(id)).length}
            max={mission.ids.length}
          />
        )}
        {nextObject && (
          <button
            onClick={() => {
              moved.current = false;
              setZ(nextObject.scaleLevel);
            }}
          >
            Find {nextObject.name} →
          </button>
        )}
        <p>Tap a world • discover a fact • earn 5 XP</p>
      </section>
      {/* scale rail */}
      <nav
        aria-label="Astronomical scales"
        className="absolute bottom-24 right-2 z-20 hidden max-h-[46vh] flex-col gap-1 overflow-y-auto pr-1 md:flex"
      >
        {scaleLevels.map((l) => {
          const active = l.index === nearest;
          return (
            <button
              key={l.index}
              onClick={() => setZ(l.index)}
              aria-current={active}
              className={`flex items-center justify-end gap-2 rounded-full px-3 py-1 text-right text-[11px] font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/70 ${
                active ? "bg-white/15 text-white" : "text-white/45 hover:text-white/85"
              }`}
            >
              {l.name}
              <span
                className={`h-1.5 w-1.5 shrink-0 rounded-full ${active ? "bg-gold" : "bg-white/30"}`}
              />
            </button>
          );
        })}
      </nav>

      {/* travel controls */}
      <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3">
        <button
          onClick={() => nudge(-1)}
          disabled={z <= 0.01}
          aria-label="Zoom in to a smaller scale"
          className="grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white ring-1 ring-white/20 backdrop-blur-sm transition hover:bg-white/20 disabled:opacity-30"
        >
          <ChevronUp className="h-5 w-5" />
        </button>
        <div className="w-40 sm:w-72">
          <input
            type="range"
            min={0}
            max={MAX}
            step={0.01}
            value={z}
            onChange={(e) => setZ(parseFloat(e.target.value))}
            aria-label="Astronomical scale"
            aria-valuetext={level.name}
            className="w-full accent-[oklch(0.88_0.16_88)]"
          />
          <p className="mt-1 text-center text-[10px] uppercase tracking-widest text-white/45">
            Scroll · pinch · drag to travel
          </p>
        </div>
        <button
          onClick={() => nudge(1)}
          disabled={z >= MAX - 0.01}
          aria-label="Zoom out to a larger scale"
          className="grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white ring-1 ring-white/20 backdrop-blur-sm transition hover:bg-white/20 disabled:opacity-30"
        >
          <ChevronDown className="h-5 w-5" />
        </button>
      </div>

      <button
        className="comparison-launch"
        onClick={() => {
          moved.current = false;
          setComparing(true);
        }}
      >
        Compare planet sizes ↗
      </button>
      {comparing && <PlanetComparison onOpen={open} onClose={() => setComparing(false)} />}
      <AnimatePresence>
        {selected && <InfoCard o={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ node */

/** Pick a hand-drawn cartoon icon for a celestial object. */
function iconFor(o: CelestialObject): IconKind {
  if (o.id === "earth" || o.id === "earth-l1") return "earth";
  if (o.id === "sun") return "sun";
  if (o.id === "saturn" || o.id === "uranus" || o.id === "neptune") return "ringed";
  if (o.id === "voyager1") return "rocket";
  switch (o.category) {
    case "moon":
      return "moon";
    case "planet":
    case "dwarf-planet":
      return "planet";
    case "asteroid":
    case "comet":
      return "comet";
    case "star":
    case "red-giant":
    case "white-dwarf":
    case "neutron-star":
      return "star";
    case "nebula":
    case "supernova-remnant":
      return "nebula";
    case "star-cluster":
    case "galaxy-group":
    case "galaxy-cluster":
    case "supercluster":
      return "cluster";
    case "galaxy":
    case "black-hole":
    case "cosmic-structure":
    case "theoretical":
      return "galaxy";
    case "region":
    default:
      return "telescope";
  }
}

function ObjectNode({
  o,
  onOpen,
  discovered,
  reduce,
  interactive = true,
}: {
  o: CelestialObject;
  onOpen: () => void;
  discovered: boolean;
  reduce: boolean;
  interactive?: boolean;
}) {
  const size = `min(${o.r * 100}vw, ${o.r * 155}vh)`;
  return (
    <button
      onClick={onOpen}
      tabIndex={interactive ? 0 : -1}
      aria-label={`${o.name}. ${CATEGORY_LABEL[o.category]}. Open information card.`}
      className="explorer-object group pointer-events-auto absolute -translate-x-1/2 -translate-y-1/2 rounded-full focus:outline-none focus-visible:ring-4 focus-visible:ring-gold/70"
      style={{
        left: `${o.x}%`,
        top: `${o.y}%`,
        width: size,
        aspectRatio: "1",
        pointerEvents: interactive ? "auto" : "none",
      }}
    >
      <motion.span
        aria-hidden
        className="block h-full w-full"
        animate={reduce ? undefined : { scale: [1, 1.05, 1], rotate: [0, 1.5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        style={{ filter: `drop-shadow(0 0 26px ${o.color})` }}
      >
        <ObjectVisual o={o} />
      </motion.span>
      <span className="pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-full border-2 border-[oklch(0.18_0.05_285)] bg-black/60 px-3 py-1 font-display text-[12px] font-bold text-white opacity-90 backdrop-blur-sm transition group-hover:opacity-100">
        {discovered && <span className="mr-1 text-gold">✦</span>}
        {o.name}
      </span>
    </button>
  );
}

/* ------------------------------------------------------------- info card */

function ObjectVisual({ o }: { o: CelestialObject }) {
  const id = o.id === "earth-l1" ? "earth" : o.id;
  return explorerImagery[id] ? (
    <img src={`/explorer/${id}.jpg`} className="explorer-photo" alt="" draggable={false} />
  ) : (
    <CartoonIcon kind={iconFor(o)} color={o.color} className="h-full w-full" />
  );
}

function InfoCard({ o, onClose }: { o: CelestialObject; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    return () => previous?.focus();
  }, []);
  const photo = explorerImagery[o.id === "earth-l1" ? "earth" : o.id];
  const dist =
    o.distance !== undefined && o.distanceUnit ? formatMeasure(o.distance, o.distanceUnit) : null;
  return (
    <motion.aside
      role="dialog"
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          e.stopPropagation();
          onClose();
        }
      }}
      aria-label={`${o.name} information`}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      transition={{ type: "spring", stiffness: 260, damping: 26 }}
      className="glass absolute bottom-0 left-0 right-0 z-30 max-h-[70vh] overflow-y-auto rounded-t-3xl p-5 sm:bottom-6 sm:left-6 sm:right-auto sm:max-h-[74vh] sm:w-[22rem] sm:rounded-3xl sm:p-6"
    >
      <button
        ref={closeRef}
        onClick={onClose}
        aria-label="Close information card"
        className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full bg-white/10 text-white/80 hover:bg-white/20"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="flex items-center gap-3 pr-10">
        <div className="h-14 w-14 shrink-0">
          <ObjectVisual o={o} />
        </div>

        <div>
          <h2 className="font-display text-xl font-bold leading-tight text-white">{o.name}</h2>
          <p className="text-[11px] font-bold uppercase tracking-widest text-accent">
            {CATEGORY_LABEL[o.category]}
          </p>
        </div>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
        {planetDiameters[o.id] && (
          <div className="explorer-stat rounded-2xl bg-white/6 p-3">
            <dt className="text-[10px] text-white/50">WIDTH COMPARED TO EARTH</dt>
            <dd className="mt-1 text-white">
              {(planetDiameters[o.id] / 12756).toFixed(2)} × Earth
            </dd>
            <a
              className="text-[10px] text-white/60"
              href="https://nssdc.gsfc.nasa.gov/planetary/factsheet/"
              target="_blank"
              rel="noreferrer"
            >
              NASA equatorial diameters ↗
            </a>
          </div>
        )}
        {dist && (
          <div className="explorer-stat rounded-2xl bg-white/6 p-3">
            <dt className="text-[10px] font-bold uppercase tracking-widest text-white/50">
              {o.category === "planet" && o.id !== "earth"
                ? "Orbit from Sun (average)"
                : "Distance / extent"}
            </dt>
            <dd className="mt-0.5 font-semibold text-white">
              {dist.n} <span className="text-white/70">{dist.unit}</span>
            </dd>
          </div>
        )}
        {o.physicalSize && (
          <div className="explorer-stat rounded-2xl bg-white/6 p-3">
            <dt className="text-[10px] font-bold uppercase tracking-widest text-white/50">Size</dt>
            <dd className="mt-0.5 font-semibold text-white">{o.physicalSize}</dd>
          </div>
        )}
      </dl>

      <p className="explorer-credit">
        {photo ? (
          <>
            {photo.kind} · {photo.credit} ·{" "}
            <a
              href={`https://images.nasa.gov/details/${photo.id}`}
              target="_blank"
              rel="noreferrer"
            >
              Image source ↗
            </a>
          </>
        ) : (
          "Illustration / schematic, not a photograph"
        )}
      </p>
      <p className="mt-4 text-sm leading-relaxed text-white/85">{o.description}</p>

      <div className="mt-3 rounded-2xl bg-gold/10 p-3 ring-1 ring-gold/25">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gold">Did you know</p>
        <p className="mt-1 text-sm leading-relaxed text-white/85">
          {o.id === "mercury"
            ? "Mercury rotates once in about 59 Earth days, but sunrise to sunrise takes about 176 Earth days!"
            : o.interestingFact}
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {o.learnContentId && (
          <Link
            to="/learn/$lesson"
            params={{ lesson: o.learnContentId }}
            className="rounded-full bg-primary px-4 py-2 text-xs font-bold text-primary-foreground glow-primary"
          >
            Learn more
          </Link>
        )}
        {o.gameRelatedId && (
          <Link
            to="/missions/$missionId"
            params={{ missionId: o.gameRelatedId }}
            className="rounded-full bg-white/10 px-4 py-2 text-xs font-bold text-white ring-1 ring-white/20"
          >
            Play mission
          </Link>
        )}
        <a
          href={o.sourceURL}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 rounded-full px-3 py-2 text-xs font-semibold text-white/60 hover:text-white"
        >
          {o.source} <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </motion.aside>
  );
}
