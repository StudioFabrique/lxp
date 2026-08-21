import type { Step } from "react-joyride";

/**
 * Étape de la visite guidée de démonstration.
 *
 * `route` désigne la page à ouvrir avant l'affichage. Contrairement au tutoriel
 * d'onboarding, aucune étape n'attend d'action : la démonstration est en
 * consultation seule, la visite se déroule donc de bout en bout sans que le
 * visiteur ait à créer quoi que ce soit.
 */
export type DemoStep = Step & { route?: string };

/** Réutilise les cibles déjà posées pour l'onboarding et les tours par page. */
const SIDEBAR = '[data-onboarding="sidebar-navigation"]';
const PAGE_HEADER = '[data-page-tour="header"]';
const PAGE_TABLE = '[data-page-tour="table"]';
const CENTER = "#main-scroll-container";

export const adminDemoTourSteps: DemoStep[] = [
  {
    id: "demo-admin-navigation",
    route: "/admin/dashboard",
    target: SIDEBAR,
    title: "La navigation",
    content:
      "Le menu donne accès au tableau de bord et aux espaces de gestion : formations, parcours, contenus, utilisateurs et ressources.",
    placement: "right",
  },
  {
    id: "demo-admin-dashboard",
    route: "/admin/dashboard",
    target: '[data-onboarding="admin-dashboard-header"]',
    title: "Le tableau de bord",
    content:
      "Il rassemble les derniers parcours, les indicateurs de suivi et les actions courantes de l'équipe pédagogique.",
    placement: "bottom",
  },
  {
    id: "demo-admin-formations",
    route: "/admin/formation",
    target: PAGE_HEADER,
    title: "Les formations",
    content:
      "La formation est le niveau le plus large : elle regroupe les parcours proposés à une promotion.",
    placement: "bottom",
  },
  {
    id: "demo-admin-formations-table",
    route: "/admin/formation",
    target: PAGE_TABLE,
    title: "Le catalogue",
    content:
      "Voici le catalogue de démonstration. Les actions de création et de modification restent visibles, mais sont sans effet ici.",
    placement: "top",
  },
  {
    id: "demo-admin-parcours",
    route: "/admin/parcours",
    target: PAGE_HEADER,
    title: "Les parcours",
    content:
      "Un parcours porte des dates, des objectifs, des compétences et les groupes d'apprenants qui le suivent.",
    placement: "bottom",
  },
  {
    id: "demo-admin-modules",
    route: "/admin/module",
    target: PAGE_HEADER,
    title: "Les modules",
    content:
      "Chaque parcours se découpe en modules, eux-mêmes composés de cours, de leçons et d'activités.",
    placement: "bottom",
  },
  {
    id: "demo-admin-courses",
    route: "/admin/course",
    target: PAGE_HEADER,
    title: "La bibliothèque de cours",
    content:
      "Les cours et leurs leçons se réutilisent d'un module à l'autre, et peuvent être importés depuis Moodle.",
    placement: "bottom",
  },
  {
    id: "demo-admin-users",
    route: "/admin/user",
    target: PAGE_HEADER,
    title: "Les utilisateurs",
    content:
      "Apprenants, formateurs et administrateurs, avec leurs rôles et les permissions associées.",
    placement: "bottom",
  },
  {
    id: "demo-admin-groups",
    route: "/admin/group",
    target: PAGE_HEADER,
    title: "Les groupes",
    content:
      "Le groupe fait le lien entre une promotion et les parcours auxquels elle est inscrite.",
    placement: "bottom",
  },
  {
    id: "demo-admin-exit",
    route: "/admin/dashboard",
    target: CENTER,
    title: "À vous de jouer",
    content:
      "Naviguez librement : tout est consultable, rien n'est modifiable. Pour quitter la démonstration, utilisez « Sortir de la démo » en bas du menu.",
    placement: "center",
  },
];

export const studentDemoTourSteps: DemoStep[] = [
  {
    id: "demo-student-navigation",
    route: "/student/dashboard",
    target: SIDEBAR,
    title: "Votre menu",
    content:
      "Vous y retrouvez votre accueil, vos parcours, votre calendrier et vos ressources supplémentaires.",
    placement: "right",
  },
  {
    id: "demo-student-dashboard",
    route: "/student/dashboard",
    target: '[data-onboarding="student-dashboard-header"]',
    title: "Votre accueil",
    content:
      "L'accueil résume ce qui compte aujourd'hui et permet de reprendre l'apprentissage là où il s'est arrêté.",
    placement: "bottom",
  },
  {
    id: "demo-student-content",
    route: "/student/dashboard",
    target: '[data-onboarding="student-content"]',
    title: "Reprendre son apprentissage",
    content:
      "Cette zone affiche la prochaine activité et les parcours en cours. La progression se met à jour au fil de la lecture.",
    placement: "right",
  },
  {
    id: "demo-student-parcours",
    route: "/student/parcours",
    target: PAGE_HEADER,
    title: "Vos parcours",
    content:
      "Chaque parcours regroupe des modules, eux-mêmes composés de cours, de leçons et d'activités à parcourir dans l'ordre.",
    placement: "bottom",
  },
  {
    id: "demo-student-resources",
    route: "/student/ressources",
    target: PAGE_HEADER,
    title: "Les ressources supplémentaires",
    content:
      "Une bibliothèque de contenus complémentaires, en accès libre et indépendante des parcours.",
    placement: "bottom",
  },
  {
    id: "demo-student-exit",
    route: "/student/dashboard",
    target: CENTER,
    title: "À vous de jouer",
    content:
      "Ouvrez un parcours et avancez activité par activité. Pour quitter la démonstration, utilisez « Sortir de la démo » en bas du menu.",
    placement: "center",
  },
];

export const demoTourSteps = {
  admin: adminDemoTourSteps,
  student: studentDemoTourSteps,
};
