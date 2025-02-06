import { prisma } from "./utils/db";

const tags: string[] = [
  "HTML",
  "CSS",
  "JavaScript",
  "TypeScript",
  "React",
  "Angular",
  "Vue.js",
  "Node.js",
  "Express",
  "Django",
  "Ruby on Rails",
  "PHP",
  "Laravel",
  "Symfony",
  "ASP.NET",
  "Java",
  "Spring",
  "C#",
  "Python",
  "Flask",
  "FastAPI",
  "GraphQL",
  "REST API",
  "MongoDB",
  "MySQL",
  "PostgreSQL",
  "Firebase",
  "AWS",
  "Docker",
  "Kubernetes",
  "Boulangerie",
  "Patisserie",
  "Boulanger",
  "Farine",
  "Pâte",
  "Pain",
  "Croissant",
  "Viennoiserie",
  "Levain",
  "Fermenttion",
  "Artisanale",
  "Fabrication",
  "Entreprise",
  "Pétrissage",
  "Pesée",
  "Technique",
  "Approvisionnement",
  "Cuisson",
  "Façonnage",
  "Distribution",
  "Alimentation",
  "Gaspillage",
];

const colors = [
  "rgba(255, 0, 0, 0.5)", // Red
  "rgba(0, 255, 0, 0.5)", // Green
  "rgba(0, 0, 255, 0.5)", // Blue
  "rgba(255, 255, 0, 0.5)", // Yellow
  "rgba(255, 0, 255, 0.5)", // Magenta
  "rgba(0, 255, 255, 0.5)", // Cyan
  "rgba(128, 0, 0, 0.5)", // Maroon
  "rgba(0, 128, 0, 0.5)", // Green (dark)
  "rgba(0, 0, 128, 0.5)", // Navy
  "rgba(128, 128, 0, 0.5)", // Olive
  "rgba(128, 0, 128, 0.5)", // Purple
  "rgba(0, 128, 128, 0.5)", // Teal
  "rgba(255, 165, 0, 0.5)", // Orange
  "rgba(139, 69, 19, 0.5)", // Saddle Brown
  "rgba(220, 20, 60, 0.5)", // Crimson
  "rgba(46, 139, 87, 0.5)", // Sea Green
  "rgba(255, 215, 0, 0.5)", // Gold
  "rgba(139, 0, 139, 0.5)", // Dark Magenta
  "rgba(0, 100, 0, 0.5)", // Dark Green
  "rgba(0, 0, 139, 0.5)", // Dark Blue
];

function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

let tagsColors = Array<string>();

function setTagsColors() {
  let leftColors = colors;
  for (let i = 0; i < tags.length; i++) {
    if (leftColors.length === 0) {
      leftColors = colors;
    }
    tagsColors.push(leftColors[getRandomNumber(0, leftColors.length - 1)]);
    leftColors = leftColors.filter((col) => col !== tagsColors[i]);
  }
}

async function createTags() {
  const tab = Array<any>();
  setTagsColors();
  let index = 0;
  tags.forEach((tag: any) => {
    tab.push({ name: tag, color: `${tagsColors[index]}` });
    index++;
  });
  const newTags = await prisma.tag.createMany({
    data: tab,
    skipDuplicates: true,
  });
  console.log({ newTags });
}

async function loadFixtures() {
  await createTags();
}

loadFixtures();
