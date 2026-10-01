import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { SourceChip } from "@/components/SourceChip";
import { useGame } from "@/lib/game-store";
import { allBadges } from "@/data/badges";
import { chapters } from "@/data/storyScripts";
import { nasaSources } from "@/data/nasaSources";
import { lessons } from "@/lib/game-data";
import { GraduationCap, Target, Users, FileText, Rocket, Award, BookOpen } from "lucide-react";

export const Route = createFileRoute("/educators")({
  head: () => ({ meta: [
    { title: "For Educators — Diamond In The Sky" },
    { name: "description", content: "Learning objectives, classroom suggestions, NASA source list, and per-student progress for teachers and parents." },
  ]}),
  component: Educators,
});

function Educators() {
  const { state, level } = useGame();
  const totalChapters = chapters.length;
  const completed = state.completedChapters.length;
  const lessonsDone = state.completedLessons.length;
  return (
    <PageShell>
      <header className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent">For Teachers & Parents</p>
        <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">Educator Mode</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Diamond In The Sky is designed for curious learners ages 8–14, with classroom-friendly pacing, captioned narration, NASA source citations, and short interactive missions.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card icon={<Target className="h-5 w-5" />} title="Learning objectives">
          <ul className="list-disc space-y-1 pl-5 text-sm">
            <li>Identify stars as luminous bodies powered by nuclear fusion</li>
            <li>Explain why stars appear to twinkle from Earth</li>
            <li>Recognize that constellations are cultural patterns of stars</li>
            <li>Relate star color to surface temperature (O B A F G K M)</li>
            <li>Distinguish apparent vs. intrinsic brightness</li>
            <li>Understand variable stars and proper motion</li>
            <li>Build intuition for deep timescales of cosmic motion</li>
          </ul>
        </Card>

        <Card icon={<FileText className="h-5 w-5" />} title="Topics covered">
          <p className="text-sm text-muted-foreground">
            Stars · Twinkle · Constellations · Spectral classes · Distance & brightness · Variable stars · Proper motion · The Sun · Star creation · Time travel
          </p>
        </Card>

        <Card icon={<GraduationCap className="h-5 w-5" />} title="Classroom suggestions">
          <ul className="list-disc space-y-1 pl-5 text-sm">
            <li>15-min warm-up: one Learn card + quick check quiz</li>
            <li>Group activity: Chapter 1 (Lost Constellation) on a shared screen</li>
            <li>Pair work: Chapter 2 — predict brightness changes before sliding</li>
            <li>Creative project: Chapter 6 — students name and present a constellation</li>
            <li>Reflection: discuss why brightness ≠ closeness</li>
          </ul>
        </Card>

        <Card icon={<Users className="h-5 w-5" />} title="Recommended age & accessibility">
          <p className="text-sm">Ages 8–14. Reading-light, narration-first design. Captions, voice mute, and SFX/music toggles in Settings.</p>
        </Card>
      </div>

      <section className="mt-8 glass rounded-3xl p-6 sm:p-8">
        <h2 className="flex items-center gap-2 font-display text-2xl font-semibold"><Award className="h-5 w-5 text-gold" /> Progress report</h2>
        <p className="mt-1 text-xs text-muted-foreground">Live snapshot from this device. A class roster with shared reporting is planned.</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-4">
          <Mini label="Explorer level" value={level} />
          <Mini label="Stars" value={state.stars} />
          <Mini label="Chapters" value={`${completed} / ${totalChapters}`} />
          <Mini label="Lessons" value={`${lessonsDone} / ${lessons.length}`} />
        </div>
        <div className="mt-6">
          <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Earned badges</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {allBadges.filter((b) => state.earnedBadges.includes(b.id)).map((b) => (
              <span key={b.id} className="inline-flex items-center gap-1 rounded-full bg-gold/15 px-3 py-1 text-xs font-semibold text-gold ring-1 ring-gold/30">
                <span>{b.emoji}</span>{b.name}
              </span>
            ))}
            {state.earnedBadges.length === 0 && <span className="text-xs text-muted-foreground">No badges yet.</span>}
          </div>
        </div>
      </section>

      <section className="mt-8 glass rounded-3xl p-6 sm:p-8">
        <h2 className="flex items-center gap-2 font-display text-2xl font-semibold"><BookOpen className="h-5 w-5 text-accent" /> NASA sources used</h2>
        <p className="mt-1 text-xs text-muted-foreground">Every fact, light curve, and dataset in this game cites one of these open NASA / mission-archive resources.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {Object.values(nasaSources).map((s) => <SourceChip key={s.id} sourceId={s.id} />)}
        </div>
      </section>

      <section className="mt-8 glass rounded-3xl p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-accent to-primary"><Rocket className="h-5 w-5" /></div>
          <div>
            <h2 className="font-display text-2xl font-semibold">Future collaboration</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Designed with the vision of supporting space-science education and potential learning collaborations with NASA-aligned platforms. This is an independent educational project and is not an official NASA product.
            </p>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

function Card({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="glass rounded-3xl p-6">
      <div className="flex items-center gap-2 text-accent">{icon}<h3 className="font-display text-lg font-semibold text-foreground">{title}</h3></div>
      <div className="mt-3 text-foreground/90">{children}</div>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-border">
      <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="mt-1 font-display text-2xl font-bold">{value}</div>
    </div>
  );
}
