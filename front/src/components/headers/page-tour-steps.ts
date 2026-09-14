import type { Step } from "react-joyride";

export const tagsPageTourSteps: Step[] = [
  {
    id: "tags-header",
    target: '[data-page-tour="header"]',
    title: "Gestion des tags",
    content:
      "Cette page centralise les tags utilisés pour classer et retrouver les contenus de la plateforme.",
    placement: "bottom",
  },
  {
    id: "tags-actions",
    target: '[data-page-tour="header-actions"]',
    title: "Créer des tags",
    content:
      "Utilisez cette action pour créer un ou plusieurs tags. Elle est visible selon vos permissions.",
    placement: "left",
  },
  {
    id: "tags-filters",
    target: '[data-page-tour="filters"]',
    title: "Rechercher et agir",
    content:
      "Recherchez un tag par son nom, actualisez la liste ou appliquez une action aux lignes sélectionnées.",
    placement: "bottom",
  },
  {
    id: "tags-table",
    target: '[data-page-tour="table"]',
    title: "Liste des tags",
    content:
      "Le tableau permet de sélectionner, trier, modifier ou supprimer les tags disponibles.",
    placement: "top",
  },
  {
    id: "tags-pagination",
    target: '[data-page-tour="pagination"]',
    title: "Parcourir les résultats",
    content:
      "Naviguez entre les pages et choisissez le nombre de tags affichés à la fois.",
    placement: "top",
  },
];

export const groupsPageTourSteps: Step[] = [
  {
    id: "groups-header",
    target: '[data-page-tour="header"]',
    title: "Gestion des groupes",
    content:
      "Cette vue permet d'organiser les apprenants en groupes et d'accéder à leur gestion.",
    placement: "bottom",
  },
  {
    id: "groups-actions",
    target: '[data-page-tour="header-actions"]',
    title: "Créer un groupe",
    content:
      "Lancez ici la création d'un groupe lorsque votre rôle vous y autorise.",
    placement: "left",
  },
  {
    id: "groups-filters",
    target: '[data-page-tour="filters"]',
    title: "Rechercher et actualiser",
    content:
      "Retrouvez rapidement un groupe et utilisez les actions disponibles sur votre sélection.",
    placement: "bottom",
  },
  {
    id: "groups-table",
    target: '[data-page-tour="table"]',
    title: "Liste des groupes",
    content:
      "Sélectionnez un groupe pour le modifier, consulter ses membres ou le supprimer selon vos droits.",
    placement: "top",
  },
  {
    id: "groups-pagination",
    target: '[data-page-tour="pagination"]',
    title: "Parcourir les groupes",
    content:
      "Ces contrôles permettent de changer de page et d'adapter le nombre de groupes affichés.",
    placement: "top",
  },
];

export const usersPageTourSteps: Step[] = [
  {
    id: "users-header",
    target: '[data-page-tour="header"]',
    title: "Gestion des utilisateurs",
    content:
      "Créez et administrez les comptes, leurs rôles et leurs accès depuis cette vue.",
    placement: "bottom",
  },
  {
    id: "users-actions",
    target: '[data-page-tour="header-actions"]',
    title: "Créer un utilisateur",
    content:
      "Ce bouton ouvre le formulaire de création d'un compte si vous disposez de la permission nécessaire.",
    placement: "left",
  },
  {
    id: "users-stats",
    target: '[data-page-tour="stats"]',
    title: "Indicateurs utilisateurs",
    content:
      "Ces cartes résument les principaux chiffres de votre population d'utilisateurs.",
    placement: "bottom",
  },
  {
    id: "users-roles",
    target: '[data-page-tour="role-filters"]',
    title: "Filtrer par rôle",
    content:
      "Choisissez un rôle pour limiter la liste aux comptes correspondants.",
    placement: "bottom",
  },
  {
    id: "users-filters",
    target: '[data-page-tour="filters"]',
    title: "Rechercher un utilisateur",
    content:
      "Utilisez la recherche pour retrouver un compte, puis actualisez les résultats si nécessaire.",
    placement: "bottom",
  },
  {
    id: "users-table",
    target: '[data-page-tour="table"]',
    title: "Comptes utilisateurs",
    content:
      "Le tableau rassemble les informations et les actions disponibles pour chaque utilisateur.",
    placement: "top",
  },
  {
    id: "users-pagination",
    target: '[data-page-tour="pagination"]',
    title: "Parcourir les comptes",
    content: "Changez de page ou ajustez le nombre d'utilisateurs visibles.",
    placement: "top",
  },
];

export const rolesPageTourSteps: Step[] = [
  {
    id: "roles-header",
    target: '[data-page-tour="header"]',
    title: "Gestion des rôles",
    content:
      "Les rôles regroupent les droits attribués aux différents profils de la plateforme.",
    placement: "bottom",
  },
  {
    id: "roles-filters",
    target: '[data-page-tour="role-filters"]',
    title: "Rechercher",
    content:
      "Retrouvez rapidement un rôle à partir de son nom, de son libellé ou de son modèle.",
    placement: "bottom",
  },
  {
    id: "roles-cards",
    target: '[data-page-tour="role-cards"]',
    title: "Rôles et permissions",
    content:
      "Chaque carte présente un rôle et le nombre de permissions de lecture, d'écriture, de modification et de suppression.",
    placement: "top",
  },
  {
    id: "roles-create",
    target: '[data-page-tour="role-create-card"]',
    title: "Créer un rôle",
    content:
      "Utilisez cette carte ou le bouton de l'en-tête pour ouvrir le formulaire de création.",
    placement: "top",
  },
];
