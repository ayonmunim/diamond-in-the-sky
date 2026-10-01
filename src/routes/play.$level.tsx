import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageShell } from "@/components/PageShell";
import { NarrationBar } from "@/components/NarrationBar";
import { levels } from "@/lib/game-data";
import { useGame } from "@/lib/game-store";
import { ChevronRight, RefreshCw, Sparkles, Target } from "lucide-react";

export const Route = createFileRoute("/play/$level")({
  head: ({ params }) => {
    const lv = levels.find((x) => x.slug === params.level);
    return { meta: [{ title: `${lv?.title ?? "Mission"} — Diamond In The Sky` }] };
  },
  component: LevelPage,
});

function LevelPage() {
  const { level } = Route.useParams();
  const lv = levels.find((x) => x.slug === level);
  const navigate = useNavigate();
  const [phase, setPhase] = useState<"story" | "play" | "done">("story");
  const [earned, setEarned] = useState(0);
  const { completeLevel, earnBadge } = useGame();

  if (!lv) return null;

  const onWin = (stars: number) => {
    setEarned(stars);
    completeLevel(lv.id, stars);
    const badgeMap: Record<number, string> = { 1: "stargazer", 2: "pathfinder", 3: "spectrum", 5: "creator" };
    if (badgeMap[lv.id]) earnBadge(badgeMap[lv.id]);
    setPhase("done");
  };

  const nextLv = levels.find((x) => x.id === lv.id + 1);

  return (
    <PageShell>
      <Link to="/play" className="text-xs text-muted-foreground hover:text-foreground">← All missions</Link>

      <AnimatePresence mode="wait">
        {phase === "story" && (
          <motion.section
            key="story"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="mt-4 glass rounded-3xl p-6 sm:p-10"
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-accent">Mission {lv.id}</p>
            <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
              <span className="mr-2">{lv.emoji}</span>{lv.title}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-foreground/90">{lv.story}</p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-border">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <Sparkles className="h-3.5 w-3.5 text-accent" /> Learning objective
                </div>
                <p className="mt-2 text-sm">{lv.objective}</p>
              </div>
              <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-border">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <Target className="h-3.5 w-3.5 text-gold" /> Your mission
                </div>
                <p className="mt-2 text-sm">{lv.mission}</p>
              </div>
            </div>

            <div className="mt-6"><NarrationBar text={`${lv.story} Your mission: ${lv.mission}`} autoplay /></div>

            <button
              onClick={() => setPhase("play")}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground glow-primary"
            >
              Begin mission <ChevronRight className="h-4 w-4" />
            </button>
          </motion.section>
        )}

        {phase === "play" && (
          <motion.section
            key="play"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="mt-4"
          >
            <div className="glass mb-4 flex flex-wrap items-center gap-3 rounded-2xl p-4">
              <div className="text-2xl">{lv.emoji}</div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold uppercase tracking-widest text-accent">Mission {lv.id}</div>
                <div className="truncate font-display font-semibold">{lv.title}</div>
              </div>
              <div className="text-xs text-muted-foreground">{lv.mission}</div>
            </div>
            {lv.id === 1 && <LevelTwinkle onWin={onWin} />}
            {lv.id === 2 && <LevelConstellation onWin={onWin} />}
            {lv.id === 3 && <LevelColorMatch onWin={onWin} />}
            {lv.id === 4 && <LevelBrightness onWin={onWin} />}
            {lv.id === 5 && <LevelCreateSky onWin={onWin} />}
          </motion.section>
        )}

        {phase === "done" && (
          <motion.section
            key="done"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6 glass rounded-3xl p-8 text-center"
          >
            <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 1 }} className="text-7xl">
              🌟
            </motion.div>
            <h2 className="mt-4 font-display text-3xl font-bold">Mission complete!</h2>
            <p className="mt-2 text-muted-foreground">You earned</p>
            <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-gold/15 px-5 py-2 text-2xl font-bold text-gold ring-1 ring-gold/40">
              +{earned} ✨
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button onClick={() => setPhase("play")} className="inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2.5 font-semibold">
                <RefreshCw className="h-4 w-4" /> Replay
              </button>
              {nextLv ? (
                <button
                  onClick={() => { navigate({ to: "/play/$level", params: { level: nextLv.slug } }); setPhase("story"); setEarned(0); }}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 font-semibold text-primary-foreground glow-primary"
                >
                  Next mission <ChevronRight className="h-4 w-4" />
                </button>
              ) : (
                <Link to="/dashboard" className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 font-semibold text-primary-foreground glow-primary">
                  View dashboard <ChevronRight className="h-4 w-4" />
                </Link>
              )}
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </PageShell>
  );
}

