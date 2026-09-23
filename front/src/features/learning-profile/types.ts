export type LearningPace =
  | "progressive"
  | "standard"
  | "intensive"
  | "no_preference";

export type LearningPreference =
  | "concrete_examples"
  | "step_by_step"
  | "summary"
  | "practical_exercises"
  | "visual_aids";

export type FormationLevel =
  | "beginner"
  | "intermediate"
  | "advanced"
  | "unsure";

export type LearningFormation = {
  id: number;
  title: string;
  parcours: Array<{
    id: number;
    title: string;
    tags: Array<{ id: number; name: string; color: string }>;
    modules: Array<{
      id: number;
      title: string;
      courses: Array<{ title: string; tags: Array<{ id: number; name: string; color: string }> }>;
      assessment: { level: FormationLevel; updatedAt: string } | null;
    }>;
  }>;
};

export type LearningContext = {
  hasAvailableContent: boolean;
  onboardingRequired: boolean;
  onboardingMode: "initial" | "additional" | null;
  shouldAutoRedirect: boolean;
  availableFormations: LearningFormation[];
  modulesToAssess: Array<LearningFormation["parcours"][number]["modules"][number]>;
  profile: {
    pace: LearningPace | null;
    preferences: LearningPreference[];
    status: "not_started" | "in_progress" | "completed";
    currentStep: string;
    version: number;
    initialCompletedAt: string | null;
    updatedAt: string | null;
  };
};
