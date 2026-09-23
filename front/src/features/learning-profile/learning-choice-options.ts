import type { FormationLevel, LearningPace, LearningPreference } from "./types";

export const paceOptions: Array<{ value: LearningPace; label: string; description: string }> = [
  { value: "progressive", label: "Progressif", description: "Avancer tranquillement, avec davantage d'explications." },
  { value: "standard", label: "Standard", description: "Un équilibre entre explications et mise en pratique." },
  { value: "intensive", label: "Soutenu", description: "Aller plus vite et droit à l'essentiel." },
  { value: "no_preference", label: "Sans préférence", description: "Adapter le rythme selon le contexte." },
];

export const preferenceOptions: Array<{ value: LearningPreference; label: string }> = [
  { value: "concrete_examples", label: "Exemples concrets" },
  { value: "step_by_step", label: "Pas-à-pas" },
  { value: "summary", label: "Synthèse" },
  { value: "practical_exercises", label: "Questions d’entraînement" },
];

export const levelOptions: Array<{ value: FormationLevel; label: string; description: string }> = [
  { value: "beginner", label: "Débutant", description: "Je découvre encore l'essentiel du sujet." },
  { value: "intermediate", label: "Intermédiaire", description: "Je possède déjà quelques bases." },
  { value: "advanced", label: "Avancé", description: "Je suis déjà à l'aise avec le sujet." },
  { value: "unsure", label: "Je ne sais pas encore", description: "Je préfère le déterminer en avançant." },
];
