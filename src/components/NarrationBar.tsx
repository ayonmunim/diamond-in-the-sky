import { useEffect, useState } from "react";
import { Play, Pause, RotateCcw, Volume2, VolumeX, Captions } from "lucide-react";
import { useGame } from "@/lib/game-store";

/**
 * Voice narration with captions. Uses browser SpeechSynthesis when available
 * (so it works without uploaded audio), and is structured to swap in real
 * audio files later — drop them under /public/audio/ and replace `speak()`.
 */
export function NarrationBar({ text, autoplay = false }: { text: string; autoplay?: boolean }) {
  const { state, updateSettings } = useGame();
  const { voiceOn, captionsOn, voiceVolume } = state.settings;
  const [playing, setPlaying] = useState(false);

  const speak = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.95;
    u.pitch = 1.0;
    u.volume = voiceVolume;
    u.onend = () => setPlaying(false);
    window.speechSynthesis.speak(u);
    setPlaying(true);
  };

  const stop = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
    setPlaying(false);
  };

  useEffect(() => {
    if (autoplay && voiceOn) speak();
    return stop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-center gap-2">
        <button
          aria-label={playing ? "Pause narration" : "Play narration"}
          onClick={() => (playing ? stop() : speak())}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground transition hover:scale-105 glow-primary"
        >
          {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 translate-x-0.5" />}
        </button>
        <button
          aria-label="Replay"
          onClick={() => { stop(); setTimeout(speak, 80); }}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/10 transition hover:bg-white/20"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
        <button
          aria-label={voiceOn ? "Mute voice" : "Unmute voice"}
          onClick={() => { updateSettings({ voiceOn: !voiceOn }); stop(); }}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/10 transition hover:bg-white/20"
        >
          {voiceOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
        </button>
        <button
          aria-label="Toggle captions"
          onClick={() => updateSettings({ captionsOn: !captionsOn })}
          className={`grid h-10 w-10 shrink-0 place-items-center rounded-full transition ${captionsOn ? "bg-accent/30 text-accent-foreground" : "bg-white/10 hover:bg-white/20"}`}
        >
          <Captions className="h-4 w-4" />
        </button>
        <div className="ml-auto text-xs text-muted-foreground hidden sm:block">Narrator</div>
      </div>
      {captionsOn && (
        <p className="mt-3 text-sm leading-relaxed text-foreground/90">{text}</p>
      )}
    </div>
  );
}
