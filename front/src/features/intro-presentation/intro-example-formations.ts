import { buildIntroCards, type IntroCard, type IntroSelection, type IntroSource } from "./intro-content";
import { INTRO_LEVELS } from "./intro-levels";

type ExampleNode = {
  title: string;
  children: readonly ExampleNode[];
  details?: Record<string, string[]>;
};

type ExampleCourse = readonly [title: string, lessons: readonly string[]];

export type IntroFormationOption = {
  id: string;
  title: string;
  isCurrent: boolean;
};

const moduleNode = (title: string, courses: readonly ExampleCourse[]): ExampleNode => ({
  title,
  details: { "module.duree": ["14 heures"], "module.tags": [title] },
  children: courses.map(([courseTitle, lessons]) => ({
    title: courseTitle,
    details: { "cours.objectifs": [`Mettre en pratique : ${courseTitle.toLocaleLowerCase("fr")}`] },
    children: lessons.map((lessonTitle) => ({
      title: lessonTitle,
      details: { "lecon.modalite": ["À distance"] },
      children: [
        { title: `Lire : ${lessonTitle}`, children: [] },
        { title: `Démonstration : ${lessonTitle}`, children: [] },
      ],
    })),
  })),
});

const pathway = (title: string, modules: readonly ExampleNode[]): ExampleNode => ({
  title,
  children: modules,
  details: {
    "parcours.groupes": ["Promotion automne 2026"],
    "parcours.competences": modules.map((item) => item.title),
  },
});

export const INTRO_EXAMPLE_FORMATIONS: readonly (IntroFormationOption & { node: ExampleNode })[] = [
  {
    id: "web", title: "Développeur web et web mobile", isCurrent: false,
    node: {
      title: "Développeur web et web mobile",
      details: { "formation.niveau": ["Niveau 5"] },
      children: [
        pathway("Créer des interfaces web", [
          moduleNode("HTML et accessibilité", [
            ["Structurer une page HTML", ["Titres et paragraphes", "Liens et images accessibles"]],
            ["Créer un formulaire", ["Labels et champs de saisie", "Messages d’erreur accessibles"]],
          ]),
          moduleNode("CSS et mise en page", [
            ["Composer une page avec Flexbox", ["Aligner les éléments", "Répartir les espaces"]],
            ["Adapter un site aux mobiles", ["Points de rupture", "Images adaptatives"]],
          ]),
        ]),
        pathway("Développer une application web", [
          moduleNode("JavaScript dans le navigateur", [
            ["Réagir aux interactions", ["Écouter un clic", "Mettre à jour le DOM"]],
            ["Consommer une API", ["Lire une réponse JSON", "Gérer les erreurs réseau"]],
          ]),
          moduleNode("API et bases de données", [
            ["Créer une API Express", ["Définir une route", "Valider une requête"]],
            ["Interroger PostgreSQL", ["Créer une table", "Relier deux tables"]],
          ]),
        ]),
      ],
    },
  },
  {
    id: "hotel", title: "Réceptionniste en hôtellerie", isCurrent: false,
    node: {
      title: "Réceptionniste en hôtellerie",
      details: { "formation.niveau": ["Niveau 4"] },
      children: [
        pathway("Accueillir et accompagner le client", [
          moduleNode("Accueil à la réception", [
            ["Préparer une arrivée", ["Vérifier la réservation", "Préparer la fiche client"]],
            ["Réaliser un check-in", ["Présenter les services de l’hôtel", "Remettre la clé de chambre"]],
          ]),
          moduleNode("Relation client", [
            ["Répondre aux demandes du séjour", ["Conseiller une visite locale", "Organiser un transfert"]],
            ["Traiter une réclamation", ["Écouter et reformuler", "Proposer une solution adaptée"]],
          ]),
        ]),
        pathway("Gérer les réservations et les départs", [
          moduleNode("Réservation des chambres", [
            ["Enregistrer une réservation", ["Lire le planning des chambres", "Confirmer un séjour"]],
            ["Modifier un séjour", ["Décaler une date d’arrivée", "Mettre à jour les prestations"]],
          ]),
          moduleNode("Facturation et départ", [
            ["Préparer une facture", ["Vérifier les consommations", "Présenter le détail du séjour"]],
            ["Réaliser un check-out", ["Encaisser le règlement", "Recueillir l’avis du client"]],
          ]),
        ]),
      ],
    },
  },
  {
    id: "payroll", title: "Gestionnaire de paie", isCurrent: false,
    node: {
      title: "Gestionnaire de paie",
      details: { "formation.niveau": ["Niveau 5"] },
      children: [
        pathway("Préparer les éléments de paie", [
          moduleNode("Dossier du salarié", [
            ["Constituer un dossier d’embauche", ["Collecter les informations du salarié", "Identifier la convention collective"]],
            ["Suivre les contrats de travail", ["Lire les clauses d’un contrat", "Enregistrer un avenant"]],
          ]),
          moduleNode("Temps de travail et absences", [
            ["Collecter les heures travaillées", ["Lire un relevé d’heures", "Identifier les heures supplémentaires"]],
            ["Suivre les absences", ["Enregistrer des congés payés", "Recueillir un justificatif d’absence"]],
          ]),
        ]),
        pathway("Produire et contrôler les bulletins", [
          moduleNode("Construction du bulletin", [
            ["Organiser les rubriques de paie", ["Repérer les éléments du brut", "Lire les lignes de cotisations"]],
            ["Contrôler un bulletin", ["Comparer deux périodes", "Repérer une anomalie de saisie"]],
          ]),
          moduleNode("Clôture mensuelle", [
            ["Préparer les déclarations sociales", ["Collecter les données déclaratives", "Contrôler la cohérence des données"]],
            ["Archiver les documents de paie", ["Classer les justificatifs", "Protéger les données des salariés"]],
          ]),
        ]),
      ],
    },
  },
];

