/**
 * Star forge — sliders that craft a Created Star.
 */
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useGame, type CreatedStar } from "@/lib/game-store";
import { useSfx } from "@/lib/audio";

function tempToColor(t: number): string {
  // 2500K → red, 6000K → yellow, 10000K → white, 25000K → blue
  if (t < 3700) return "oklch(0.70 0.22 25)";   // red
  if (t < 5200) return "oklch(0.80 0.20 50)";   // orange
  if (t < 6000) return "oklch(0.88 0.18 80)";   // yellow
  if (t < 7500) return "oklch(0.95 0.05 95)";   // white-yellow
  if (t < 10000) return "oklch(0.97 0.04 240)"; // white
  return "oklch(0.80 0.18 240)";                // blue
}

function spectralClass(t: number): string {
  if (t < 3700) return "M";
  if (t < 5200) return "K";
  if (t < 6000) return "G (like our Sun)";
  if (t < 7500) return "F";
  if (t < 10000) return "A";
  if (t < 30000) return "B";
  return "O";
}

export function StarForge({ onSaved }: { onSaved?: (star: CreatedStar) => void }) {
  const { saveStar } = useGame();
  const sfx = useSfx();
  const [name, setName] = useState("Stella");
  const [temperature, setTemperature] = useState(5800);
  const [mass, setMass] = useState(1.0);
  const [size, setSize] = useState(1.0);
  const [spin, setSpin] = useState(1.0);
  const [brightness, setBrightness] = useState(1.0);
  const [story, setStory] = useState("");
  const [saved, setSaved] = useState(false);

  const color = useMemo(() => tempToColor(temperature), [temperature]);
  const klass = useMemo(() => spectralClass(temperature), [temperature]);

  const handleSave = () => {
    const star: CreatedStar = {
      id: `${Date.now()}`,
      name: name.trim() || "Stella",
      mass, temperature, size, color, spin, brightness, story,
      createdAt: Date.now(),
    };
    saveStar(star);
    sfx("success");
    setSaved(true);
    onSaved?.(star);
  };

  const radius = 60 + size * 50;
  const spinDur = Math.max(2, 8 / Math.max(0.1, spin));

  return (
    <div className="grid w-full gap-6 lg:grid-cols-[1fr_1fr]">
      {/* Preview */}
      <div className="relative flex flex-col items-center justify-center rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: spinDur, repeat: Infinity, ease: "linear" }}
          style={{ width: radius * 2, height: radius * 2, filter: `drop-shadow(0 0 ${20 * brightness}px ${color})` }}
        >
          <svg viewBox="0 0 100 100" width="100%" height="100%">
            <defs>
              <radialGradient id="forge-star" cx="35%" cy="30%" r="80%">
                <stop offset="0%" stopColor="white" />
                <stop offset="55%" stopColor={color} />
                <stop offset="100%" stopColor="oklch(0.45 0.22 35)" />
              </radialGradient>
            </defs>
            <circle cx="50" cy="50" r="44" fill="url(#forge-star)" />
            {/* surface granules */}
            {Array.from({ length: 6 }).map((_, i) => (
              <circle key={i} cx={28 + (i * 8) % 50} cy={30 + (i * 11) % 40} r={2.5} fill="white" opacity={0.18} />
            ))}
          </svg>
        </motion.div>
        <div className="mt-4 text-center">
          <div className="font-display text-2xl font-bold text-white">{name || "Stella"}</div>
          <div className="text-xs text-white/65">Class {klass} · {temperature.toLocaleString()} K</div>
        </div>
      </div>

      {/* Controls */}
      <div className="space-y-4 rounded-3xl bg-white/5 p-5 ring-1 ring-white/10">
        <Field label="Name">
          <input
            value={name} onChange={(e) => setName(e.target.value.slice(0, 24))}
            className="w-full rounded-xl bg-white/10 px-3 py-2 text-white outline-none ring-1 ring-white/15 focus:ring-accent"
            placeholder="Name your star"
          />
        </Field>

        <Slider label={`Temperature: ${temperature.toLocaleString()} K`} min={2500} max={30000} step={100} value={temperature} onChange={setTemperature} />
        <Slider label={`Mass: ${mass.toFixed(2)} ☉`} min={0.1} max={10} step={0.1} value={mass} onChange={setMass} />
        <Slider label={`Size: ${size.toFixed(2)}×`} min={0.3} max={3} step={0.05} value={size} onChange={setSize} />
        <Slider label={`Brightness: ${brightness.toFixed(2)}×`} min={0.3} max={3} step={0.05} value={brightness} onChange={setBrightness} />
        <Slider label={`Rotation: ${spin.toFixed(2)}×`} min={0.1} max={4} step={0.05} value={spin} onChange={setSpin} />

        <Field label="Story (optional)">
          <textarea
            value={story} onChange={(e) => setStory(e.target.value.slice(0, 200))}
            rows={2}
            className="w-full resize-none rounded-xl bg-white/10 px-3 py-2 text-sm text-white outline-none ring-1 ring-white/15 focus:ring-accent"
            placeholder="Tell the legend of your star…"
          />
        </Field>

        <button
          onClick={handleSave}
          className="w-full rounded-full bg-accent px-5 py-3 font-semibold text-accent-foreground glow-pink active:scale-95"
        >
          {saved ? "★ Star added to your nursery" : "✨ Save my star"}
        </button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-white/70">{label}</span>
      {children}
    </label>
  );
}

function Slider({ label, min, max, step, value, onChange }: { label: string; min: number; max: number; step: number; value: number; onChange: (v: number) => void }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-white/80">{label}</span>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-[oklch(0.85_0.18_350)]"
      />
    </label>
  );
}
