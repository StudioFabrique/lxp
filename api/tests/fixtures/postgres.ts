import { prisma } from "../../src/utils/db.ts";
import mongoose from "mongoose";
import User from "../../src/utils/interfaces/db/user.ts";
import Role from "../../src/utils/interfaces/db/role.ts";
import Group from "../../src/utils/interfaces/db/group.ts";
import { env } from "../../src/config/env.ts";

const MONGO_URL = env.MONGO_LOCAL_URL;

mongoose.connection.once("open", () => {
  console.log("MongoDB connection ready!");
  console.log(MONGO_URL);
});

mongoose.connection.on("error", (err) => {
  console.error(err);
});

async function mongoConnect() {
  await mongoose.connect(MONGO_URL!);
}

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
  const newTags = await prisma.orm.public.Tag.createAndCount(tab).then(
    (count) => ({ count }),
  );
  console.log({ newTags });
}

async function createAdmins() {
  await mongoConnect();
  try {
    const roleId = await Role.find({ role: "admin" }, { _id: 1 });
    const usersId = await User.find(
      { roles: { $in: roleId.map(({ _id }) => _id) } },
      { _id: 1 },
    );
    console.log({ usersId });
    const newAdmins = Array<any>();
    usersId.forEach((item) => newAdmins.push({ idMdb: item._id.toString() }));
    const storedAdminsIds = await prisma.orm.public.Admin.createAndCount(
      newAdmins,
    ).then((count) => ({ count }));
  } catch (error) {
    throw error;
  }
}

async function createTeachers() {
  await mongoConnect();
  try {
    const roleId = await Role.find({ role: "teacher" }, { _id: 1 });
    const usersId = await User.find(
      { roles: { $in: roleId.map(({ _id }) => _id) } },
      { _id: 1 },
    );
    console.log("formateurs", usersId);

    const newAdmins = Array<any>();
    usersId.forEach((item) => newAdmins.push({ idMdb: item._id.toString() }));
    const storedUsersIds = await prisma.orm.public.Teacher.createAndCount(
      newAdmins,
    ).then((count) => ({ count }));
  } catch (error) {
    throw error;
  }
}

async function createSqlGroups() {
  const mongoGroups = await Group.find({}, { _id: 1 });
  console.log({ mongoGroups });

  const data = mongoGroups.map((item: any) => ({ idMdb: item._id.toString() }));
  const sqlGroups = await prisma.orm.public.Group.createAndCount(data).then(
    (count) => ({ count }),
  );
}

async function createSqlContacts() {
  try {
    const roleId = await Role.find({ role: "teacher" }, { _id: 1 });
    const usersId = await User.find(
      { roles: { $in: roleId.map(({ _id }) => _id) } },
      { _id: 1, firstname: 1, lastname: 1, phoneNumber: 1, email: 1 },
    );
    const contacts = usersId.map((user: any) => {
      return {
        idMdb: user._id.toString(),
        role: "formateur",
        email: user.email,
        phone: user.phoneNumber,
      };
    });
    await prisma.orm.public.Contact.createAndCount(contacts).then((count) => ({
      count,
    }));
  } catch (error: any) {
    throw error;
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
        level: "2",
      },
      {
        title: "Concepteur Développeur d'Application",
        description:
          "Toutes les compétences pour concevoir et développer des applications.",
        code: "014",
        level: "3",
      },
    ];
    await prisma.orm.public.Formation.create({
      ...newFormations[0],
      tags: (relation) =>
        relation.create(
          tags1Dw.map((tagId) => ({ tagId })),
        ),
      admin: (relation) => relation.connect({ id: 1 }),
    });
    await prisma.orm.public.Formation.create({
      ...newFormations[1],
      tags: (relation) =>
        relation.create(
          tagsCDA.map((tagId) => ({ tagId })),
        ),
      admin: (relation) => relation.connect({ id: 1 }),
    });
  } catch (error) {
    throw error;
  }
}

async function createParcours() {
  try {
    const contacts = await prisma.orm.public.Contact.all();
    const modules = await prisma.orm.public.Module.all();
    console.log({ modules });

    const parcours = await prisma.orm.public.Parcours.create({
      title: "Parcours Test 1",
      formation: (relation) =>
        relation.connect({
          id: 1,
        }),
      author: "jean fontaine",
      admin: (relation) => relation.connect({ id: 1 }),
      contacts: (relation) =>
        relation.create([
          { contact: (relation) => relation.connect({ id: contacts[0].id }) },
          { contact: (relation) => relation.connect({ id: contacts[1].id }) },
        ]),
    });
    await prisma.orm.public.Module.createAndCount([
      {
        title: "Module 1",
        author: "test",
        adminId: 1,
        parcoursId: parcours.id,
      },
      {
        title: "Module 2",
        author: "test",
        adminId: 1,
        parcoursId: parcours.id,
      },
      {
        title: "Module 3",
        author: "test",
        adminId: 1,
        parcoursId: parcours.id,
      },
    ]).then((count) => ({ count }));
    await prisma.orm.public.Course.create({
      title: "Course 1",
      description: "Description 1",
      moduleId: 1,
      adminId: 1,
      order: 0,
      dates: [],
      author: "jacques test",
    });
  } catch (error: any) {
    throw error;
  }
}

async function loadFixtures() {
  await createTags();
  await createAdmins();
  await createTeachers();
  await createFormation();
  await createSqlGroups();
  await createSqlContacts();
  await createParcours();
  await disconnect();
}

loadFixtures().catch(async (error) => {
  console.error("Échec de la préparation des fixtures PostgreSQL:", error);
  await disconnect();
  await prisma.close();
  process.exitCode = 1;
});
