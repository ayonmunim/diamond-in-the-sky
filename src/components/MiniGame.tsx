import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X } from "lucide-react";
import type { GameConfig } from "@/data/starMissions";
import { useSfx } from "@/lib/audio";

/**
 * Dispatcher mini-game component. Each level picks one variant from
 * GameConfig — quiz, fuse, sequence, sort, match, memory, tap.
 * Calls `onComplete(mistakes)` when the player successfully finishes.
 */
export function MiniGame({
  config,
  onComplete,
}: {
  config: GameConfig;
  onComplete: (mistakes: number) => void;
}) {
  switch (config.type) {
    case "quiz":     return <QuizGame     c={config} onComplete={onComplete} />;
    case "fuse":     return <FuseGame     c={config} onComplete={onComplete} />;
    case "sequence": return <SequenceGame c={config} onComplete={onComplete} />;
    case "sort":     return <SortGame     c={config} onComplete={onComplete} />;
    case "match":    return <MatchGame    c={config} onComplete={onComplete} />;
    case "memory":   return <MemoryGame   c={config} onComplete={onComplete} />;
    case "tap":      return <TapGame      c={config} onComplete={onComplete} />;
  }
}

/* ───────────────────── Quiz ───────────────────── */

function QuizGame({ c, onComplete }: { c: Extract<GameConfig, { type: "quiz" }>; onComplete: (m: number) => void }) {
  const sfx = useSfx();
  const [picked, setPicked] = useState<number | null>(null);
  const [mistakes, setMistakes] = useState(0);

  const handle = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    if (i === c.correctIndex) {
      sfx("win");
      window.setTimeout(() => onComplete(mistakes), 1400);
    } else {
      sfx("wrong");
      setMistakes((m) => m + 1);
      window.setTimeout(() => setPicked(null), 900);
    }
  };

  return (
    <div className="mx-auto w-full max-w-xl">
      <h3 className="text-center font-display text-xl font-bold text-white sm:text-2xl">{c.question}</h3>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {c.options.map((opt, i) => {
          const correct = picked !== null && i === c.correctIndex;
          const wrong = picked === i && i !== c.correctIndex;
          return (
            <motion.button
              key={i}
              whileTap={{ scale: 0.95 }}
              onClick={() => handle(i)}
              disabled={picked !== null}
              className={`relative rounded-2xl px-4 py-4 text-left text-base font-semibold text-white ring-1 transition-all ${
                correct ? "bg-emerald-500/30 ring-emerald-300" :
                wrong   ? "bg-rose-500/30 ring-rose-300 animate-[wiggle_.3s]" :
                          "bg-white/8 ring-white/20 hover:bg-white/14"
              }`}
            >
              <span className="mr-2 text-white/55">{String.fromCharCode(65 + i)}.</span>
              {opt}
              {correct && <Check className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-emerald-300" />}
              {wrong   && <X     className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-rose-300" />}
            </motion.button>
          );
        })}
      </div>
      {picked === c.correctIndex && c.explain && (
        <motion.div
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="mt-4 rounded-2xl bg-emerald-500/15 px-4 py-3 text-sm text-emerald-100 ring-1 ring-emerald-300/40"
        >
          {c.explain}
        </motion.div>
      )}
    </div>
  );
}

/* ───────────────────── Fuse ───────────────────── */

function FuseGame({ c, onComplete }: { c: Extract<GameConfig, { type: "fuse" }>; onComplete: (m: number) => void }) {
  const sfx = useSfx();
  const [tapped, setTapped] = useState(0);
  const [done, setDone] = useState(false);

  const tap = () => {
    sfx("click");
    const next = tapped + 1;
    setTapped(next);
    if (next >= c.needed) {
      setDone(true);
      sfx("win");
      window.setTimeout(() => onComplete(0), 1800);
    }
  };

  return (
    <div className="mx-auto w-full max-w-xl text-center">
      <h3 className="font-display text-lg font-bold text-white sm:text-xl">{c.prompt}</h3>
      <div className="mt-6 grid grid-cols-4 gap-3">
        {Array.from({ length: c.needed }).map((_, i) => {
          const active = i < tapped;
          return (
            <motion.button
              key={i}
              whileTap={{ scale: 0.9 }}
              onClick={() => !active && !done && tap()}
              disabled={active || done}
              className={`aspect-square grid place-items-center rounded-full text-3xl transition-all ${
                active ? "bg-emerald-500/30 ring-2 ring-emerald-300 opacity-50" : "bg-white/10 ring-1 ring-white/20 hover:bg-white/15"
              }`}
            >
              {active ? "✓" : c.ingredientEmoji}
            </motion.button>
          );
        })}
      </div>
      <div className="mt-3 text-xs font-semibold uppercase tracking-wider text-white/70">
        {c.ingredientLabel} · {tapped} / {c.needed}
      </div>

      <AnimatePresence>
        {done && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 240 }}
            className="mt-8 inline-flex flex-col items-center gap-2"
          >
            <div className="grid h-28 w-28 place-items-center rounded-full bg-gold/30 text-6xl ring-2 ring-gold animate-pulse">
              {c.resultEmoji}
            </div>
            <div className="font-display text-lg font-bold text-gold">{c.resultLabel} formed!</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ───────────────────── Sequence ───────────────────── */

function SequenceGame({ c, onComplete }: { c: Extract<GameConfig, { type: "sequence" }>; onComplete: (m: number) => void }) {
  const sfx = useSfx();
  const [step, setStep] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [wrongIdx, setWrongIdx] = useState<number | null>(null);

  // Render in shuffled order (stable per mount)
  const shuffled = useMemo(() => {
    const idxs = c.ordered.map((_, i) => i);
    for (let i = idxs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [idxs[i], idxs[j]] = [idxs[j], idxs[i]];
    }
    return idxs;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [picked, setPicked] = useState<number[]>([]);

  const tap = (origIdx: number) => {
    if (picked.includes(origIdx)) return;
    if (origIdx === step) {
      sfx("click");
      const nextStep = step + 1;
      setStep(nextStep);
      setPicked([...picked, origIdx]);
      if (nextStep >= c.ordered.length) {
        sfx("win");
        window.setTimeout(() => onComplete(mistakes), 900);
      }
    } else {
      sfx("wrong");
      setMistakes((m) => m + 1);
      setWrongIdx(origIdx);
      window.setTimeout(() => setWrongIdx(null), 500);
    }
  };

  return (
    <div className="mx-auto w-full max-w-xl text-center">
      <h3 className="font-display text-lg font-bold text-white sm:text-xl">{c.prompt}</h3>
      <div className="mt-3 text-xs font-semibold uppercase tracking-wider text-gold">
        Step {Math.min(step + 1, c.ordered.length)} / {c.ordered.length}
      </div>

      {/* Path display */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        {c.ordered.map((it, i) => (
          <div key={i} className="flex items-center gap-1">
            <div className={`rounded-xl px-2 py-1 text-xs font-bold ring-1 ${
              i < step ? "bg-emerald-500/25 text-emerald-200 ring-emerald-300/40" : "bg-white/5 text-white/45 ring-white/15"
            }`}>
              {i < step ? `${it.emoji ?? ""} ${it.label}` : "?"}
            </div>
            {i < c.ordered.length - 1 && <span className="text-white/30">→</span>}
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {shuffled.map((origIdx) => {
          const it = c.ordered[origIdx];
          const used = picked.includes(origIdx);
          const isWrong = wrongIdx === origIdx;
          return (
            <motion.button
              key={origIdx}
              whileTap={{ scale: 0.94 }}
              onClick={() => tap(origIdx)}
              disabled={used}
              className={`rounded-2xl p-4 text-base font-semibold text-white ring-1 transition-all ${
                used ? "bg-emerald-500/25 ring-emerald-300/50 opacity-50" :
                isWrong ? "bg-rose-500/30 ring-rose-300 animate-[wiggle_.3s]" :
                "bg-white/8 ring-white/20 hover:bg-white/14"
              }`}
            >
              {it.emoji && <div className="text-2xl">{it.emoji}</div>}
              <div className="mt-1">{it.label}</div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

/* ───────────────────── Sort ───────────────────── */

function SortGame({ c, onComplete }: { c: Extract<GameConfig, { type: "sort" }>; onComplete: (m: number) => void }) {
  const sfx = useSfx();
  const [placed, setPlaced] = useState<Record<number, string>>({});
  const [selected, setSelected] = useState<number | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const [flash, setFlash] = useState<{ idx: number; ok: boolean } | null>(null);

  const remaining = c.items.filter((_, i) => !(i in placed));

  const place = (bucketId: string) => {
    if (selected === null) return;
    const item = c.items[selected];
    if (item.bucketId === bucketId) {
      sfx("click");
      setFlash({ idx: selected, ok: true });
      setPlaced({ ...placed, [selected]: bucketId });
      setSelected(null);
      if (Object.keys(placed).length + 1 >= c.items.length) {
        sfx("win");
        window.setTimeout(() => onComplete(mistakes), 700);
      }
    } else {
      sfx("wrong");
      setMistakes((m) => m + 1);
      setFlash({ idx: selected, ok: false });
      window.setTimeout(() => setFlash(null), 500);
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl text-center">
      <h3 className="font-display text-lg font-bold text-white sm:text-xl">{c.prompt}</h3>
      <div className="mt-2 text-xs text-white/60">Tap an item, then tap a bucket.</div>

      {/* Items pool */}
      <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
        {c.items.map((it, i) => {
          if (i in placed) return null;
          const isSel = selected === i;
          const isFlash = flash?.idx === i;
          return (
            <motion.button
              key={i}
              whileTap={{ scale: 0.92 }}
              onClick={() => setSelected(isSel ? null : i)}
              className={`rounded-2xl px-3 py-2 text-sm font-semibold text-white ring-1 transition-all ${
                isSel ? "bg-gold/30 ring-gold scale-105" :
                isFlash && !flash!.ok ? "bg-rose-500/30 ring-rose-300 animate-[wiggle_.3s]" :
                "bg-white/8 ring-white/20 hover:bg-white/14"
              }`}
            >
              {it.emoji && <span className="mr-1">{it.emoji}</span>}{it.label}
            </motion.button>
          );
        })}
        {remaining.length === 0 && <div className="text-sm text-emerald-300">All sorted!</div>}
      </div>

      {/* Buckets */}
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {c.buckets.map((b) => {
          const items = Object.entries(placed).filter(([, bid]) => bid === b.id);
          return (
            <button
              key={b.id}
              onClick={() => place(b.id)}
              className="min-h-32 rounded-2xl border-2 border-dashed border-white/20 bg-white/4 p-3 text-white transition hover:border-gold/50 hover:bg-white/8"
            >
              <div className="text-lg font-bold">{b.emoji} {b.label}</div>
              <div className="mt-2 flex flex-wrap justify-center gap-1">
                {items.map(([idx]) => {
                  const it = c.items[Number(idx)];
                  return (
                    <span key={idx} className="rounded-full bg-emerald-500/25 px-2 py-0.5 text-xs ring-1 ring-emerald-300/40">
                      {it.emoji} {it.label}
                    </span>
                  );
                })}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ───────────────────── Match (column pairs) ───────────────────── */

function MatchGame({ c, onComplete }: { c: Extract<GameConfig, { type: "match" }>; onComplete: (m: number) => void }) {
  const sfx = useSfx();
  const [pickedA, setPickedA] = useState<number | null>(null);
  const [solved, setSolved] = useState<Set<number>>(new Set());
  const [mistakes, setMistakes] = useState(0);
  const [flash, setFlash] = useState<{ b: number; ok: boolean } | null>(null);

  // Shuffle B column
  const bOrder = useMemo(() => {
    const idxs = c.pairs.map((_, i) => i);
    for (let i = idxs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [idxs[i], idxs[j]] = [idxs[j], idxs[i]];
    }
    return idxs;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tryB = (bOrig: number) => {
    if (pickedA === null) return;
    if (pickedA === bOrig) {
      sfx("click");
      const ns = new Set(solved); ns.add(bOrig);
      setSolved(ns);
      setPickedA(null);
      if (ns.size >= c.pairs.length) {
        sfx("win");
        window.setTimeout(() => onComplete(mistakes), 700);
      }
    } else {
      sfx("wrong");
      setMistakes((m) => m + 1);
      setFlash({ b: bOrig, ok: false });
      window.setTimeout(() => { setFlash(null); setPickedA(null); }, 500);
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl">
      <h3 className="text-center font-display text-lg font-bold text-white sm:text-xl">{c.prompt}</h3>
      <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-5">
        <div className="space-y-2">
          {c.pairs.map((p, i) => {
            const done = solved.has(i);
            const sel = pickedA === i;
            return (
              <button
                key={i}
                disabled={done}
                onClick={() => setPickedA(sel ? null : i)}
                className={`block w-full rounded-2xl px-4 py-3 text-left text-sm font-semibold text-white ring-1 transition ${
                  done ? "bg-emerald-500/25 ring-emerald-300/50 opacity-60" :
                  sel ? "bg-gold/25 ring-gold scale-[1.02]" :
                  "bg-white/8 ring-white/20 hover:bg-white/14"
                }`}
              >
                {p.a}
              </button>
            );
          })}
        </div>
        <div className="space-y-2">
          {bOrder.map((origIdx) => {
            const p = c.pairs[origIdx];
            const done = solved.has(origIdx);
            const isFlash = flash?.b === origIdx;
            return (
              <button
                key={origIdx}
                disabled={done}
                onClick={() => tryB(origIdx)}
                className={`block w-full rounded-2xl px-4 py-3 text-left text-sm font-semibold text-white ring-1 transition ${
                  done ? "bg-emerald-500/25 ring-emerald-300/50 opacity-60" :
                  isFlash ? "bg-rose-500/30 ring-rose-300 animate-[wiggle_.3s]" :
                  "bg-white/8 ring-white/20 hover:bg-white/14"
                }`}
              >
                {p.b}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ───────────────────── Memory (card flip) ───────────────────── */

function MemoryGame({ c, onComplete }: { c: Extract<GameConfig, { type: "memory" }>; onComplete: (m: number) => void }) {
  const sfx = useSfx();
  type Card = { key: string; pairId: number; text: string };
  const cards = useMemo<Card[]>(() => {
    const arr: Card[] = [];
    c.pairs.forEach((p, i) => {
      arr.push({ key: `a${i}`, pairId: i, text: p.a });
      arr.push({ key: `b${i}`, pairId: i, text: p.b });
    });
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [flipped, setFlipped] = useState<string[]>([]);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [mistakes, setMistakes] = useState(0);
  const [locked, setLocked] = useState(false);

  const flip = (k: string) => {
    if (locked || flipped.includes(k) || matched.has(k)) return;
    const nf = [...flipped, k];
    setFlipped(nf);
    sfx("click");
    if (nf.length === 2) {
      const [a, b] = nf.map((kk) => cards.find((c) => c.key === kk)!);
      if (a.pairId === b.pairId) {
        const nm = new Set(matched); nm.add(a.key); nm.add(b.key);
        setMatched(nm);
        setFlipped([]);
        if (nm.size >= cards.length) {
          sfx("win");
          window.setTimeout(() => onComplete(mistakes), 700);
        }
      } else {
        setLocked(true);
        setMistakes((m) => m + 1);
        sfx("wrong");
        window.setTimeout(() => { setFlipped([]); setLocked(false); }, 800);
      }
    }
  };

  return (
    <div className="mx-auto w-full max-w-xl text-center">
      <h3 className="font-display text-lg font-bold text-white sm:text-xl">{c.prompt}</h3>
      <div className={`mt-5 grid gap-2 ${cards.length <= 8 ? "grid-cols-4" : "grid-cols-4 sm:grid-cols-5"}`}>
        {cards.map((card) => {
          const shown = flipped.includes(card.key) || matched.has(card.key);
          const done = matched.has(card.key);
          return (
            <motion.button
              key={card.key}
              whileTap={{ scale: 0.95 }}
              onClick={() => flip(card.key)}
              className={`relative aspect-[3/4] rounded-xl text-xs font-semibold text-white ring-1 transition-all ${
                done ? "bg-emerald-500/25 ring-emerald-300/50" :
                shown ? "bg-white/15 ring-gold" :
                "bg-gradient-to-br from-indigo-500/40 to-purple-700/40 ring-white/20 hover:ring-white/40"
              }`}
            >
              <span className={`${shown ? "" : "opacity-0"} px-1 leading-tight transition-opacity`}>{card.text}</span>
              {!shown && <span className="absolute inset-0 grid place-items-center text-2xl">✦</span>}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

/* ───────────────────── Tap (multi-select TRUE) ───────────────────── */

function TapGame({ c, onComplete }: { c: Extract<GameConfig, { type: "tap" }>; onComplete: (m: number) => void }) {
  const sfx = useSfx();
  const [tapped, setTapped] = useState<Set<number>>(new Set());
  const [mistakes, setMistakes] = useState(0);
  const [flash, setFlash] = useState<{ idx: number; ok: boolean } | null>(null);

  const tap = (i: number) => {
    if (tapped.has(i)) return;
    const t = c.targets[i];
    if (t.correct) {
      sfx("click");
      const ns = new Set(tapped); ns.add(i);
      setTapped(ns);
      setFlash({ idx: i, ok: true });
      window.setTimeout(() => setFlash(null), 400);
      const correctCount = Array.from(ns).filter((k) => c.targets[k].correct).length;
      if (correctCount >= c.needCorrect) {
        sfx("win");
        window.setTimeout(() => onComplete(mistakes), 700);
      }
    } else {
      sfx("wrong");
      setMistakes((m) => m + 1);
      setFlash({ idx: i, ok: false });
      window.setTimeout(() => setFlash(null), 500);
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl text-center">
      <h3 className="font-display text-lg font-bold text-white sm:text-xl">{c.prompt}</h3>
      <div className="mt-3 text-xs font-semibold uppercase tracking-wider text-gold">
        Find {c.needCorrect} true facts
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {c.targets.map((t, i) => {
          const done = tapped.has(i);
          const f = flash?.idx === i ? flash : null;
          return (
            <motion.button
              key={i}
              whileTap={{ scale: 0.95 }}
              onClick={() => tap(i)}
              disabled={done}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold text-white ring-1 transition ${
                done ? "bg-emerald-500/25 ring-emerald-300/50" :
                f && f.ok ? "bg-emerald-500/30 ring-emerald-300" :
                f && !f.ok ? "bg-rose-500/30 ring-rose-300 animate-[wiggle_.3s]" :
                "bg-white/8 ring-white/20 hover:bg-white/14"
              }`}
            >
              {t.emoji && <span className="text-2xl">{t.emoji}</span>}
              <span>{t.label}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
