export const scienceLabMissionIds = ["star-colors", "distance-brightness", "the-sun"] as const;
export const usesScienceLab = (missionId: string) =>
  scienceLabMissionIds.some((id) => id === missionId);
