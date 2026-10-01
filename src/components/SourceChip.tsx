import { ExternalLink } from "lucide-react";
import { nasaSources } from "@/data/nasaSources";

export function SourceChip({ sourceId }: { sourceId: string }) {
  const s = nasaSources[sourceId];
  if (!s) return null;
  return (
    <a
      href={s.url}
      target="_blank"
      rel="noreferrer noopener"
      className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-2.5 py-1 text-[10px] font-medium text-muted-foreground ring-1 ring-border transition hover:bg-white/10 hover:text-foreground"
      title={`Source: ${s.label}`}
    >
      <span className="rounded-sm bg-accent/30 px-1 py-px text-[9px] font-bold text-accent-foreground">{s.agency}</span>
      <span className="max-w-[180px] truncate">{s.label}</span>
      <ExternalLink className="h-2.5 w-2.5 shrink-0" />
    </a>
  );
}
