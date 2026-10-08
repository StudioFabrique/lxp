import {
  Award,
  Clock,
  GraduationCap,
  Shield,
  Tag,
  Target,
  UserRound,
  Users,
  Video,
  type LucideIcon,
} from "lucide-react";

import type { IntroLevelId } from "./intro-levels";

/**
 * Composant d'un niveau qui n'est pas un élément enfant : groupes, tags,
 * objectifs, etc. Le chatbot les explique un à un.
 */
export type IntroDetailDefinition = {
  /** Clé de la donnée réelle dans `IntroSource.details`, sous la forme `niveau.détail`. */
  id: string;
  label: string;
  icon: LucideIcon;
  /** Exemples affichés quand l'utilisateur n'a rien de réel à montrer. */
  placeholders: readonly string[];
  /** Dit par le chatbot quand il se place à côté de ce composant. */
  explanation: string;
};

export const INTRO_DETAILS: Record<IntroLevelId, readonly IntroDetailDefinition[]> = {
  organisation: [
    {
      id: "organisation.groupes",
      label: "Groupes",
      icon: Users,
      placeholders: ["Promotion 2026", "Promotion 2027"],
      explanation:
        "Les groupes rassemblent vos apprenants, par exemple par promotion. On leur associe ensuite des parcours.",
    },
    {
      id: "organisation.tags",
      label: "Tags",
      icon: Tag,
      placeholders: ["Débutant", "Numérique", "Certifiant"],
      explanation:
        "Les tags étiquettent vos contenus pour les retrouver et les relier entre eux.",
    },
    {
      id: "organisation.roles",
      label: "Rôles",
      icon: Shield,
      placeholders: ["Administrateur", "Équipe pédagogique", "Apprenant"],
      explanation:
        "Chaque personne a un rôle qui définit ce qu'elle voit et ce qu'elle peut faire.",
    },
  ],
  formation: [
    {
      id: "formation.niveau",
      label: "Niveau",
      icon: GraduationCap,
      placeholders: ["Niveau 5"],
      explanation:
        "Une formation précise son niveau de qualification : c'est ce qui la distingue des autres.",
    },
  ],
  parcours: [
    {
      id: "parcours.groupes",
      label: "Groupes",
      icon: Users,
      placeholders: ["Promotion 2026"],
      explanation:
        "Un parcours est ouvert à des groupes : seuls leurs apprenants le voient dans leur espace.",
    },
    {
      id: "parcours.tags",
      label: "Tags",
      icon: Tag,
      placeholders: ["Web", "Débutant"],
      explanation: "Les tags du parcours aident à le classer et à le retrouver.",
    },
    {
      id: "parcours.objectifs",
      label: "Objectifs",
      icon: Target,
      placeholders: ["Construire un site web"],
      explanation:
        "Les objectifs disent ce que l'apprenant saura faire à la fin du parcours.",
    },
    {
      id: "parcours.competences",
      label: "Compétences",
      icon: Award,
      placeholders: ["HTML", "CSS"],
      explanation:
        "Les compétences sont validées au fil des modules et alimentent le profil de l'apprenant.",
    },
    {
      id: "parcours.contacts",
      label: "Contacts",
      icon: UserRound,
      placeholders: ["Référent pédagogique"],
      explanation:
        "Les contacts sont les personnes à solliciter pour ce parcours.",
    },
  ],
  module: [
    {
      id: "module.duree",
      label: "Durée",
      icon: Clock,
      placeholders: ["14 heures"],
      explanation:
        "Chaque module a une durée, qui sert à planifier la progression.",
    },
    {
      id: "module.tags",
      label: "Tags",
      icon: Tag,
      placeholders: ["HTML", "Structure"],
      explanation: "Les tags du module le relient aux autres contenus du même sujet.",
    },
    {
      id: "module.competences",
      label: "Compétences bonus",
      icon: Award,
      placeholders: ["Accessibilité"],
      explanation:
        "Les compétences bonus récompensent un apprentissage au-delà du programme.",
    },
    {
      id: "module.contacts",
      label: "Contacts",
      icon: UserRound,
      placeholders: ["Formateur du module"],
      explanation: "Les contacts du module sont les formateurs à qui poser ses questions.",
    },
  ],
  cours: [
    {
      id: "cours.tags",
      label: "Tags",
      icon: Tag,
      placeholders: ["Balises", "Sémantique"],
      explanation: "Les tags du cours précisent les notions abordées.",
    },
    {
      id: "cours.objectifs",
      label: "Objectifs",
      icon: Target,
      placeholders: ["Structurer une page"],
      explanation: "Les objectifs du cours annoncent ce qui sera acquis à la fin.",
    },
  ],
  lecon: [
    {
      id: "lecon.tag",
      label: "Tag",
      icon: Tag,
      placeholders: ["HTML"],
      explanation: "Chaque leçon porte un tag qui indique son sujet.",
    },
    {
      id: "lecon.modalite",
      label: "Modalité",
      icon: Video,
      placeholders: ["À distance"],
      explanation:
        "La modalité dit comment la leçon est suivie : sur place, à distance ou en autonomie.",
    },
  ],
  activites: [],
};
