import { createFileRoute, useNavigate, notFound } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SpaceScene } from "@/components/SpaceScene";
import { SceneTransition } from "@/components/SceneTransition";
import { Hud } from "@/components/HudBubble";
import { CinematicStoryScene } from "@/components/CinematicStoryScene";
import { MiniGame } from "@/components/MiniGame";
import { StarLearningLab } from "@/components/StarLearningLab";
import { ColorMissionStory, ColorMissionGame, ColorMissionAward } from "@/components/ColorMission";
import { DistanceMissionStory, DistanceMissionGame } from "@/components/DistanceMission";
import { MissionScienceLab } from "@/components/MissionScienceLab";
import { usesScienceLab } from "@/data/specialMissions";
import { RewardScreen } from "@/components/RewardScreen";
import { levelInMission, type Mission, type StarLevel } from "@/data/universe";
import { getCinematic } from "@/data/cinematicStories";
import { useGame } from "@/lib/game-store";

export const Route = createFileRoute("/missions/$missionId/$levelId")({
  loader: ({ params }) => {
    const found = levelInMission(params.missionId, params.levelId);
    if (!found) throw notFound();
    return { mission: found.mission, level: found.level, levelIndex: found.index };
  },
  notFoundComponent: () => (
    <div className="flex min-h-dvh items-center justify-center text-white">Level not found.</div>
  ),
  errorComponent: ({ error }) => (
    <div className="flex min-h-dvh items-center justify-center text-white">{error.message}</div>
  ),
  component: LevelPlayer,
});

type Phase = "story" | "play" | "reward";

function LevelPlayer() {
  const { mission, level } = Route.useLoaderData();
  return <LevelSession key={`${mission.id}:${level.id}`} />;
}

function LevelSession() {
  const { mission, level, levelIndex } = Route.useLoaderData() as {
    mission: Mission;
    level: StarLevel;
    levelIndex: number;
  };
  const navigate = useNavigate();
  const { state, completeMissionLevel } = useGame();
  const [phase, setPhase] = useState<Phase>(
    mission.id === "what-is-a-star" && level.index === 1 ? "play" : "story",
  );
  const [mistakes, setMistakes] = useState(0);

  const isMissionFinale = levelIndex === mission.levels.length - 1;
  const nextLevel = mission.levels[levelIndex + 1];
  const learningLevel = mission.id === "what-is-a-star" ? (level.index as 1 | 2 | 3 | 4 | 5) : null;

  return (
    <SceneTransition>
      <SpaceScene density={120} variant="nebula" />
      <Hud backTo="/missions" />

      <main className="level-viewport" style={{ zIndex: phase === "story" ? 60 : 1 }}>
        <AnimatePresence mode="wait">
          {phase === "story" && mission.id === "star-colors" ? (
            <ColorMissionStory
              key="color-story"
              level={level.index}
              onStart={() => setPhase("play")}
              onExit={() =>
                navigate({ to: "/missions/$missionId", params: { missionId: mission.id } })
              }
            />
          ) : phase === "story" && mission.id === "distance-brightness" ? (
            <DistanceMissionStory
              key="distance-story"
              level={level.index}
              onStart={() => setPhase("play")}
              onExit={() =>
                navigate({ to: "/missions/$missionId", params: { missionId: mission.id } })
              }
            />
          ) : (
            phase === "story" && (
              <CinematicStoryScene
                key="story"
                cinematic={getCinematic(mission.id, level)}
                onStart={() => setPhase("play")}
                onExit={() =>
                  navigate({ to: "/missions/$missionId", params: { missionId: mission.id } })
                }
              />
            )
          )}

          {phase === "play" && (
            <motion.div
              key="play"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="level-play"
            >
              {mission.id === "star-colors" ? (
                <ColorMissionGame
                  level={level.index}
                  onComplete={() => {
                    setMistakes(0);
                    setPhase("reward");
                  }}
                />
              ) : mission.id === "distance-brightness" ? (
                <DistanceMissionGame
                  level={level.index}
                  onComplete={() => {
                    setMistakes(0);
                    setPhase("reward");
                  }}
                />
              ) : learningLevel ? (
                <StarLearningLab
                  level={learningLevel}
                  onComplete={() => {
                    setMistakes(0);
                    setPhase("reward");
                  }}
                />
              ) : usesScienceLab(mission.id) ? (
                <MissionScienceLab mission={mission} level={level}>
                  <MiniGame
                    config={level.game}
                    onComplete={(m) => {
                      setMistakes(m);
                      setPhase("reward");
                    }}
                  />
                </MissionScienceLab>
              ) : (
                <MiniGame
                  config={level.game}
                  onComplete={(m) => {
                    setMistakes(m);
                    setPhase("reward");
                  }}
                />
              )}
            </motion.div>
          )}

          {phase === "reward" && (
            <RewardPhase
              key="reward"
              mission={mission}
              level={level}
              isMissionFinale={isMissionFinale}
              mistakes={mistakes}
              alreadyDone={state.completedMissionLevels.includes(`${mission.id}:${level.id}`)}
              onCommit={(starsEarned, reward) =>
                completeMissionLevel(mission.id, level.id, starsEarned, reward)
              }
              onNext={() => {
                if (nextLevel) {
                  navigate({
                    to: "/missions/$missionId/$levelId",
                    params: { missionId: mission.id, levelId: nextLevel.id },
                    replace: true,
                  });
                } else {
                  navigate({ to: "/missions/$missionId", params: { missionId: mission.id } });
                }
              }}
              onReplay={() => {
                setPhase("story");
                setMistakes(0);
              }}
              hasNext={!!nextLevel}
            />
          )}
        </AnimatePresence>
      </main>
    </SceneTransition>
  );
}

