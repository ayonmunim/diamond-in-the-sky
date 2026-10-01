/**
 * CinematicStoryScene — full-screen animated cutscene that plays before
 * each mission level's gameplay. Combines synchronized narration,
 * captions, camera FX, particle/SVG visuals, and player controls
 * (Pause, Replay scene, Skip, Continue / Start Mission).
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, type TargetAndTransition } from "framer-motion";
import { Pause, Play, SkipForward, RotateCcw, X, Sparkles } from "lucide-react";
import { useGame } from "@/lib/game-store";
import { useSfx } from "@/lib/audio";
import type { CameraFx, Cinematic } from "@/data/cinematicStories";

const cameraVariants: Record<CameraFx, TargetAndTransition> = {
  still: { scale: 1, x: 0, y: 0, rotate: 0 },
  "zoom-in": { scale: [1, 1.18], x: 0, y: 0 },
  "zoom-out": { scale: [1.18, 1], x: 0, y: 0 },
  "pan-left": { x: [40, -40], scale: 1.05 },
  "pan-right": { x: [-40, 40], scale: 1.05 },
  shake: { x: [0, -5, 5, -3, 3, 0], y: [0, 2, -2, 2, 0] },
  swirl: { rotate: [-2, 2, -1, 1, 0], scale: [1.02, 1.05, 1.02] },
};

export function CinematicStoryScene({
  cinematic,
  onStart,
  onExit,
}: {
  cinematic: Cinematic;
  onStart: () => void;
  onExit?: () => void;
}) {
  // If the cinematic has a pre-rendered MP4, play that instead of SVG scenes.
  if (cinematic.videoUrl) {
    return <VideoCinematic cinematic={cinematic} onStart={onStart} onExit={onExit} />;
  }
  return <SceneCinematic cinematic={cinematic} onStart={onStart} onExit={onExit} />;
}

function SceneCinematic({
  cinematic,
  onStart,
  onExit,
}: {
  cinematic: Cinematic;
  onStart: () => void;
  onExit?: () => void;
}) {
  const { state } = useGame();
  const sfx = useSfx();
  const [sceneIndex, setSceneIndex] = useState(0);

  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [ended, setEnded] = useState(false);
  const elapsedRef = useRef(0);
  const lastTickRef = useRef<number>(performance.now());
  const rafRef = useRef<number | null>(null);

  const scene = cinematic.scenes[sceneIndex];
  const sceneDuration = scene?.durationMs ?? 7000;

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
    } catch {
      /* */
    }
  };
  const stopSpeak = () => {
    try {
      window.speechSynthesis?.cancel();
    } catch {
      /* Speech may be unavailable in a browser. */
    }
  };

  // Narrate each scene
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
      try {
        window.speechSynthesis.pause();
      } catch {
        /* Speech may be unavailable in a browser. */
      }
    } else {
      try {
        window.speechSynthesis.resume();
      } catch {
        /* Speech may be unavailable in a browser. */
      }
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
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sceneIndex, paused, sceneDuration, ended]);

  useEffect(() => () => stopSpeak(), []);

  const advance = () => {
    stopSpeak();
    if (sceneIndex < cinematic.scenes.length - 1) setSceneIndex((i) => i + 1);
    else {
      sfx("win");
      setEnded(true);
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
  const replayAll = () => {
    setEnded(false);
    setSceneIndex(0);
    elapsedRef.current = 0;
    setProgress(0);
  };
  const close = () => {
    stopSpeak();
    onExit?.();
  };
  const startGame = () => {
    stopSpeak();
    sfx("click");
    onStart();
  };

  const totalDur = cinematic.scenes.reduce((a, s) => a + (s.durationMs ?? 7000), 0);
  const before = cinematic.scenes
    .slice(0, sceneIndex)
    .reduce((a, s) => a + (s.durationMs ?? 7000), 0);
  const overall = ended ? 1 : Math.min(1, (before + progress * sceneDuration) / totalDur);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[oklch(0.06_0.03_270)]">
      {/* Stage */}
      <div className="relative flex-1 overflow-hidden">
        <div className="absolute inset-0" style={{ background: "var(--gradient-cosmos)" }} />

        <AnimatePresence mode="wait">
          {!ended && scene && (
            <motion.div
              key={sceneIndex}
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.96, filter: "blur(8px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 1.04, filter: "blur(6px)" }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="relative h-full w-full max-w-5xl"
                animate={
                  paused
                    ? { x: 0, y: 0, scale: 1, rotate: 0 }
                    : cameraVariants[scene.cameraFx ?? "still"]
                }
                transition={{ duration: Math.max(2, sceneDuration / 1000), ease: "easeInOut" }}
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
              <div className="text-6xl">{cinematic.emoji}</div>
              <h2 className="mt-3 font-display text-3xl font-bold text-white">{cinematic.title}</h2>
              <p className="mt-2 text-white/70">Ready to play?</p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={replayAll}
                  className="inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-3 text-sm font-semibold text-white ring-1 ring-white/20 hover:bg-white/15"
                >
                  <RotateCcw className="h-4 w-4" /> Watch again
                </button>
                <button
                  onClick={startGame}
                  className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-bold text-accent-foreground glow-pink"
                >
                  <Sparkles className="h-4 w-4" /> Start Mission
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Top bar */}
        {!ended && (
          <div className="absolute left-0 right-0 top-0 z-20 flex items-center justify-between px-3 pt-3 sm:px-5 sm:pt-5">
            {onExit ? (
              <button
                onClick={close}
                aria-label="Close"
                className="bubble flex h-11 w-11 items-center justify-center text-white active:scale-90"
              >
                <X className="h-5 w-5" />
              </button>
            ) : (
              <span />
            )}
            <div className="bubble flex h-11 items-center gap-2 px-4 text-xs font-bold uppercase tracking-wider text-white">
              <span className="text-base">{cinematic.emoji}</span>
              <span>
                Scene {sceneIndex + 1} / {cinematic.scenes.length}
              </span>
            </div>
            <button
              onClick={startGame}
              className="rounded-full bg-white/10 px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-white/85 ring-1 ring-white/15 hover:bg-white/15"
            >
              Skip Intro
            </button>
          </div>
        )}
      </div>

      {/* Bottom: caption + progress + controls */}
      {!ended && scene && (
        <div className="relative z-20 px-3 pb-4 pt-2 sm:px-6 sm:pb-6">
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

          <div className="mx-auto mb-3 h-1.5 max-w-3xl overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full bg-gradient-to-r from-gold via-accent to-primary"
              animate={{ width: `${overall * 100}%` }}
              transition={{ duration: 0.2, ease: "linear" }}
            />
          </div>

          <div className="mx-auto flex max-w-3xl items-center justify-center gap-3">
            <button
              onClick={replayScene}
              aria-label="Replay scene"
              className="bubble flex h-12 w-12 items-center justify-center text-white active:scale-90"
            >
              <RotateCcw className="h-5 w-5" />
            </button>
            <button
              onClick={togglePause}
              aria-label={paused ? "Play" : "Pause"}
              className="bubble flex h-16 w-16 items-center justify-center text-white glow-primary active:scale-90"
            >
              {paused ? <Play className="h-7 w-7" /> : <Pause className="h-7 w-7" />}
            </button>
            <button
              onClick={skip}
              aria-label="Next scene"
              className="bubble flex h-12 w-12 items-center justify-center text-white active:scale-90"
            >
              <SkipForward className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   VideoCinematic — fullscreen MP4 player for pre-rendered cartoon
   ============================================================ */
function VideoCinematic({
  cinematic,
  onStart,
  onExit,
}: {
  cinematic: Cinematic;
  onStart: () => void;
  onExit?: () => void;
}) {
  const { state } = useGame();
  const sfx = useSfx();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [paused, setPaused] = useState(false);
  const [ended, setEnded] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [caption, setCaption] = useState<string>("");

  const captions = useMemo(() => cinematic.videoCaptions ?? [], [cinematic.videoCaptions]);
  const voiceOn = state.settings.voiceOn;
  const voiceVolume = state.settings.voiceVolume;
  // Sync video volume with settings
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !voiceOn;
    v.volume = voiceVolume;
  }, [voiceOn, voiceVolume]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onTime = () => {
      setCurrent(v.currentTime);
      let active = "";
      for (const c of captions) {
        if (v.currentTime + 0.01 >= c.at) active = c.text;
      }
      setCaption(active);
    };
    const onLoaded = () => setDuration(v.duration || 0);
    const onEnded = () => {
      sfx("win");
      setEnded(true);
    };
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("loadedmetadata", onLoaded);
    v.addEventListener("ended", onEnded);
    return () => {
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("loadedmetadata", onLoaded);
      v.removeEventListener("ended", onEnded);
    };
  }, [captions, sfx]);

  const togglePause = () => {
    const v = videoRef.current;
    if (!v) return;
    sfx("click");
    if (v.paused) {
      v.play().catch(() => {});
      setPaused(false);
    } else {
      v.pause();
      setPaused(true);
    }
  };
  const replay = () => {
    const v = videoRef.current;
    if (!v) return;
    setEnded(false);
    v.currentTime = 0;
    v.play().catch(() => {});
    setPaused(false);
  };
  const skip = () => {
    const v = videoRef.current;
    if (!v) return;
    sfx("click");
    v.currentTime = v.duration || 0;
  };
  const startGame = () => {
    sfx("click");
    onStart();
  };
  const close = () => {
    onExit?.();
  };

  const progress = duration ? Math.min(1, current / duration) : 0;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black">
      <div className="relative flex-1 overflow-hidden">
        <video
          ref={videoRef}
          src={cinematic.videoUrl}
          autoPlay
          playsInline

          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Top bar */}
        <div className="absolute left-0 right-0 top-0 z-20 flex items-center justify-between px-3 pt-3 sm:px-5 sm:pt-5">
          {onExit ? (
            <button
              onClick={close}
              aria-label="Close"
              className="bubble flex h-11 w-11 items-center justify-center text-white active:scale-90"
            >
              <X className="h-5 w-5" />
            </button>
          ) : (
            <span />
          )}
          <div className="bubble flex h-11 items-center gap-2 px-4 text-xs font-bold uppercase tracking-wider text-white">
            <span className="text-base">{cinematic.emoji}</span>
            <span>{cinematic.title}</span>
          </div>
          <button
            onClick={startGame}
            className="rounded-full bg-white/10 px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-white/85 ring-1 ring-white/15 hover:bg-white/15"
          >
            Skip Intro
          </button>
        </div>

        {/* End overlay */}
        <AnimatePresence>
          {ended && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/70 px-6 text-center"
            >
              <div className="text-6xl">{cinematic.emoji}</div>
              <h2 className="mt-3 font-display text-3xl font-bold text-white">{cinematic.title}</h2>
              <p className="mt-2 text-white/70">Ready to play?</p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={replay}
                  className="inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-3 text-sm font-semibold text-white ring-1 ring-white/20 hover:bg-white/15"
                >
                  <RotateCcw className="h-4 w-4" /> Watch again
                </button>
                <button
                  onClick={startGame}
                  className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-bold text-accent-foreground glow-pink"
                >
                  <Sparkles className="h-4 w-4" /> Start Mission
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Captions + controls */}
      {!ended && (
        <div className="relative z-20 px-3 pb-4 pt-2 sm:px-6 sm:pb-6">
          {state.settings.captionsOn && caption && (
            <AnimatePresence mode="wait">
              <motion.div
                key={caption}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="mx-auto mb-3 max-w-3xl rounded-3xl bg-black/65 px-5 py-3 text-center text-base font-medium leading-snug text-white ring-1 ring-white/15 sm:text-lg"
              >
                {caption}
              </motion.div>
            </AnimatePresence>
          )}

          <div className="mx-auto mb-3 h-1.5 max-w-3xl overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full bg-gradient-to-r from-gold via-accent to-primary"
              animate={{ width: `${progress * 100}%` }}
              transition={{ duration: 0.15, ease: "linear" }}
            />
          </div>

          <div className="mx-auto flex max-w-3xl items-center justify-center gap-3">
            <button
              onClick={replay}
              aria-label="Replay"
              className="bubble flex h-12 w-12 items-center justify-center text-white active:scale-90"
            >
              <RotateCcw className="h-5 w-5" />
            </button>
            <button
              onClick={togglePause}
              aria-label={paused ? "Play" : "Pause"}
              className="bubble flex h-16 w-16 items-center justify-center text-white glow-primary active:scale-90"
            >
              {paused ? <Play className="h-7 w-7" /> : <Pause className="h-7 w-7" />}
            </button>
            <button
              onClick={skip}
              aria-label="Skip to end"
              className="bubble flex h-12 w-12 items-center justify-center text-white active:scale-90"
            >
              <SkipForward className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
