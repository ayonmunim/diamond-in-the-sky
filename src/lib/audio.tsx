/**
 * Lightweight Web Audio API system — no audio files needed.
 *
 * - Music channel: original looping space-piano melody
 * - SFX channel: short synthesized blips (sparkle, success, click)
 * - Narration: handled by SpeechSynthesis in NarrationBar
 *
 * Reading volume/on state directly from the game store keeps Settings live.
 */
import { useEffect, useRef } from "react";
import { useGame } from "./game-store";
import { createSpacePiano } from "./space-piano";

let _ctx: AudioContext | null = null;
function ctx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!_ctx) {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    _ctx = new AC();
  }
  return _ctx;
}

let musicNodes: ReturnType<typeof createSpacePiano> | null = null;

function startMusic(volume: number) {
  const ac = ctx();
  if (!ac || ac.state !== "running") return;
  if (musicNodes) musicNodes.setVolume(volume);
  else musicNodes = createSpacePiano(ac, volume);
}

function stopMusic() {
  if (musicNodes) {
    musicNodes.stop();
    musicNodes = null;
  }
}

export function playSfx(kind: "click" | "success" | "sparkle" | "win" | "wrong", volume = 0.6) {
  const ac = ctx();
  if (!ac) return;
  const now = ac.currentTime;
  const g = ac.createGain();
  g.connect(ac.destination);
  g.gain.value = volume * 0.4;

  if (kind === "click") {
    const o = ac.createOscillator();
    o.type = "triangle";
    o.frequency.value = 660;
    o.connect(g);
    o.start(now);
    o.frequency.exponentialRampToValueAtTime(440, now + 0.08);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
    o.stop(now + 0.13);
  } else if (kind === "success") {
    [523.25, 659.25, 783.99].forEach((f, i) => {
      const o = ac.createOscillator();
      o.type = "sine";
      o.frequency.value = f;
      const og = ac.createGain();
      og.gain.value = 0;
      o.connect(og).connect(g);
      og.gain.linearRampToValueAtTime(0.25, now + 0.02 + i * 0.08);
      og.gain.exponentialRampToValueAtTime(0.001, now + 0.5 + i * 0.08);
      o.start(now + i * 0.08);
      o.stop(now + 0.55 + i * 0.08);
    });
  } else if (kind === "sparkle") {
    for (let i = 0; i < 6; i++) {
      const o = ac.createOscillator();
      o.type = "sine";
      const f = 900 + Math.random() * 1500;
      o.frequency.value = f;
      const og = ac.createGain();
      og.gain.value = 0;
      o.connect(og).connect(g);
      const t = now + i * 0.03;
      og.gain.linearRampToValueAtTime(0.12, t + 0.01);
      og.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
      o.start(t);
      o.stop(t + 0.2);
    }
  } else if (kind === "win") {
    [392, 523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
      const o = ac.createOscillator();
      o.type = "triangle";
      o.frequency.value = f;
      const og = ac.createGain();
      og.gain.value = 0;
      o.connect(og).connect(g);
      og.gain.linearRampToValueAtTime(0.3, now + 0.02 + i * 0.1);
      og.gain.exponentialRampToValueAtTime(0.0001, now + 0.7 + i * 0.1);
      o.start(now + i * 0.1);
      o.stop(now + 0.75 + i * 0.1);
    });
  } else if (kind === "wrong") {
    const o = ac.createOscillator();
    o.type = "square";
    o.frequency.value = 200;
    o.connect(g);
    o.start(now);
    o.frequency.exponentialRampToValueAtTime(110, now + 0.25);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    o.stop(now + 0.32);
  }
}

/** Mount once high in the tree to manage the looping music channel. */
export function AudioBoot() {
  const { state } = useGame();
  const settings = useRef(state.settings);
  settings.current = state.settings;

  useEffect(() => {
    let mounted = true;
    const sync = () => {
      if (!mounted) return;
      if (!settings.current.musicOn || document.hidden) stopMusic();
      else startMusic(settings.current.musicVolume);
    };
    const unlock = () => {
      const ac = ctx();
      if (ac)
        void ac
          .resume()
          .then(sync)
          .catch(() => {});
    };
    // The first gesture unlocks audio; subsequent changes reuse one score.
    window.addEventListener("pointerdown", unlock);
    window.addEventListener("keydown", unlock);
    document.addEventListener("visibilitychange", sync);
    return () => {
      mounted = false;
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
      document.removeEventListener("visibilitychange", sync);
      stopMusic();
    };
  }, []);

  useEffect(() => {
    if (!state.settings.musicOn || document.hidden) stopMusic();
    else if (_ctx?.state === "running") startMusic(state.settings.musicVolume);
  }, [state.settings.musicOn, state.settings.musicVolume]);

  return null;
}

export function useSfx() {
  const { state } = useGame();
  return (kind: Parameters<typeof playSfx>[0]) => {
    if (!state.settings.sfxOn) return;
    playSfx(kind, state.settings.sfxVolume);
  };
}
