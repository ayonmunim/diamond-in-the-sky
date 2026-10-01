import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { GameProvider } from "@/lib/game-store";
import { AudioBoot } from "@/lib/audio";
import { LandscapeGuide } from "@/components/LandscapeGuide";
import { JourneyNova } from "@/components/JourneyNova";
import "../nova-phase.css";
import "../mercury-phase.css";

function NotFoundComponent() {
  return (
    <div className="flex min-h-dvh items-center justify-center px-4">
      <div className="glass max-w-md rounded-3xl p-8 text-center">
        <div className="text-6xl">🌑</div>
        <h1 className="mt-4 font-display text-3xl font-bold">Lost in space</h1>
        <p className="mt-2 text-sm text-muted-foreground">This page drifted beyond our star map.</p>
        <Link
          to="/"
          className="mt-6 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground glow-primary"
        >
          Return to base
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: unknown; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-dvh items-center justify-center px-4">
      <div className="glass max-w-md rounded-3xl p-8 text-center">
        <h1 className="font-display text-xl font-semibold">A meteor knocked something loose</h1>
        <p className="mt-2 text-sm text-muted-foreground">Try again, or head back to base.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground glow-primary"
          >
            Try again
          </button>
          <a
            href="/"
            className="rounded-full border border-border bg-white/5 px-5 py-2.5 text-sm font-semibold"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Diamond In The Sky — Interactive Space Learning Adventure" },
      {
        name: "description",
        content:
          "A storytelling space-learning game for ages 10–14. Explore stars, constellations, and missions with narrated lessons and interactive gameplay.",
      },
      { name: "theme-color", content: "#0b0a1f" },
      {
        property: "og:title",
        content: "Diamond In The Sky — Interactive Space Learning Adventure",
      },
      {
        property: "og:description",
        content:
          "A storytelling space-learning game for ages 10–14. Explore stars, constellations, and missions with narrated lessons and interactive gameplay.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:title",
        content: "Diamond In The Sky — Interactive Space Learning Adventure",
      },
      {
        name: "twitter:description",
        content:
          "A storytelling space-learning game for ages 10–14. Explore stars, constellations, and missions with narrated lessons and interactive gameplay.",
      },
      {
        property: "og:image",
        content:
          "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/a55c188f-cacd-4302-be3d-ccf780dad1e6/id-preview-1dc36e78--655b0a4a-f364-48bc-9bdd-152cff853202.lovable.app-1782770110965.png",
      },
      {
        name: "twitter:image",
        content:
          "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/a55c188f-cacd-4302-be3d-ccf780dad1e6/id-preview-1dc36e78--655b0a4a-f364-48bc-9bdd-152cff853202.lovable.app-1782770110965.png",
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;700;800&family=Fredoka:wght@400;500;600;700&family=Nunito:wght@400;600;700;800&family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <GameProvider>
        <AudioBoot />
        <LandscapeGuide />
        <JourneyNova />
        <Outlet />
      </GameProvider>
    </QueryClientProvider>
  );
}
