import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageShell } from "@/components/PageShell";
import { NarrationBar } from "@/components/NarrationBar";
import { RewardBurst } from "@/components/RewardBurst";
import { SourceChip } from "@/components/SourceChip";
import { chapters } from "@/data/storyScripts";
import { constellations } from "@/data/constellations";
import { motionStars } from "@/data/starMotion";
import { useGame } from "@/lib/game-store";
import { useSfx } from "@/lib/audio";
import { ChevronRight, Play, RefreshCw, Pause, Target } from "lucide-react";

export const Route = createFileRoute("/story/$chapter")({
  head: ({ params }) => {
    const c = chapters.find((x) => x.id === params.chapter);
    return { meta: [{ title: `${c?.title ?? "Chapter"} — Diamond In The Sky` }] };
  },
  component: ChapterPage,
  notFoundComponent: () => (
    <PageShell><p>Chapter not found.</p></PageShell>
  ),
});

function ChapterPage() {
  const { chapter } = Route.useParams();
  const c = chapters.find((x) => x.id === chapter);
  const navigate = useNavigate();
  const { completeChapter, earnBadge } = useGame();
  const sfx = useSfx();
  const [phase, setPhase] = useState<"intro" | "play" | "done">("intro");
  const [introIdx, setIntroIdx] = useState(0);

  if (!c) return null;

  const next = chapters.find((x) => x.number === c.number + 1);

  const onWin = () => {
    completeChapter(c.id, c.reward);
    earnBadge(c.badgeId);
    sfx("win");
    setPhase("done");
  };

  return (
    <PageShell>
      <Link to="/story" className="text-xs text-muted-foreground hover:text-foreground">← All chapters</Link>

      <AnimatePresence mode="wait">
        {phase === "intro" && (
          <motion.section key="intro" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} className="mt-4 glass rounded-3xl p-6 sm:p-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-accent">Chapter {c.number}</p>
            <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl"><span className="mr-2">{c.emoji}</span>{c.title}</h1>

            <p className="mt-5 text-lg leading-relaxed text-foreground/90">{c.intro[introIdx]}</p>

            <div className="mt-4 flex gap-1.5">
              {c.intro.map((_, i) => (
                <span key={i} className={`h-1 rounded-full transition-all ${i === introIdx ? "w-8 bg-primary" : "w-1.5 bg-white/15"}`} />
              ))}
            </div>

            <div className="mt-5 rounded-2xl bg-white/5 p-4 ring-1 ring-border">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <Target className="h-3.5 w-3.5 text-gold" /> Your mission
              </div>
              <p className="mt-2 text-sm">{c.mission}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {c.sourceIds.map((s) => <SourceChip key={s} sourceId={s} />)}
              </div>
            </div>

            <div className="mt-6"><NarrationBar text={c.intro[introIdx]} autoplay /></div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={() => {
                  if (introIdx < c.intro.length - 1) setIntroIdx(introIdx + 1);
                  else setPhase("play");
                }}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground glow-primary"
              >
                {introIdx < c.intro.length - 1 ? "Continue" : "Begin mission"} <ChevronRight className="h-4 w-4" />
              </button>
              <button onClick={() => setPhase("play")} className="rounded-full bg-white/10 px-5 py-3 text-sm font-medium">
                Skip narration
              </button>
            </div>
          </motion.section>
        )}

        {phase === "play" && (
          <motion.section key="play" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} className="mt-4">
            <ChapterMission chapter={c.id} onWin={onWin} />
          </motion.section>
        )}

        {phase === "done" && (
          <motion.section key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mt-6 glass rounded-3xl p-8 sm:p-10">
            <RewardBurst
              emoji={c.emoji}
              title={c.outro}
              stars={c.reward.stars}
              coins={c.reward.coins}
              xp={c.reward.xp}
              diamonds={1}
            />
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <button onClick={() => { setPhase("intro"); setIntroIdx(0); }} className="inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2.5 font-semibold">
                <RefreshCw className="h-4 w-4" /> Replay
              </button>
              {next ? (
                <button
                  onClick={() => { navigate({ to: "/story/$chapter", params: { chapter: next.id } }); setPhase("intro"); setIntroIdx(0); }}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 font-semibold text-primary-foreground glow-primary"
                >
                  Next chapter <ChevronRight className="h-4 w-4" />
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

/* ===== Mission router ===== */
function ChapterMission({ chapter, onWin }: { chapter: string; onWin: () => void }) {
  if (chapter === "lost-constellation") return <MissionConnect onWin={onWin} />;
  if (chapter === "mystery-of-brightness") return <MissionBrightness onWin={onWin} />;
  if (chapter === "create-your-own-star") return <MissionCreateStar onWin={onWin} />;
  if (chapter === "dancing-stars") return <MissionDancing onWin={onWin} />;
  if (chapter === "time-traveler") return <MissionTimeTravel onWin={onWin} />;
  if (chapter === "build-your-constellation") return <MissionBuildConstellation onWin={onWin} />;
  return null;
}

/* ===== Chapter 1 — Connect constellation (real data) ===== */
function MissionConnect({ onWin }: { onWin: () => void }) {
  const [cIdx, setCIdx] = useState(() => Math.floor(Math.random() * Math.min(3, constellations.length)));
  const c = constellations[cIdx];
  const [tapped, setTapped] = useState<number[]>([]);
  const sfx = useSfx();
  const requiredEdges = c.edges;

  const click = (i: number) => {
    setTapped((prev) => {
      if (prev.includes(i)) return prev;
      sfx("click");
      const nextArr = [...prev, i];
      // win when every required edge is satisfied (both endpoints tapped, in any order)
      if (nextArr.length === c.stars.length) {
        sfx("success");
        setTimeout(onWin, 700);
      }
      return nextArr;
    });
  };

  return (
    <div className="glass rounded-3xl p-4 sm:p-6">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-display font-semibold">{c.name}</h3>
        <button onClick={() => { setCIdx((cIdx + 1) % constellations.length); setTapped([]); }} className="rounded-full bg-white/10 px-3 py-1.5 text-xs">Try another</button>
      </div>
      <p className="mb-3 text-xs text-muted-foreground">{c.story}</p>
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-gradient-to-b from-cosmos/50 to-background ring-1 ring-border">
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 62.5" preserveAspectRatio="none">
          {requiredEdges.map(([a, b], i) => {
            const lit = tapped.includes(a) && tapped.includes(b);
            const A = c.stars[a], B = c.stars[b];
            return (
              <line key={i} x1={A.x} y1={A.y * 0.625} x2={B.x} y2={B.y * 0.625}
                stroke={lit ? "oklch(0.85 0.14 85)" : "oklch(0.85 0.05 270 / 0.15)"}
                strokeWidth={lit ? 0.4 : 0.2} strokeLinecap="round" />
            );
          })}
        </svg>
        {c.stars.map((s, i) => {
          const isTapped = tapped.includes(i);
          return (
            <button
              key={i}
              onClick={() => click(i)}
              className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-white transition ${isTapped ? "star-glow scale-110" : "animate-pulse"}`}
              style={{ left: `${s.x}%`, top: `${s.y}%`, width: 16, height: 16 }}
              aria-label={s.name}
            >
              <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] text-muted-foreground">{s.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ===== Chapter 2 — Brightness (multi-slider) ===== */
function MissionBrightness({ onWin }: { onWin: () => void }) {
  const [target] = useState(() => 0.3 + Math.random() * 0.5);
  const [mass, setMass] = useState(0.5);
  const [temp, setTemp] = useState(0.5);
  const [dist, setDist] = useState(0.5);
  // luminosity ~ mass^3 * temp (toy)
  const lum = Math.pow(mass, 2.5) * (0.5 + temp);
  const apparent = Math.min(1, lum / (dist * dist + 0.1));
  const diff = Math.abs(apparent - target);
  const matched = diff < 0.05;
  const color = `oklch(${0.7 + temp * 0.2} ${0.12 + temp * 0.1} ${320 - temp * 320})`;

  return (
    <div className="glass rounded-3xl p-4 sm:p-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <Panel label="Target star" >
          <Orb size={40 + target * 80} glow={target} color="oklch(0.95 0.04 95)" />
        </Panel>
        <Panel label="Your star" highlight={matched}>
          <Orb size={40 + apparent * 80} glow={apparent} color={color} />
        </Panel>
      </div>
      <div className="mt-5 space-y-4">
        <Slider label="Mass"        value={mass} onChange={setMass} />
        <Slider label="Temperature" value={temp} onChange={setTemp} />
        <Slider label="Distance"    value={dist} onChange={setDist} />
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button onClick={() => matched && onWin()} disabled={!matched}
          className="rounded-full bg-primary px-5 py-2.5 font-semibold text-primary-foreground glow-primary disabled:opacity-40">
          {matched ? "Lock in match ✨" : `Off by ${(diff * 100).toFixed(0)}%`}
        </button>
        <SourceChip sourceId="starchild_cepheids" />
      </div>
    </div>
  );
}

/* ===== Chapter 3 — Create your own star ===== */
function MissionCreateStar({ onWin }: { onWin: () => void }) {
  const { saveStar } = useGame();
  const [mass, setMass] = useState(0.6);
  const [temp, setTemp] = useState(0.7);
  const [size, setSize] = useState(0.5);
  const [spin, setSpin] = useState(0.4);
  const [name, setName] = useState("");
  const [saved, setSaved] = useState(false);
  const color = `oklch(${0.65 + temp * 0.25} ${0.15 + temp * 0.1} ${340 - temp * 320})`;

  const save = () => {
    if (!name.trim()) return;
    saveStar({
      id: `${Date.now()}`, name: name.trim(),
      mass, temperature: temp, size, color, spin,
      createdAt: Date.now(),
    });
    setSaved(true);
    setTimeout(onWin, 700);
  };

  return (
    <div className="glass rounded-3xl p-4 sm:p-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="grid place-items-center rounded-2xl bg-gradient-to-b from-cosmos/50 to-background p-6 ring-1 ring-border" style={{ minHeight: 280 }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 30 / (0.2 + spin), repeat: Infinity, ease: "linear" }}
            className="rounded-full"
            style={{
              width: 80 + size * 140,
              height: 80 + size * 140,
              background: `radial-gradient(circle at 35% 35%, white, ${color})`,
              boxShadow: `0 0 ${30 + temp * 80}px ${color}`,
            }}
          />
        </div>
        <div className="space-y-4">
          <Slider label="Mass"        value={mass} onChange={setMass} />
          <Slider label="Temperature" value={temp} onChange={setTemp} />
          <Slider label="Size"        value={size} onChange={setSize} />
          <Slider label="Spin"        value={spin} onChange={setSpin} />
          <input
            value={name} onChange={(e) => setName(e.target.value)}
            placeholder="Name your star"
            className="w-full rounded-full bg-white/5 px-4 py-2.5 text-sm ring-1 ring-border focus:outline-none focus:ring-primary"
          />
          <button onClick={save} disabled={!name.trim() || saved}
            className="w-full rounded-full bg-primary px-5 py-2.5 font-semibold text-primary-foreground glow-primary disabled:opacity-40">
            {saved ? "Saved to logbook!" : "Save my star"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ===== Chapter 4 — Dancing stars (proper motion + binary) ===== */
function MissionDancing({ onWin }: { onWin: () => void }) {
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(true);
  const ref = useRef<number | null>(null);
  useEffect(() => {
    if (!playing) return;
    const tick = () => { setT((x) => x + 0.5); ref.current = requestAnimationFrame(tick); };
    ref.current = requestAnimationFrame(tick);
    return () => { if (ref.current) cancelAnimationFrame(ref.current); };
  }, [playing]);

  useEffect(() => { if (t > 80) onWin(); }, [t, onWin]);

  return (
    <div className="glass rounded-3xl p-4 sm:p-6">
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <button onClick={() => setPlaying(!playing)} className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground glow-primary">
          {playing ? <><Pause className="h-3.5 w-3.5"/> Pause</> : <><Play className="h-3.5 w-3.5"/> Play</>}
        </button>
        <div className="text-xs text-muted-foreground">Years elapsed: <span className="font-bold text-foreground">{Math.floor(t * 1000)}</span></div>
        <div className="ml-auto"><SourceChip sourceId="gcvs" /></div>
      </div>
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-gradient-to-b from-cosmos/50 to-background ring-1 ring-border">
        {motionStars.map((s) => {
          const x = ((s.x + s.vx * t) + 100) % 100;
          const y = ((s.y + s.vy * t) + 100) % 100;
          const sz = Math.max(6, 18 - s.magnitude);
          return (
            <div key={s.id} className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{ left: `${x}%`, top: `${y}%`, width: sz, height: sz,
                background: `radial-gradient(circle at 35% 35%, white, ${s.color})`,
                boxShadow: `0 0 12px ${s.color}` }}>
              <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] text-muted-foreground">{s.name}</span>
            </div>
          );
        })}
        {/* binary orbit decor */}
        <div className="absolute right-8 top-8 h-24 w-24">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 6, repeat: Infinity, ease: "linear" }} className="relative h-full w-full">
            <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-300 shadow-[0_0_12px_rgba(250,200,80,0.8)]" style={{ transform: "translate(-30px, 0)" }} />
            <div className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-rose-300 shadow-[0_0_12px_rgba(250,150,150,0.8)]" style={{ transform: "translate(30px, 0)" }} />
          </motion.div>
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] text-muted-foreground">Binary pair</div>
        </div>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">Stars look fixed but every one is in motion. Press pause to inspect.</p>
    </div>
  );
}

/* ===== Chapter 5 — Time traveler ===== */
function MissionTimeTravel({ onWin }: { onWin: () => void }) {
  const eras = [0, 100, 500, 1000, 5000];
  const [eraIdx, setEraIdx] = useState(0);
  const era = eras[eraIdx];

  const positions = useMemo(() => motionStars.map((s) => ({
    ...s,
    px: ((s.x + s.vx * (era / 100)) + 100) % 100,
    py: ((s.y + s.vy * (era / 100)) + 100) % 100,
  })), [era]);

  return (
    <div className="glass rounded-3xl p-4 sm:p-6">
      <div className="mb-3 flex items-center justify-between">
        <div className="text-xs text-muted-foreground">Years from now</div>
        <div className="font-display text-2xl font-bold text-gold">+{era.toLocaleString()}</div>
      </div>
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-gradient-to-b from-cosmos/50 to-background ring-1 ring-border">
        {positions.map((s) => (
          <motion.div
            key={s.id}
            layout
            animate={{ left: `${s.px}%`, top: `${s.py}%` }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ width: Math.max(6, 18 - s.magnitude), height: Math.max(6, 18 - s.magnitude),
              background: `radial-gradient(circle at 35% 35%, white, ${s.color})`, boxShadow: `0 0 12px ${s.color}` }}
          >
            <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] text-muted-foreground">{s.name}</span>
          </motion.div>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {eras.map((y, i) => (
          <button key={y} onClick={() => setEraIdx(i)}
            className={`rounded-full px-4 py-2 text-xs font-semibold transition ${i === eraIdx ? "bg-primary text-primary-foreground glow-primary" : "bg-white/10 hover:bg-white/20"}`}>
            +{y.toLocaleString()} y
          </button>
        ))}
        <button onClick={onWin} disabled={eraIdx < eras.length - 1}
          className="ml-auto rounded-full bg-accent px-5 py-2 text-sm font-semibold text-accent-foreground disabled:opacity-40">
          Finish journey
        </button>
      </div>
    </div>
  );
}

/* ===== Chapter 6 — Build your own constellation ===== */
function MissionBuildConstellation({ onWin }: { onWin: () => void }) {
  const { saveConstellation } = useGame();
  const [pts, setPts] = useState<{ x: number; y: number }[]>([]);
  const [name, setName] = useState("");
  const [story, setStory] = useState("");
  const [saved, setSaved] = useState(false);
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
    saveConstellation({ name: name.trim(), story: story.trim() || undefined, points: pts });
    setSaved(true);
    setTimeout(onWin, 700);
  };

  return (
    <div className="glass rounded-3xl p-4 sm:p-6">
      <div ref={boxRef} onClick={onTap}
        className="relative aspect-[16/10] w-full cursor-crosshair overflow-hidden rounded-2xl bg-gradient-to-b from-cosmos/50 to-background ring-1 ring-border">
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 62.5" preserveAspectRatio="none">
          {pts.slice(1).map((p, i) => (
            <line key={i} x1={pts[i].x} y1={pts[i].y * 0.625} x2={p.x} y2={p.y * 0.625}
              stroke="oklch(0.85 0.14 85 / 0.7)" strokeWidth="0.3" />
          ))}
        </svg>
        {pts.map((p, i) => (
          <span key={i} className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-white star-glow"
            style={{ left: `${p.x}%`, top: `${p.y}%`, width: 14, height: 14 }} />
        ))}
        {pts.length === 0 && <div className="absolute inset-0 grid place-items-center text-sm text-muted-foreground">Tap anywhere to place stars</div>}
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name your constellation"
          className="rounded-full bg-white/5 px-4 py-2.5 text-sm ring-1 ring-border focus:outline-none focus:ring-primary" />
        <input value={story} onChange={(e) => setStory(e.target.value)} placeholder="Tell its story (optional)"
          className="rounded-full bg-white/5 px-4 py-2.5 text-sm ring-1 ring-border focus:outline-none focus:ring-primary" />
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button onClick={() => setPts([])} className="rounded-full bg-white/10 px-4 py-2 text-sm">Clear</button>
        <button onClick={save} disabled={!name.trim() || pts.length < 3 || saved}
          className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground glow-primary disabled:opacity-40">
          {saved ? "Saved!" : "Save to logbook"}
        </button>
        <span className="text-xs text-muted-foreground">Place at least 3 stars.</span>
      </div>
    </div>
  );
}

/* ===== Small reusable bits ===== */
function Slider({ label, value, onChange }: { label: string; value: number; onChange: (n: number) => void }) {
  return (
    <label className="block">
      <div className="mb-1.5 flex items-center justify-between text-sm">
        <span>{label}</span><span className="text-xs text-muted-foreground">{Math.round(value * 100)}%</span>
      </div>
      <input type="range" min={0.05} max={1} step={0.01} value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-[oklch(0.72_0.18_265)]" />
    </label>
  );
}

function Panel({ label, highlight, children }: { label: string; highlight?: boolean; children: React.ReactNode }) {
  return (
    <div className={`rounded-2xl bg-gradient-to-b from-cosmos/40 to-background p-6 ring-1 transition ${highlight ? "ring-green-400/60" : "ring-border"}`}>
      <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="mt-6 grid h-40 place-items-center">{children}</div>
    </div>
  );
}

function Orb({ size, glow, color }: { size: number; glow: number; color: string }) {
  return (
    <div className="rounded-full"
      style={{ width: size, height: size, background: `radial-gradient(circle at 35% 35%, white, ${color})`,
        boxShadow: `0 0 ${20 + glow * 60}px ${color}`, opacity: 0.4 + glow * 0.6 }} />
  );
}
