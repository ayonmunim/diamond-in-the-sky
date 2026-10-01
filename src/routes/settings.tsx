import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { useGame } from "@/lib/game-store";
import {
  Volume2,
  Music,
  Captions,
  Trash2,
  Sparkles,
  GraduationCap,
  BookOpen,
  Gamepad2,
  User,
} from "lucide-react";

function Quick({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      to={to as "/"}
      className="inline-flex items-center gap-2 rounded-full bg-white/8 px-4 py-2 text-sm font-semibold text-white/85 ring-1 ring-white/15 transition hover:bg-white/15 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/70"
    >
      {icon} {label}
    </Link>
  );
}

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — Diamond In The Sky" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const { state, updateSettings, reset } = useGame();
  const s = state.settings;
  return (
    <PageShell>
      <header className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent">Settings</p>
        <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">Adjust your experience</h1>
      </header>

      <nav aria-label="Quick links" className="mb-8 flex flex-wrap gap-2">
        <Quick to="/educators" icon={<GraduationCap className="h-4 w-4" />} label="Educators" />
        <Quick to="/learn" icon={<BookOpen className="h-4 w-4" />} label="Learn" />
        <Quick to="/missions" icon={<Gamepad2 className="h-4 w-4" />} label="Play" />
        <Quick to="/profile" icon={<User className="h-4 w-4" />} label="Profile" />
      </nav>

      <div className="glass space-y-6 rounded-3xl p-6 sm:p-8">
        <Toggle
          icon={<Volume2 className="h-4 w-4" />}
          label="Narration voice"
          desc="Spoken story and lesson narration."
          value={s.voiceOn}
          onChange={(v) => updateSettings({ voiceOn: v })}
        />
        <Range
          label="Voice volume"
          value={s.voiceVolume}
          onChange={(v) => updateSettings({ voiceVolume: v })}
        />

        <Toggle
          icon={<Music className="h-4 w-4" />}
          label="Background music"
          desc="Little Star Voyage — playful space-piano melody with soft, sparkling echoes. Starts after your first tap."
          value={s.musicOn}
          onChange={(v) => updateSettings({ musicOn: v })}
        />
        <Range
          label="Music volume"
          value={s.musicVolume}
          onChange={(v) => updateSettings({ musicVolume: v })}
        />

        <Toggle
          icon={<Sparkles className="h-4 w-4" />}
          label="Sound effects"
          desc="Sparkles, clicks, and reward chimes."
          value={s.sfxOn}
          onChange={(v) => updateSettings({ sfxOn: v })}
        />
        <Range
          label="SFX volume"
          value={s.sfxVolume}
          onChange={(v) => updateSettings({ sfxVolume: v })}
        />

        <Toggle
          icon={<Captions className="h-4 w-4" />}
          label="On-screen captions"
          desc="Show captions for every narration."
          value={s.captionsOn}
          onChange={(v) => updateSettings({ captionsOn: v })}
        />
      </div>

      <div className="glass mt-6 rounded-3xl p-6 sm:p-8">
        <h2 className="font-display text-lg font-semibold">Reset progress</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Clear all stars, coins, missions, lessons, chapters, badges, and saved constellations.
        </p>
        <button
          onClick={() => {
            if (confirm("Reset all progress?")) reset();
          }}
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-destructive/20 px-5 py-2.5 text-sm font-semibold text-destructive ring-1 ring-destructive/40"
        >
          <Trash2 className="h-4 w-4" /> Reset progress
        </button>
      </div>
    </PageShell>
  );
}

function Toggle({
  icon,
  label,
  desc,
  value,
  onChange,
}: {
  icon: React.ReactNode;
  label: string;
  desc: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-4">
      <div className="flex gap-3">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/10">
          {icon}
        </div>
        <div>
          <div className="font-medium">{label}</div>
          <div className="text-xs text-muted-foreground">{desc}</div>
        </div>
      </div>
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={`relative h-7 w-12 shrink-0 rounded-full transition ${value ? "bg-primary" : "bg-white/15"}`}
        aria-label={label}
        aria-pressed={value}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${value ? "left-6" : "left-1"}`}
        />
      </button>
    </label>
  );
}

function Range({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <label className="block">
      <div className="mb-1.5 flex justify-between text-sm">
        <span>{label}</span>
        <span className="text-xs text-muted-foreground">{Math.round(value * 100)}%</span>
      </div>
      <input
        type="range"
        min={0}
        max={1}
        step={0.05}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-[oklch(0.72_0.18_265)]"
      />
    </label>
  );
}
