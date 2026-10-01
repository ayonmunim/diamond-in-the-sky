import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { UniverseExplorer } from "@/components/UniverseExplorer";

export const Route = createFileRoute("/explore")({
  head: () => ({
    meta: [
      { title: "Explore the Universe — Diamond In The Sky" },
      {
        name: "description",
        content:
          "Zoom from Earth to the observable universe. Travel through 17 astronomical scales with real NASA distances, sizes and facts for every object you find.",
      },
      { property: "og:title", content: "Explore the Universe — Diamond In The Sky" },
      {
        property: "og:description",
        content:
          "A scroll-driven journey from Earth to the cosmic web, with scientifically sourced information cards for every celestial object.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ExplorePage,
});

function ExplorePage() {
  return (
    <>
      <h1 className="sr-only">Explore the Universe</h1>
      <UniverseExplorer />
      <Link
        to="/"
        className="fixed bottom-5 left-3 z-30 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-2 text-xs font-bold text-white ring-1 ring-white/20 backdrop-blur-sm transition hover:bg-white/20 sm:left-6"
      >
        <ArrowLeft className="h-4 w-4" /> Home
      </Link>
    </>
  );
}
