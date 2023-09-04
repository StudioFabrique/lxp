import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import User from "./utils/interfaces/db/user";
import Role from "./utils/interfaces/db/role";

const MONGO_URL = process.env.MONGO_LOCAL_URL;

mongoose.connection.once("open", () => {
  console.log("MongoDB connection ready!");
});

mongoose.connection.on("error", (err) => {
  console.error(err);
});

async function mongoConnect() {
  await mongoose.connect(MONGO_URL!);
}

const prisma = new PrismaClient();

// Méthode pour fermer la connexion
const disconnect = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
};

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

const formations = [
  {
    title: "Formation en marketing digital",
    description:
      "Acquérir des compétences en marketing digital et stratégies de publicité en ligne.",
    startDate: "2022-01-10",
    endDate: "2022-02-20",
    duration: 6,
  },
  {
    title: "Formation en développement web",
    description:
      "Apprendre les fondamentaux du développement web et les langages HTML, CSS et JavaScript.",
    startDate: "2022-03-05",
    endDate: "2022-04-15",
    duration: 6,
  },
  {
    title: "Formation en gestion de projet",
    description:
      "Maîtriser les méthodologies de gestion de projet et les outils de planification.",
    startDate: "2022-05-02",
    endDate: "2022-06-10",
    duration: 6,
  },
  {
    title: "Formation en design graphique",
    description:
      "Développer des compétences en design graphique, utilisation des logiciels Adobe, et création d'identités visuelles.",
    startDate: "2022-07-01",
    endDate: "2022-08-10",
    duration: 6,
  },
  {
    title: "Formation en comptabilité",
    description:
      "Acquérir des compétences en comptabilité générale et analytique, gestion financière et fiscalité.",
    startDate: "2022-09-05",
    endDate: "2022-10-15",
    duration: 6,
  },
  {
    title: "Formation en ressources humaines",
    description:
      "Apprendre les bases de la gestion des ressources humaines, recrutement, formation et gestion des carrières.",
    startDate: "2022-11-01",
    endDate: "2022-12-10",
    duration: 6,
  },
  {
    title: "Formation en communication interpersonnelle",
    description:
      "Développer des compétences en communication interpersonnelle, écoute active et résolution de conflits.",
    startDate: "2023-01-10",
    endDate: "2023-02-20",
    duration: 6,
  },
  {
    title: "Formation en gestion du temps",
    description:
      "Améliorer ses compétences en gestion du temps, établir des priorités et optimiser sa productivité.",
    startDate: "2023-03-05",
    endDate: "2023-04-15",
    duration: 6,
  },
  {
    title: "Formation en e-commerce",
    description:
      "Apprendre à créer et gérer une boutique en ligne, stratégies de marketing et logistique.",
    startDate: "2023-05-02",
    endDate: "2023-06-10",
    duration: 6,
  },
  {
    title: "Formation en intelligence artificielle",
    description:
      "Acquérir des compétences en intelligence artificielle, machine learning et deep learning.",
    startDate: "2023-07-01",
    endDate: "2023-08-10",
    duration: 6,
  },
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

async function createAdmins() {
  await mongoConnect();
  try {
    const roleId = await Role.find({ role: "admin" }, { _id: 1 });
    const usersId = await User.find({ roles: roleId }, { _id: 1 });
    console.log({ usersId });
    const newAdmins = Array<any>();
    usersId.forEach((item) => newAdmins.push({ idMdb: item._id.toString() }));
    const storedAdminsIds = await prisma.admin.createMany({
      data: newAdmins,
      skipDuplicates: true,
    });
  } catch (error) {
    console.error("Error occurred while querying roles:", error);
  }
}

async function createTeachers() {
  await mongoConnect();
  try {
    const roleId = await Role.find({ role: "teacher" }, { _id: 1 });
    const usersId = await User.find({ roles: roleId }, { _id: 1 });
    console.log("formateurs", usersId);

    const newAdmins = Array<any>();
    usersId.forEach((item) => newAdmins.push({ idMdb: item._id.toString() }));
    const storedUsersIds = await prisma.teacher.createMany({
      data: newAdmins,
      skipDuplicates: true,
    });
  } catch (error) {
    console.error("Error occurred while querying roles:", error);
  }
}

async function createFormation() {
  try {
    const tags1Dw = [1, 2, 3, 4, 5];
    const tagsCDA = [10, 20, 25, 26, 28];
    const newFormations = [
      {
        title: "Développeur Web",
        description:
          "Toutes les compétences pour développer des applications web et web mobile",
        code: "007",
        level: "bac + 2",
      },
      {
        title: "Concepteur Développeur d'Application",
        description:
          "Toutes les compétences pour concevoir et développer des applications.",
        code: "014",
        level: "bac + 3",
      },
    ];
    await prisma.formation.create({
      data: {
        ...newFormations[0],
        tags: {
          create: tags1Dw.map((item: number) => {
            return {
              tag: { connect: { id: item } },
            };
          }),
        },
      },
    });
    await prisma.formation.create({
      data: {
        ...newFormations[1],
        tags: {
          create: tagsCDA.map((item: number) => {
            return {
              tag: { connect: { id: item } },
            };
          }),
        },
      },
    });
  } catch (error) {
    console.log(error);
  }
}

async function loadFixtures() {
  await createTags();
  await createAdmins();
  await createTeachers();
  await createFormation();
  await disconnect();
}

loadFixtures();
