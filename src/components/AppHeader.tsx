import { Link } from "@tanstack/react-router";
import { useGame } from "@/lib/game-store";
import { Sparkles, Coins, Gem } from "lucide-react";

export function AppHeader() {
  const { state } = useGame();
  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/40 border-b border-border/40">
      <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-3 sm:gap-4">
        <Link to="/" className="flex shrink-0 items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-accent to-primary glow-primary">
            <span className="text-lg">💎</span>
          </div>
          <span className="hidden font-display text-sm font-bold tracking-tight sm:inline">Diamond In The Sky</span>
        </Link>
        <nav className="ml-auto flex items-center gap-1 text-sm">
          <NavLink to="/story">Story</NavLink>
          <NavLink to="/learn">Learn</NavLink>
          <NavLink to="/play">Play</NavLink>
          <NavLink to="/dashboard">Me</NavLink>
          <NavLink to="/educators" className="hidden md:inline-flex">Educators</NavLink>
        </nav>
        <div className="flex shrink-0 items-center gap-1.5">
          <span className="inline-flex items-center gap-1 rounded-full bg-gold/15 px-2.5 py-1 ring-1 ring-gold/30">
            <Sparkles className="h-3 w-3 text-gold" /><span className="text-[11px] font-bold text-gold">{state.stars}</span>
          </span>
          <span className="hidden items-center gap-1 rounded-full bg-amber-400/10 px-2.5 py-1 ring-1 ring-amber-400/30 sm:inline-flex">
            <Coins className="h-3 w-3 text-amber-300" /><span className="text-[11px] font-bold text-amber-300">{state.coins}</span>
          </span>
          <span className="hidden items-center gap-1 rounded-full bg-cyan-400/10 px-2.5 py-1 ring-1 ring-cyan-400/30 sm:inline-flex">
            <Gem className="h-3 w-3 text-cyan-300" /><span className="text-[11px] font-bold text-cyan-300">{state.diamonds}</span>
          </span>
        </div>
      </div>
    </header>
  );
}

function NavLink({ to, children, className = "" }: { to: string; children: React.ReactNode; className?: string }) {
  return (
    <Link
      to={to}
      className={`rounded-lg px-2.5 py-1.5 text-muted-foreground transition hover:bg-white/5 hover:text-foreground sm:px-3 ${className}`}
      activeProps={{ className: "text-foreground bg-white/10" }}
    >
      {children}
    </Link>
  );
}