/** Chaque clic choisit une branche complète du jeu de démonstration. */
export function buildExampleIntroCards(
  formationId: string,
  selection: IntroSelection,
  organisationName?: string,
): IntroCard[] {
  const formation = INTRO_EXAMPLE_FORMATIONS.find((item) => item.id === formationId)
    ?? INTRO_EXAMPLE_FORMATIONS[0];
  const nodes: ExampleNode[] = [formation.node];
  for (let level = 2; level < INTRO_LEVELS.length; level += 1) {
    const children = nodes[nodes.length - 1].children;
    const chosen = children.find((item) => item.title === selection[INTRO_LEVELS[level].id]?.title) ?? children[0];
    if (!chosen) break;
    nodes.push(chosen);
  }
  const titles = (index: number): string[] => nodes[index]?.children.map((item) => item.title) ?? [];
  const chosen: IntroSelection = {};
  const details: NonNullable<IntroSource["details"]> = {};
  nodes.forEach((node, index) => {
    chosen[INTRO_LEVELS[index + 1].id] = { title: node.title, isPlaceholder: false };
    Object.assign(details, node.details);
  });
  return buildIntroCards({
    organisationName,
    includeExamples: false,
    selection: chosen,
    formationTitles: [formation.title],
    parcoursTitles: titles(0),
    moduleTitles: titles(1),
    courseTitles: titles(2),
    lessonTitles: titles(3),
    activities: titles(4).map((title, index) => ({ title, type: index === 0 ? "text" : "video" })),
    details,
  }).map((card, index) => ({
    ...card,
    isPlaceholder: index > 0,
    rows: card.rows.map((row) => ({ ...row, isPlaceholder: index < INTRO_LEVELS.length - 1 })),
    details: card.details.map((detail) => ({
      ...detail, isPlaceholder: true,
      items: detail.items.map((item) => ({ ...item, isPlaceholder: true })),
    })),
  }));
}
