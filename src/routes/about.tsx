import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { Rocket, Heart, Telescope } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [
    { title: "About — Diamond In The Sky" },
    { name: "description", content: "Diamond In The Sky is an interactive space learning adventure inspired by the NASA Space Apps Challenge." },
  ]}),
  component: About,
});

function About() {
  return (
    <PageShell>
      <header className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent">About the Mission</p>
        <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">Why Diamond In The Sky?</h1>
      </header>

      <section className="glass rounded-3xl p-6 sm:p-10">
        <p className="text-lg leading-relaxed text-foreground/95">
          Diamond In The Sky is an interactive space learning adventure built for curious young explorers ages 10–14. Through storytelling, narration, and hands-on missions, learners discover why stars shine, why they twinkle, and how constellations have guided humanity for thousands of years.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <Pill icon={<Telescope className="h-5 w-5" />} title="Inspired by NASA Space Apps">
            Built in the spirit of the NASA Space Apps Challenge — making space science approachable and joyful.
          </Pill>
          <Pill icon={<Heart className="h-5 w-5" />} title="Our mission">
            Make space science fun, interactive, and accessible — at school, at home, or wherever curiosity sparks.
          </Pill>
          <Pill icon={<Rocket className="h-5 w-5" />} title="Looking ahead">
            Designed with the future vision of supporting space science education and potential learning collaborations.
          </Pill>
        </div>

        <p className="mt-6 text-sm text-muted-foreground">
          Diamond In The Sky is an independent educational project. It is not an official NASA product and does not claim NASA partnership.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/story" className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 font-semibold text-primary-foreground glow-primary">
            Start the journey
          </Link>
          <Link to="/educators" className="inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2.5 font-semibold">
            For educators
          </Link>
        </div>
      </section>
    </PageShell>
  );
}

function Pill({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-border">
      <div className="flex items-center gap-2 text-accent">{icon}<span className="font-display font-semibold text-foreground">{title}</span></div>
      <p className="mt-2 text-sm text-muted-foreground">{children}</p>
    </div>
  );
}
