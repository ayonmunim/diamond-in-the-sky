import { NASA_ATTRIBUTION } from "@/data/nasaSources";

export function AppFooter() {
  return (
    <footer className="mt-16 border-t border-border/40 bg-background/30 backdrop-blur-xl">
      <div className="mx-auto max-w-6xl px-4 py-6 text-center text-xs text-muted-foreground">
        {NASA_ATTRIBUTION}
      </div>
    </footer>
  );
}
