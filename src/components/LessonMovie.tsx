/**
 * Cinematic full-screen lesson movie player.
 *
 * - Renders sequential animated scenes (SVG + Framer Motion)
 * - Camera FX wrapper around each scene
 * - Narration via SpeechSynthesis + caption strip
 * - Pause / Replay / Skip / Next
 * - End card with Fun Fact, badge reward, "Continue Adventure"
 */
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "@tanstack/react-router";
import { Pause, Play, SkipForward, RotateCcw, X, ChevronRight, Sparkles } from "lucide-react";
import { useGame } from "@/lib/game-store";
import { useSfx } from "@/lib/audio";
import { SourceChip } from "@/components/SourceChip";
import { RewardBurst } from "@/components/RewardBurst";
import { allBadges } from "@/data/badges";
import { lessonMovies, type LessonMovie, type CameraFx } from "@/data/lessonMovies";

import type { TargetAndTransition } from "framer-motion";

const cameraVariants: Record<CameraFx, TargetAndTransition> = {
  "still":     { scale: 1, x: 0, y: 0, rotate: 0 },
  "zoom-in":   { scale: [1, 1.18], x: 0, y: 0 },
  "zoom-out":  { scale: [1.18, 1], x: 0, y: 0 },
  "pan-left":  { x: [40, -40], scale: 1.05 },
  "pan-right": { x: [-40, 40], scale: 1.05 },
  "shake":     { x: [0, -4, 4, -3, 3, 0], y: [0, 2, -2, 2, 0] },
  "swirl":     { rotate: [-2, 2, -1, 1, 0], scale: [1.02, 1.05, 1.02] },
};