/* ===== Level 1: Find the Twinkling Star ===== */
function LevelTwinkle({ onWin }: { onWin: (n: number) => void }) {
  const [seed, setSeed] = useState(0);
  const [feedback, setFeedback] = useState<"" | "right" | "wrong">("");
  const stars = useMemo(() => {
    const arr = Array.from({ length: 16 }, (_, i) => ({
      id: i,
      x: 8 + Math.random() * 84,
      y: 8 + Math.random() * 84,
      size: 8 + Math.random() * 8,
    }));
    return arr;
  }, [seed]);
  const target = useMemo(() => Math.floor(Math.random() * stars.length), [seed]);

  return (
    <div className="glass rounded-3xl p-4 sm:p-6">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gradient-to-b from-cosmos/40 to-background ring-1 ring-border">
        {stars.map((s, i) => (
          <button
            key={s.id}
            onClick={() => { setFeedback(i === target ? "right" : "wrong"); if (i === target) setTimeout(() => onWin(5), 700); }}
            aria-label="Star"
            className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-white transition ${i === target ? "animate-pulse" : ""}`}
            style={{
              left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size,
              boxShadow: i === target ? "0 0 14px oklch(0.95 0.10 90 / 1), 0 0 28px oklch(0.85 0.14 85 / 0.7)" : "0 0 6px rgba(255,255,255,0.6)",
              animationDuration: i === target ? "0.8s" : undefined,
            }}
          />
        ))}
      </div>
      <div className="mt-4 flex items-center gap-3">
        <button onClick={() => { setSeed((s) => s + 1); setFeedback(""); }} className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-2 text-sm">
          <RefreshCw className="h-3.5 w-3.5" /> Shuffle
        </button>
        {feedback === "wrong" && <span className="text-sm text-destructive">Not quite — keep looking for the brightest twinkle.</span>}
        {feedback === "right" && <span className="text-sm text-green-400">Brilliant! ✨</span>}
      </div>
    </div>
  );
}

/* ===== Level 2: Connect the Constellation ===== */
function LevelConstellation({ onWin }: { onWin: (n: number) => void }) {
  // 7 points roughly like the Big Dipper
  const points = [
    { x: 12, y: 70 }, { x: 28, y: 58 }, { x: 45, y: 48 }, { x: 60, y: 55 },
    { x: 72, y: 38 }, { x: 82, y: 22 }, { x: 92, y: 30 },
  ];
  const [order, setOrder] = useState<number[]>([]);
  const [error, setError] = useState(false);

  const click = (i: number) => {
    if (order.includes(i)) return;
    if (i !== order.length) { setError(true); setTimeout(() => setError(false), 600); return; }
    const next = [...order, i];
    setOrder(next);
    if (next.length === points.length) setTimeout(() => onWin(5), 600);
  };

  return (
    <div className="glass rounded-3xl p-4 sm:p-6">
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-gradient-to-b from-cosmos/40 to-background ring-1 ring-border">
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 62.5" preserveAspectRatio="none">
          {order.slice(1).map((idx, k) => {
            const a = points[order[k]];
            const b = points[idx];
            return <line key={k} x1={a.x} y1={a.y * 0.625} x2={b.x} y2={b.y * 0.625} stroke="oklch(0.85 0.14 85)" strokeWidth="0.35" strokeLinecap="round" />;
          })}
        </svg>
        {points.map((p, i) => {
          const tapped = order.includes(i);
          const isNext = order.length === i;
          return (
            <button
              key={i}
              onClick={() => click(i)}
              className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-white transition ${error && isNext ? "ring-2 ring-destructive" : ""} ${tapped ? "star-glow" : isNext ? "animate-pulse" : ""}`}
              style={{ left: `${p.x}%`, top: `${p.y}%`, width: 18, height: 18 }}
              aria-label={`Star ${i + 1}`}
            >
              <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] font-bold text-muted-foreground">{i + 1}</span>
            </button>
          );
        })}
      </div>
      <div className="mt-4 flex items-center gap-3">
        <button onClick={() => setOrder([])} className="rounded-full bg-white/10 px-4 py-2 text-sm">Clear</button>
        <span className="text-sm text-muted-foreground">Connect stars 1 → 7 in order.</span>
      </div>
    </div>
  );
}

