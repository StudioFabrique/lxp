import { Quiz } from "../utils/interfaces/quiz";

export const ActivityEndingQuizzesFixtures: Quiz[] = [
  {
    type: "mcq",
    question: "Que signifie l'acronyme HTML ?",
    trueExplanation:
      "Bonne réponse ! HTML signifie bien HyperText Markup Language.",
    falseExplanation:
      "C'est incorrect. L'acronyme exact est HyperText Markup Language.",
    data: {
      options: [
        "HyperText Markup Language",
        "Hyperlinks and Text Markup Language",
        "Home Tool Markup Language",
        "Hyper Text Multi Language",
      ],
      answerIndex: 0,
    },
  },
  {
    type: "mcq",
    question:
      "En CSS, quelle propriété est utilisée pour modifier la couleur du texte ?",
    trueExplanation:
      "Exactement ! La propriété `color` affecte la couleur du texte.",
    falseExplanation:
      "Raté ! Il fallait choisir `color`. La propriété `background-color` sert à modifier l'arrière-plan.",
    data: {
      options: ["font-color", "text-color", "color", "background-color"],
      answerIndex: 2,
    },
  },
  {
    type: "matching",
    question: "Associez chaque balise HTML à son usage correct :",
    trueExplanation:
      "Parfait ! Vous avez bien identifié le rôle sémantique de chaque balise.",
    falseExplanation:
      "Ce n'est pas tout à fait ça. <h1> est pour les titres, <a> pour les liens, et <img> pour afficher une image.",
    data: {
      pairs: [
        { left: "<h1>", right: "Titre principal de la page" },
        { left: "<a>", right: "Lien hypertexte" },
        { left: "<img>", right: "Insertion d'une image" },
      ],
    },
  },
  {
    type: "ordering",
    question:
      "Ordonnez ces sélecteurs CSS du moins spécifique au plus spécifique (poids) :",
    trueExplanation:
      "Bravo ! L'ordre de priorité (spécificité) va bien de la balise, à la classe, jusqu'à l'ID.",
    falseExplanation:
      "Oups. Le bon ordre croissant de spécificité est : la balise, puis la classe, et enfin l'ID.",
    data: {
      items: [
        "Sélecteur d'ID (#mon-id)",
        "Sélecteur de balise (p)",
        "Sélecteur de classe (.ma-classe)",
      ],
      order: [1, 2, 0], // Balise (index 1), puis Classe (index 2), puis ID (index 0)
    },
  },
  {
    type: "true_false",
    question: "En CSS, l'unité 'px' (pixel) est une unité relative.",
    trueExplanation:
      "Bien vu ! C'est faux. Le pixel est une unité absolue. Les unités relatives sont par exemple 'em', 'rem' ou '%'.",
    falseExplanation:
      "C'est une erreur. Le pixel (px) est une unité absolue, sa taille ne dépend pas de l'élément parent.",
    data: {
      answer: false,
    },
  },
];
