import {
  BookOpen,
  Building2,
  FileText,
  GraduationCap,
  Layers,
  ListChecks,
  Rocket,
  type LucideIcon,
} from "lucide-react";

export type IntroLevelId =
  | "organisation"
  | "formation"
  | "parcours"
  | "module"
  | "cours"
  | "lecon"
  | "activites";

export type IntroLevel = {
  id: IntroLevelId;
  label: string;
  icon: LucideIcon;
  /** Explication affichée lors de la découverte par le scroll. */
  explanation: string;
  /** Nom, au singulier puis au pluriel, de ce que le niveau contient. */
  childrenLabel: string;
  childrenPlural: string;
};

/** Du plus englobant au plus fin : chaque niveau contient le suivant. */
export const INTRO_LEVELS: readonly IntroLevel[] = [
  {
    id: "organisation",
    label: "Organisme de formation",
    icon: Building2,
    explanation:
      "L'organisme est votre espace ANDRIA. Il réunit toutes les formations, les équipes et les apprenants.",
    childrenLabel: "Formation",
    childrenPlural: "formations",
  },
  {
    id: "formation",
    label: "Formation",
    icon: GraduationCap,
    explanation:
      "Une formation regroupe plusieurs parcours autour d'un même métier ou d'une même certification.",
    childrenLabel: "Parcours",
    childrenPlural: "parcours",
  },
  {
    id: "parcours",
    label: "Parcours",
    icon: Rocket,
    explanation:
      "Un parcours organise la progression des apprenants, module après module.",
    childrenLabel: "Module",
    childrenPlural: "modules",
  },
  {
    id: "module",
    label: "Module",
    icon: Layers,
    explanation:
      "Un module est une grande étape du parcours, avec ses objectifs, sa durée et ses compétences.",
    childrenLabel: "Cours",
    childrenPlural: "cours",
  },
  {
    id: "cours",
    label: "Cours",
    icon: BookOpen,
    explanation:
      "Un cours rassemble des leçons autour d'un même thème, à l'intérieur d'un module.",
    childrenLabel: "Leçon",
    childrenPlural: "leçons",
  },
  {
    id: "lecon",
    label: "Leçon",
    icon: FileText,
    explanation:
      "Une leçon est une séquence de contenu que l'on suit en une fois. Elle est composée d'activités.",
    childrenLabel: "Activité",
    childrenPlural: "activités",
  },
  {
    id: "activites",
    label: "Activités",
    icon: ListChecks,
    explanation:
      "Les activités sont le contenu lui-même : texte, vidéo, image, fichier ou ressource à consulter.",
    childrenLabel: "Activité",
    childrenPlural: "activités",
  },
];

export const INTRO_LEVEL_COUNT = INTRO_LEVELS.length;