/* ===== Level 3: Star Color → Temperature ===== */
function LevelColorMatch({ onWin }: { onWin: (n: number) => void }) {
  type Star = { id: string; color: string; bucket: "cool" | "medium" | "hot"; placed?: "cool" | "medium" | "hot" };
  const [stars, setStars] = useState<Star[]>([
    { id: "r", color: "oklch(0.62 0.22 25)", bucket: "cool" },
    { id: "y", color: "oklch(0.88 0.16 95)", bucket: "medium" },
    { id: "b", color: "oklch(0.72 0.18 240)", bucket: "hot" },
  ]);
  const [dragId, setDragId] = useState<string | null>(null);
  const [wrong, setWrong] = useState<string | null>(null);

  const drop = (bucket: "cool" | "medium" | "hot") => {
    if (!dragId) return;
    setStars((prev) => prev.map((s) => {
      if (s.id !== dragId) return s;
      if (s.bucket === bucket) return { ...s, placed: bucket };
      setWrong(s.id); setTimeout(() => setWrong(null), 600);
      return s;
    }));
    setDragId(null);
  };

  const allPlaced = stars.every((s) => s.placed);
  if (allPlaced) setTimeout(() => onWin(5), 400);

  const buckets: { id: "cool" | "medium" | "hot"; label: string; temp: string; tint: string }[] = [
    { id: "cool", label: "Red — Cooler", temp: "~3,000 °C", tint: "from-red-500/30 to-orange-500/10" },
    { id: "medium", label: "Yellow — Medium", temp: "~5,500 °C", tint: "from-yellow-400/30 to-amber-300/10" },
    { id: "hot", label: "Blue — Hotter", temp: "~25,000 °C", tint: "from-blue-400/30 to-indigo-500/10" },
  ];

  return (
    <div className="glass rounded-3xl p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-center gap-4 rounded-2xl bg-white/5 p-4 ring-1 ring-border">
        {stars.filter((s) => !s.placed).map((s) => (
          <div
            key={s.id}
            draggable
            onDragStart={() => setDragId(s.id)}
            onClick={() => setDragId(dragId === s.id ? null : s.id)}
            className={`grid h-14 w-14 cursor-grab place-items-center rounded-full transition ${dragId === s.id ? "scale-110 ring-2 ring-primary" : ""} ${wrong === s.id ? "ring-2 ring-destructive" : ""}`}
            style={{ background: `radial-gradient(circle at 35% 35%, white, ${s.color})`, boxShadow: `0 0 18px ${s.color}` }}
          />
        ))}
        {stars.every((s) => s.placed) && <div className="text-sm text-muted-foreground">All placed!</div>}
      </div>

      <p className="mt-3 text-center text-xs text-muted-foreground">Tap a star, then tap the matching card. (Or drag.)</p>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {buckets.map((b) => {
          const placed = stars.find((s) => s.placed === b.id);
          return (
            <div
              key={b.id}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => drop(b.id)}
              onClick={() => drop(b.id)}
              className={`grid min-h-[140px] cursor-pointer place-items-center rounded-2xl bg-gradient-to-br ${b.tint} p-4 ring-1 ring-border transition hover:ring-primary`}
            >
              <div className="text-center">
                <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{b.temp}</div>
                <div className="mt-1 font-display font-semibold">{b.label}</div>
                {placed && (
                  <div
                    className="mx-auto mt-3 h-10 w-10 rounded-full"
                    style={{ background: `radial-gradient(circle at 35% 35%, white, ${placed.color})`, boxShadow: `0 0 14px ${placed.color}` }}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      <button onClick={() => setStars((p) => p.map((s) => ({ ...s, placed: undefined })))} className="mt-4 rounded-full bg-white/10 px-4 py-2 text-sm">Reset</button>
    </div>
  );
}

/* ===== Level 4: Brightness Explorer ===== */
function LevelBrightness({ onWin }: { onWin: (n: number) => void }) {
  const [target] = useState(() => 0.3 + Math.random() * 0.5);
  const [lum, setLum] = useState(0.5);
  const [dist, setDist] = useState(0.5);
  // apparent brightness = luminosity / distance^2 (normalized)
  const apparent = Math.min(1, lum / (dist * dist + 0.1));
  const diff = Math.abs(apparent - target);
  const matched = diff < 0.05;

  return (
    <div className="glass rounded-3xl p-4 sm:p-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl bg-gradient-to-b from-cosmos/40 to-background p-6 ring-1 ring-border">
          <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Target appearance</div>
          <div className="mt-6 grid h-40 place-items-center">
            <div className="rounded-full bg-white" style={{ width: 30 + target * 80, height: 30 + target * 80, opacity: 0.3 + target * 0.7, boxShadow: `0 0 ${20 + target * 60}px oklch(0.95 0.10 90 / ${0.6 + target * 0.4})` }} />
          </div>
        </div>
        <div className={`rounded-2xl bg-gradient-to-b from-cosmos/40 to-background p-6 ring-1 transition ${matched ? "ring-green-400/60" : "ring-border"}`}>
          <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Your star</div>
          <div className="mt-6 grid h-40 place-items-center">
            <div className="rounded-full bg-white" style={{ width: 30 + apparent * 80, height: 30 + apparent * 80, opacity: 0.3 + apparent * 0.7, boxShadow: `0 0 ${20 + apparent * 60}px oklch(0.95 0.10 90 / ${0.6 + apparent * 0.4})` }} />
          </div>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        <Slider label="True brightness (luminosity)" value={lum} onChange={setLum} />
        <Slider label="Distance from Earth" value={dist} onChange={setDist} />
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          onClick={() => matched && onWin(5)}
          disabled={!matched}
          className="rounded-full bg-primary px-5 py-2.5 font-semibold text-primary-foreground glow-primary disabled:opacity-40"
        >
          {matched ? "Lock in match ✨" : `Off by ${(diff * 100).toFixed(0)}%`}
        </button>
        <span className="text-sm text-muted-foreground">Brighter stars or closer stars look brighter from Earth.</span>
      </div>
    </div>
  );
}

function Slider({ label, value, onChange }: { label: string; value: number; onChange: (n: number) => void }) {
  return (
    <label className="block">
      <div className="mb-1.5 flex items-center justify-between text-sm">
        <span className="text-foreground/90">{label}</span>
        <span className="text-xs text-muted-foreground">{Math.round(value * 100)}%</span>
      </div>
      <input
        type="range" min={0.05} max={1} step={0.01} value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-[oklch(0.72_0.18_265)]"
      />
    </label>
  );
}

/* ===== Level 5: Create Your Own Sky ===== */
function LevelCreateSky({ onWin }: { onWin: (n: number) => void }) {
  const [pts, setPts] = useState<{ x: number; y: number }[]>([]);
  const [name, setName] = useState("");
  const [saved, setSaved] = useState(false);
  const { saveConstellation } = useGame();
  const boxRef = useRef<HTMLDivElement>(null);

  const onTap = (e: React.MouseEvent) => {
    if (!boxRef.current) return;
    const r = boxRef.current.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    setPts((p) => [...p, { x, y }]);
  };

  const save = () => {
    if (!name.trim() || pts.length < 3) return;
    saveConstellation({ name: name.trim(), points: pts });
    setSaved(true);
    setTimeout(() => onWin(7), 600);
  };

  return (
    <div className="glass rounded-3xl p-4 sm:p-6">
      <div
        ref={boxRef}
        onClick={onTap}
        className="relative aspect-[16/10] w-full cursor-crosshair overflow-hidden rounded-2xl bg-gradient-to-b from-cosmos/50 to-background ring-1 ring-border"
      >
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 62.5" preserveAspectRatio="none">
          {pts.slice(1).map((p, i) => (
            <line key={i} x1={pts[i].x} y1={pts[i].y * 0.625} x2={p.x} y2={p.y * 0.625} stroke="oklch(0.85 0.14 85 / 0.7)" strokeWidth="0.3" />
          ))}
        </svg>
        {pts.map((p, i) => (
          <span key={i} className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-white star-glow"
            style={{ left: `${p.x}%`, top: `${p.y}%`, width: 14, height: 14 }} />
        ))}
        {pts.length === 0 && (
          <div className="absolute inset-0 grid place-items-center text-sm text-muted-foreground">Tap anywhere to place stars</div>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name your constellation"
          className="min-w-0 flex-1 rounded-full bg-white/5 px-4 py-2.5 text-sm ring-1 ring-border placeholder:text-muted-foreground focus:outline-none focus:ring-primary"
        />
        <button onClick={() => setPts([])} className="rounded-full bg-white/10 px-4 py-2 text-sm">Clear</button>
        <button
          onClick={save}
          disabled={!name.trim() || pts.length < 3 || saved}
          className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground glow-primary disabled:opacity-40"
        >
          {saved ? "Saved!" : "Save to logbook"}
        </button>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">Place at least 3 stars and give your constellation a name.</p>
    </div>
  );
}