export function LessonMovie({
  movie,
  onExit,
}: {
  movie: LessonMovie;
  onExit?: () => void;
}) {
  const navigate = useNavigate();
  const { state, completeLesson, addStars, addCoins, earnBadge } = useGame();
  const sfx = useSfx();

  const [sceneIndex, setSceneIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0); // 0..1 within current scene
  const [ended, setEnded] = useState(false);
  const elapsedRef = useRef(0); // ms within current scene
  const lastTickRef = useRef<number>(performance.now());
  const rafRef = useRef<number | null>(null);

  const scene = movie.scenes[sceneIndex];
  const sceneDuration = scene?.durationMs ?? 7000;

  // ----- speech -----
  const speak = (text: string) => {
    if (!state.settings.voiceOn) return;
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.pitch = 1.55;
      u.rate = 1.0;
      u.volume = state.settings.voiceVolume;
      window.speechSynthesis.speak(u);
    } catch {/* ignore */}
  };
  const stopSpeak = () => {
    try { window.speechSynthesis?.cancel(); } catch {/* ignore */}
  };

  // Whenever scene changes, speak its narration & reset elapsed
  useEffect(() => {
    if (ended || !scene) return;
    elapsedRef.current = 0;
    setProgress(0);
    speak(scene.narration);
    return stopSpeak;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sceneIndex, ended]);

  // Pause/resume speech
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    if (paused) {
      try { window.speechSynthesis.pause(); } catch {/* */}
    } else {
      try { window.speechSynthesis.resume(); } catch {/* */}
    }
  }, [paused]);

  // Progress ticker
  useEffect(() => {
    if (ended) return;
    lastTickRef.current = performance.now();
    const tick = (now: number) => {
      const dt = now - lastTickRef.current;
      lastTickRef.current = now;
      if (!paused) {
        elapsedRef.current += dt;
        const p = Math.min(1, elapsedRef.current / sceneDuration);
        setProgress(p);
        if (p >= 1) {
          advance();
          return;
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sceneIndex, paused, sceneDuration, ended]);

  // Cleanup speech on unmount
  useEffect(() => () => stopSpeak(), []);

  const advance = () => {
    stopSpeak();
    if (sceneIndex < movie.scenes.length - 1) {
      setSceneIndex((i) => i + 1);
    } else {
      finishMovie();
    }
  };

  const finishMovie = () => {
    setEnded(true);
    sfx("win");
    if (!state.completedLessons.includes(movie.id)) {
      completeLesson(movie.id);
      addStars(5);
      addCoins(3);
      earnBadge(movie.badgeId);
    }
  };

  const replayScene = () => {
    elapsedRef.current = 0;
    setProgress(0);
    stopSpeak();
    speak(scene.narration);
  };

  const skip = () => {
    sfx("click");
    advance();
  };

  const togglePause = () => {
    sfx("click");
    setPaused((v) => !v);
  };

  const close = () => {
    stopSpeak();
    if (onExit) onExit();
    else navigate({ to: "/learn" });
  };

  const goNext = () => {
    const idx = lessonMovies.findIndex((m) => m.id === movie.id);
    const next = lessonMovies[idx + 1];
    if (next) navigate({ to: "/learn/$lesson", params: { lesson: next.id }, replace: true });
    else navigate({ to: "/learn" });
  };

  const replayMovie = () => {
    setEnded(false);
    setSceneIndex(0);
    elapsedRef.current = 0;
    setProgress(0);
  };

  const badge = allBadges.find((b) => b.id === movie.badgeId);
  const totalDur = movie.scenes.reduce((acc, s) => acc + (s.durationMs ?? 7000), 0);
  const before = movie.scenes.slice(0, sceneIndex).reduce((acc, s) => acc + (s.durationMs ?? 7000), 0);
  const overallProgress = ended ? 1 : Math.min(1, (before + progress * sceneDuration) / totalDur);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[oklch(0.06_0.03_270)]">
      {/* Stage */}
      <div className="relative flex-1 overflow-hidden">
        {/* cosmic backdrop gradient */}
        <div className="absolute inset-0" style={{ background: "var(--gradient-cosmos)" }} />
        {/* nebula veil */}
        <div className="pointer-events-none absolute -top-32 left-[10%] h-[600px] w-[600px] rounded-full opacity-50 blur-3xl"
          style={{ background: "radial-gradient(circle, oklch(0.65 0.26 320 / 0.55), transparent 70%)" }} />
        <div className="pointer-events-none absolute bottom-[-12%] right-[10%] h-[500px] w-[500px] rounded-full opacity-50 blur-3xl"
          style={{ background: "radial-gradient(circle, oklch(0.60 0.22 280 / 0.55), transparent 70%)" }} />

        <AnimatePresence mode="wait">
          {!ended && (
            <motion.div
              key={sceneIndex}
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.95, filter: "blur(8px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 1.04, filter: "blur(6px)" }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="h-full w-full max-w-5xl"
                animate={paused ? { x: 0, y: 0, scale: 1, rotate: 0 } : cameraVariants[scene.cameraFx ?? "still"]}
                transition={{ duration: Math.max(2, sceneDuration / 1000), ease: "easeInOut", repeat: scene.cameraFx === "shake" ? 0 : 0 }}
              >
                {scene.render(progress)}
              </motion.div>
            </motion.div>
          )}

          {ended && (
            <motion.div
              key="end"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative z-10 mx-auto flex h-full max-w-2xl flex-col items-center justify-center px-6 text-center"
            >
              <RewardBurst title={`${movie.title} — Complete!`} stars={5} coins={3} xp={15} emoji={movie.emoji} />
              <div className="mt-6 glass-strong rounded-3xl p-5">
                <div className="flex items-center justify-center gap-2 text-gold">
                  <Sparkles className="h-4 w-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Did you know?</span>
                </div>
                <p className="mt-2 text-base text-white">{movie.funFact}</p>
              </div>
              {badge && (
                <div className="mt-5 flex items-center gap-3 rounded-full bg-gold/15 px-4 py-2 ring-1 ring-gold/50">
                  <span className="text-2xl">{badge.emoji}</span>
                  <div className="text-left">
                    <div className="text-xs uppercase tracking-wider text-gold">Badge earned</div>
                    <div className="text-sm font-bold text-white">{badge.name}</div>
                  </div>
                </div>
              )}
              <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
                {movie.sourceIds.map((id) => <SourceChip key={id} sourceId={id} />)}
              </div>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <button onClick={replayMovie}
                  className="rounded-full bg-white/10 px-5 py-3 text-sm font-semibold text-white ring-1 ring-white/20 hover:bg-white/15">
                  ↻ Watch again
                </button>
                <button onClick={goNext}
                  className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-semibold text-accent-foreground glow-pink">
                  Continue Adventure <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Top bar: close + scene counter */}
        {!ended && (
          <div className="absolute left-0 right-0 top-0 z-20 flex items-center justify-between px-3 pt-3 sm:px-5 sm:pt-5">
            <button onClick={close} aria-label="Close"
              className="bubble flex h-11 w-11 items-center justify-center text-white active:scale-90">
              <X className="h-5 w-5" />
            </button>
            <div className="bubble flex h-11 items-center gap-2 px-4 text-xs font-bold uppercase tracking-wider text-white">
              <span className="text-base">{movie.emoji}</span>
              <span>Scene {sceneIndex + 1} / {movie.scenes.length}</span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom — captions + controls + progress */}
      {!ended && (
        <div className="relative z-20 px-3 pb-4 pt-2 sm:px-6 sm:pb-6">
          {/* caption */}
          {state.settings.captionsOn && (
            <AnimatePresence mode="wait">
              <motion.div
                key={sceneIndex + ":" + scene.narration}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35 }}
                className="mx-auto mb-3 max-w-3xl rounded-3xl bg-black/55 px-5 py-3 text-center text-base font-medium leading-snug text-white ring-1 ring-white/15 sm:text-lg"
              >
                {scene.narration}
              </motion.div>
            </AnimatePresence>
          )}

          {/* progress bar */}
          <div className="mx-auto mb-3 h-1.5 max-w-3xl overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full bg-gradient-to-r from-gold via-accent to-primary"
              animate={{ width: `${overallProgress * 100}%` }}
              transition={{ duration: 0.2, ease: "linear" }}
            />
          </div>

          {/* controls */}
          <div className="mx-auto flex max-w-3xl items-center justify-center gap-3">
            <button onClick={replayScene} aria-label="Replay scene"
              className="bubble flex h-12 w-12 items-center justify-center text-white active:scale-90">
              <RotateCcw className="h-5 w-5" />
            </button>
            <button onClick={togglePause} aria-label={paused ? "Play" : "Pause"}
              className="bubble flex h-16 w-16 items-center justify-center text-white glow-primary active:scale-90">
              {paused ? <Play className="h-7 w-7" /> : <Pause className="h-7 w-7" />}
            </button>
            <button onClick={skip} aria-label={sceneIndex === movie.scenes.length - 1 ? "Finish" : "Skip"}
              className="bubble flex h-12 w-12 items-center justify-center text-white active:scale-90">
              <SkipForward className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
