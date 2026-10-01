import { createFileRoute } from "@tanstack/react-router";
import { SpaceScene } from "@/components/SpaceScene";
import { SceneTransition } from "@/components/SceneTransition";
import { Hud } from "@/components/HudBubble";
import { StarForge } from "@/components/StarForge";
import { Nova } from "@/components/Nova";

export const Route = createFileRoute("/create-star")({
  head: () => ({
    meta: [
      { title: "Create Your Star — Diamond In The Sky" },
      { name: "description", content: "Forge your very own star — choose temperature, mass, color, brightness, rotation, and a name." },
    ],
  }),
  component: CreateStarScene,
});

function CreateStarScene() {
  return (
    <SceneTransition>
      <SpaceScene density={120} variant="nebula" />
      <Hud />
      <main className="relative mx-auto max-w-5xl px-4 pb-16 pt-24 sm:pt-28">
        <div className="text-center">
          <div className="mb-2 inline-block">
            <Nova size="md" mood="excited" interactive={false} />
          </div>
          <h1 className="font-display text-4xl font-bold text-white sm:text-5xl">Forge Your Star</h1>
          <p className="mt-2 text-sm text-white/70">Tune the dials of creation. Your star joins your nursery and can be paired with friends!</p>
        </div>
        <div className="mt-8">
          <StarForge />
        </div>
      </main>
    </SceneTransition>
  );
}
