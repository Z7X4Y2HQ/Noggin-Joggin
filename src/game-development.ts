export type GameDimension = "unspecified" | "2d" | "3d" | "hybrid";
export type DevelopmentProfile = { gameDimension: GameDimension; gameplayFeatures: string[] };
export type TaskIdea = {
  id: string; label: string; topic: string; recommended: boolean;
  dimensions?: ("2d" | "3d")[]; feature?: string | null; outcome?: string;
};
export const dimensionOptions: { id: GameDimension; label: string }[] = [
  { id: "unspecified", label: "Not decided" }, { id: "2d", label: "2D" },
  { id: "3d", label: "3D" }, { id: "hybrid", label: "2D + 3D" },
];
export const featureOptions = [
  { id: "movement", label: "Movement" }, { id: "platforming", label: "Platforming" },
  { id: "combat", label: "Combat" }, { id: "ai", label: "NPC behavior / AI" },
  { id: "stealth", label: "Stealth" }, { id: "puzzles", label: "Puzzles" },
  { id: "dialogue", label: "Dialogue & choices" }, { id: "inventory", label: "Inventory" },
  { id: "quests", label: "Objectives & quests" }, { id: "crafting", label: "Crafting" },
  { id: "building", label: "Building" }, { id: "vehicles", label: "Vehicles" },
  { id: "strategy", label: "Strategy / cards / turns" }, { id: "multiplayer", label: "Multiplayer" },
];

export function tailorTaskIdeas(tasks: TaskIdea[], profile?: Partial<DevelopmentProfile>, exploreOtherSystems = false) {
  const dimension = profile?.gameDimension ?? "unspecified";
  const features = profile?.gameplayFeatures ?? [];
  return tasks.filter(task => {
    const dimensions = task.dimensions ?? ["2d", "3d"];
    const dimensionMatches = dimension === "unspecified" || dimension === "hybrid" || dimensions.includes(dimension);
    const featureMatches = !task.feature || exploreOtherSystems || features.length === 0 || features.includes(task.feature);
    return dimensionMatches && featureMatches;
  }).map(task => ({ ...task, recommended: task.recommended
    && (!task.feature || features.includes(task.feature))
    && (dimension !== "unspecified" || (task.dimensions ?? ["2d", "3d"]).length === 2) }));
}