import { useEffect } from "react";

function RewardPhase({
  mission,
  level,
  isMissionFinale,
  mistakes,
  alreadyDone,
  onCommit,
  onNext,
  onReplay,
  hasNext,
}: {
  mission: Mission;
  level: StarLevel;
  isMissionFinale: boolean;
  mistakes: number;
  alreadyDone: boolean;
  onCommit: (
    stars: number,
    reward: { stars?: number; gems?: number; xp?: number; coins?: number; badgeId?: string },
  ) => void;
  onNext: () => void;
  onReplay: () => void;
  hasNext: boolean;
}) {
  // Stars earned: 3 perfect, 2 if <=1 mistake, 1 otherwise
  const initialDone = useRef(alreadyDone);
  const committed = useRef(false);
  const customAward = mission.id === "star-colors" || mission.id === "distance-brightness";
  const rewardPreviouslyDone = customAward ? initialDone.current : alreadyDone;
  const starsEarned = mistakes === 0 ? 3 : mistakes <= 1 ? 2 : 1;
  const gemsEarned =
    (rewardPreviouslyDone ? 5 : 20) + (mistakes === 0 ? 10 : 0) + (isMissionFinale ? 30 : 0);
  const xpEarned = rewardPreviouslyDone ? 10 : isMissionFinale ? 75 : 40;

  // Mission badge only on finale, first-time completion
  const badgeId = isMissionFinale && !rewardPreviouslyDone ? mission.badgeId : undefined;

  useEffect(() => {
    if (customAward && committed.current) return;
    committed.current = true;
    onCommit(starsEarned, {
      stars: starsEarned,
      gems: gemsEarned,
      xp: xpEarned,
      coins: 5,
      badgeId,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="level-reward"
    >
      {customAward ? (
        <ColorMissionAward
          missionNumber={mission.index}
          level={level.index}
          stars={starsEarned}
          gems={gemsEarned}
          xp={xpEarned}
          badgeName={badgeId ? mission.badgeName : undefined}
          onNext={onNext}
          onReplay={onReplay}
        />
      ) : (
        <RewardScreen
          title={isMissionFinale ? `${mission.name} — Complete!` : `${level.name} Complete!`}
          emoji={isMissionFinale ? mission.badgeEmoji : level.emoji}
          stars={starsEarned}
          gems={gemsEarned}
          xp={xpEarned}
          badgeId={badgeId}
          badgeName={badgeId ? mission.badgeName : undefined}
          badgeEmoji={badgeId ? mission.badgeEmoji : undefined}
          onContinue={onNext}
          continueLabel={
            hasNext ? "Next Level →" : isMissionFinale ? "Back to Mission Hub" : "Continue"
          }
          secondaryLabel="Replay"
          onSecondary={onReplay}
        />
      )}
    </motion.div>
  );
}
