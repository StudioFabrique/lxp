import Skill from "../interfaces/skill";

const data: any = [
  {
    description: "Développement front-end",
    formation: "Ingénierie Web",
    parcours: generateParcours(),
  },
  {
    description: "Conception d'interfaces utilisateur",
    formation: "Design d'expérience utilisateur",
    parcours: generateParcours(),
  },
  {
    description: "Développement back-end",
    formation: "Génie logiciel",
    parcours: generateParcours(),
  },
  {
    description: "Gestion de bases de données",
    formation: "Science informatique",
    parcours: generateParcours(),
  },
  {
    description: "Sécurité des applications web",
    formation: "Sécurité informatique",
    parcours: generateParcours(),
  },
  {
    description: "Optimisation des performances web",
    formation: "Ingénierie des systèmes",
    parcours: generateParcours(),
  },
  {
    description: "Développement full-stack",
    formation: "Ingénierie logicielle",
    parcours: generateParcours(),
  },
  {
    description: "Conception responsive",
    formation: "Design graphique",
    parcours: generateParcours(),
  },
  {
    description: "Gestion de projets web",
    formation: "Gestion de projet",
    parcours: generateParcours(),
  },
  {
    description: "Intégration de contenu web",
    formation: "Communication multimédia",
    parcours: generateParcours(),
  },
  {
    description: "Développement mobile",
    formation: "Ingénierie logicielle",
    parcours: generateParcours(),
  },
  {
    description: "Architecture des applications web",
    formation: "Architecture des systèmes",
    parcours: generateParcours(),
  },
  {
    description: "Développement d'applications web",
    formation: "Génie logiciel",
    parcours: generateParcours(),
  },
  {
    description: "Analyse de données web",
    formation: "Science des données",
    parcours: generateParcours(),
  },
  {
    description: "Développement e-commerce",
    formation: "Commerce électronique",
    parcours: generateParcours(),
  },
  {
    description: "Test et débogage web",
    formation: "Ingénierie logicielle",
    parcours: generateParcours(),
  },
  {
    description: "Sécurité des réseaux",
    formation: "Sécurité informatique",
    parcours: generateParcours(),
  },
  {
    description: "Design d'interfaces web",
    formation: "Design graphique",
    parcours: generateParcours(),
  },
  {
    description: "Développement d'applications mobiles",
    formation: "Ingénierie logicielle",
    parcours: generateParcours(),
  },
  {
    description: "Intégration de médias sociaux",
    formation: "Communication multimédia",
    parcours: generateParcours(),
  },
  {
    description: "Développement d'applications web réactives",
    formation: "Génie logiciel",
    parcours: generateParcours(),
  },
  {
    description: "Optimisation du référencement",
    formation: "Marketing numérique",
    parcours: generateParcours(),
  },
  {
    description: "Développement de sites e-commerce",
    formation: "Ingénierie Web",
    parcours: generateParcours(),
  },
  {
    description: "Maintenance des applications web",
    formation: "Génie logiciel",
    parcours: generateParcours(),
  },
  {
    description: "Développement d'applications web sécurisées",
    formation: "Sécurité informatique",
    parcours: generateParcours(),
  },
  {
    description: "Conception de bases de données",
    formation: "Science informatique",
    parcours: generateParcours(),
  },
  {
    description: "Développement d'applications mobiles hybrides",
    formation: "Ingénierie logicielle",
    parcours: generateParcours(),
  },
  {
    description: "Design d'interfaces utilisateur mobile",
    formation: "Design d'expérience utilisateur",
    parcours: generateParcours(),
  },
  {
    description: "Intégration de systèmes de paiement",
    formation: "Commerce électronique",
    parcours: generateParcours(),
  },
  {
    description: "Développement de blogs",
    formation: "Ingénierie Web",
    parcours: generateParcours(),
  },
  {
    description: "Développement de jeux web",
    formation: "Génie logicielle",
    parcours: generateParcours(),
  },
  {
    description: "Optimisation de la vitesse de chargement web",
    formation: "Ingénierie des systèmes",
    parcours: generateParcours(),
  },
  {
    description: "Développement de sites web responsifs",
    formation: "Design graphique",
    parcours: generateParcours(),
  },
  {
    description: "Développement de chatbots",
    formation: "Intelligence artificielle",
    parcours: generateParcours(),
  },
  {
    description: "Intégration de services de localisation",
    formation: "Ingénierie logicielle",
    parcours: generateParcours(),
  },
  {
    description: "Analyse des données utilisateur",
    formation: "Science des données",
    parcours: generateParcours(),
  },
  {
    description: "Développement d'applications web avec Django",
    formation: "Génie logiciel",
    parcours: generateParcours(),
  },
  {
    description: "Design d'interfaces web réactives",
    formation: "Design graphique",
    parcours: generateParcours(),
  },
  {
    description: "Développement de sites web avec WordPress",
    formation: "Ingénierie Web",
    parcours: generateParcours(),
  },
  {
    description: "Automatisation des tests web",
    formation: "Ingénierie logicielle",
    parcours: generateParcours(),
  },
  {
    description: "Sécurité des applications mobiles",
    formation: "Sécurité informatique",
    parcours: generateParcours(),
  },
  {
    description: "Développement d'applications web avec Ruby on Rails",
    formation: "Génie logiciel",
    parcours: generateParcours(),
  },
  {
    description: "Intégration de services de paiement",
    formation: "Commerce électronique",
    parcours: generateParcours(),
  },
  {
    description: "Développement de portfolios en ligne",
    formation: "Design graphique",
    parcours: generateParcours(),
  },
  {
    description: "Optimisation de la convivialité web",
    formation: "Design d'expérience utilisateur",
    parcours: generateParcours(),
  },
  {
    description: "Développement d'applications web avec Angular",
    formation: "Ingénierie logicielle",
    parcours: generateParcours(),
  },
  {
    description: "Analyse de la performance des sites web",
    formation: "Ingénierie des systèmes",
    parcours: generateParcours(),
  },
  {
    description: "Développement de sites web avec Drupal",
    formation: "Ingénierie Web",
    parcours: generateParcours(),
  },
  {
    description: "Sécurité des applications web",
    formation: "Génie logiciel",
    parcours: generateParcours(),
  },
  {
    description: "Développement d'applications web avec Flask",
    formation: "Génie logiciel",
    parcours: generateParcours(),
  },
  {
    description: "Intégration de médias interactifs",
    formation: "Communication multimédia",
    parcours: generateParcours(),
  },
  {
    description: "Développement de sites web avec Joomla",
    formation: "Ingénierie Web",
    parcours: generateParcours(),
  },
  {
    description: "Conception de systèmes de gestion de contenu",
    formation: "Science informatique",
    parcours: generateParcours(),
  },
];

// Fonction pour générer une parcours aléatoire
function generateParcours() {
  const formations = ["Développeur web", "CDA", "Intégrateur web"];
  const randomFormation =
    formations[Math.floor(Math.random() * formations.length)];
  const randomYear = Math.floor(Math.random() * (2023 - 2021 + 1)) + 2021;
  return `${randomFormation} ${randomYear}`;
}

export function getDBSkills(): any[] {
  const skills = data.map((item: any, i: number) => ({ ...item, id: i }));
  return skills;
}
