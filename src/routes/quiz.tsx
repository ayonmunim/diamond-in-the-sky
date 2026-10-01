import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageShell } from "@/components/PageShell";
import { RewardBurst } from "@/components/RewardBurst";
import { SourceChip } from "@/components/SourceChip";
import { quizPool } from "@/data/quizzes";
import { useGame } from "@/lib/game-store";
import { useSfx } from "@/lib/audio";
import { ChevronRight, RefreshCw, Check, X } from "lucide-react";

export const Route = createFileRoute("/quiz")({
  head: () => ({ meta: [{ title: "Star Quiz — Diamond In The Sky" }] }),
  component: QuizPage,
});

function pick<T>(arr: T[], n: number): T[] {
  const a = [...arr]; const out: T[] = [];
  while (a.length && out.length < n) out.push(a.splice(Math.floor(Math.random() * a.length), 1)[0]);
  return out;
}

function QuizPage() {
  const [seed, setSeed] = useState(0);
  const questions = useMemo(() => pick(quizPool, 5), [seed]);
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const { addStars, addCoins, addXp, earnBadge } = useGame();
  const sfx = useSfx();

  const q = questions[i];

  const submit = () => {
    if (picked === null) return;
    const correct = picked === q.answer;
    if (correct) { setScore((s) => s + 1); sfx("success"); } else { sfx("wrong"); }
    setTimeout(() => {
      if (i + 1 >= questions.length) {
        setDone(true);
        const total = score + (correct ? 1 : 0);
        addStars(total); addCoins(total * 2); addXp(total * 5);
        if (total >= 4) earnBadge("scholar");
      } else {
        setI(i + 1); setPicked(null);
      }
    }, 700);
  };

  if (done) {
    const total = score;
    return (
      <PageShell>
        <Link to="/play" className="text-xs text-muted-foreground hover:text-foreground">← Mini-games</Link>
        <motion.section initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mt-4 glass rounded-3xl p-8 sm:p-10">
          <RewardBurst emoji="🧠" title={`You scored ${total} / ${questions.length}`} stars={total} coins={total * 2} xp={total * 5} />
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button onClick={() => { setSeed(seed + 1); setI(0); setPicked(null); setScore(0); setDone(false); }}
              className="inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2.5 font-semibold">
              <RefreshCw className="h-4 w-4" /> New questions
            </button>
            <Link to="/dashboard" className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 font-semibold text-primary-foreground glow-primary">
              View dashboard <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.section>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <Link to="/play" className="text-xs text-muted-foreground hover:text-foreground">← Mini-games</Link>

      <header className="mt-4 flex items-end justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">Star Quiz</p>
          <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl">Question {i + 1} of {questions.length}</h1>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Score</div>
          <div className="font-display text-2xl font-bold text-gold">{score}</div>
        </div>
      </header>

      <AnimatePresence mode="wait">
        <motion.section
          key={q.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          className="mt-6 glass rounded-3xl p-6 sm:p-10"
        >
          <p className="font-display text-2xl font-semibold">{q.question}</p>
          <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
            {q.options.map((opt, idx) => {
              const isPicked = picked === idx;
              const showRight = picked !== null && idx === q.answer;
              const showWrong = picked !== null && isPicked && idx !== q.answer;
              return (
                <button
                  key={idx}
                  disabled={picked !== null}
                  onClick={() => setPicked(idx)}
                  className={`flex items-center justify-between rounded-2xl border px-4 py-3.5 text-left transition ${
                    showRight ? "border-green-400/60 bg-green-400/10" :
                    showWrong ? "border-destructive/60 bg-destructive/10" :
                    isPicked  ? "border-primary bg-primary/15" :
                    "border-border bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <span className="text-sm font-medium">{opt}</span>
                  {showRight && <Check className="h-4 w-4 text-green-400" />}
                  {showWrong && <X className="h-4 w-4 text-destructive" />}
                </button>
              );
            })}
          </div>
          {picked !== null && (
            <p className="mt-4 text-sm text-muted-foreground">{q.explain}</p>
          )}
          <div className="mt-5 flex items-center gap-3">
            <button onClick={submit} disabled={picked === null}
              className="rounded-full bg-primary px-5 py-2.5 font-semibold text-primary-foreground glow-primary disabled:opacity-40">
              {i + 1 === questions.length ? "Finish" : "Next"}
            </button>
            <div className="ml-auto"><SourceChip sourceId={q.sourceId} /></div>
          </div>
        </motion.section>
      </AnimatePresence>
    </PageShell>
  );
}
