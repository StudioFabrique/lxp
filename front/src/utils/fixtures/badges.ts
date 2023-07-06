const badges = [
  {
    title: "Formation en marketing digital",
    description:
      "Acquérir des compétences en marketing digital et stratégies de publicité en ligne.",
    image: "badge-react.png",
    createdAt: "2022-01-10",
    updatedAt: "2022-02-20",
  },
  {
    title: "Formation en développement web",
    description:
      "Apprendre les fondamentaux du développement web et les langages HTML, CSS et JavaScript.",
    image: "badge-react.png",
    createdAt: "2022-03-05",
    updatedAt: "2022-04-15",
  },
  {
    title: "Formation en gestion de projet",
    description:
      "Maîtriser les méthodologies de gestion de projet et les outils de planification.",
    image: "badge-react.png",
    createdAt: "2022-05-02",
    updatedAt: "2022-06-10",
  },
  {
    title: "Formation en design graphique",
    description:
      "Développer des compétences en design graphique, utilisation des logiciels Adobe, et création d'identités visuelles.",
    image: "badge-react.png",
    createdAt: "2022-07-01",
    updatedAt: "2022-08-10",
  },
  {
    title: "Formation en comptabilité",
    description:
      "Acquérir des compétences en comptabilité générale et analytique, gestion financière et fiscalité.",
    image: "badge-react.png",
    createdAt: "2022-09-05",
    updatedAt: "2022-10-15",
  },
  {
    title: "Formation en ressources humaines",
    description:
      "Apprendre les bases de la gestion des ressources humaines, recrutement, formation et gestion des carrières.",
    image: "badge-react.png",
    createdAt: "2022-11-01",
    updatedAt: "2022-12-10",
  },
  {
    title: "Formation en communication interpersonnelle",
    description:
      "Développer des compétences en communication interpersonnelle, écoute active et résolution de conflits.",
    image: "badge-react.png",
    createdAt: "2023-01-10",
    updatedAt: "2023-02-20",
  },
  {
    title: "Formation en gestion du temps",
    description:
      "Améliorer ses compétences en gestion du temps, établir des priorités et optimiser sa productivité.",
    image: "badge-react.png",
    createdAt: "2023-03-05",
    updatedAt: "2023-04-15",
  },
  {
    title: "Formation en e-commerce",
    description:
      "Apprendre à créer et gérer une boutique en ligne, stratégies de marketing et logistique.",
    image: "badge-react.png",
    createdAt: "2023-05-02",
    updatedAt: "2023-06-10",
  },
  {
    title: "Formation en intelligence artificielle",
    description:
      "Acquérir des compétences en intelligence artificielle, machine learning et deep learning.",
    image: "badge-react.png",
    createdAt: "2023-07-01",
    updatedAt: "2023-08-10",
  },
];

export function getFixturesBadges() {
  let i = 0;
  return badges.map((item) => {
    i++;
    return { ...item, id: i };
  });
}
