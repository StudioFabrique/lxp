import { prisma } from "./src/utils/db";
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "./src/utils/interfaces/db/user";
import Role from "./src/utils/interfaces/db/role";
import Group from "./src/utils/interfaces/db/group";
import Tag from "./src/utils/interfaces/db/tag";
import Permission from "./src/utils/interfaces/db/permission";
import ConnectionInfos from "./src/utils/interfaces/db/connection-infos";
import {
  permDefsActions,
  permDefsInterface,
} from "./src/utils/rbac/config/fixtures-permissions";

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

// Méthode pour fermer la connexion
const disconnect = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
};

// =================== DONNÉES DE BASE ===================

const firstnames = [
  "Oliver",
  "Sophia",
  "Ethan",
  "Emma",
  "Aiden",
  "Isabella",
  "Jackson",
  "Mia",
  "Lucas",
  "Charlotte",
  "Liam",
  "Amelia",
  "Noah",
  "Harper",
  "Mason",
  "Evelyn",
];

const lastnames = [
  "Smith",
  "Johnson",
  "Williams",
  "Brown",
  "Jones",
  "Garcia",
  "Miller",
  "Davis",
  "Rodriguez",
  "Martinez",
  "Hernandez",
  "Lopez",
  "Gonzalez",
  "Wilson",
  "Anderson",
  "Thomas",
];

const cities = [
  { name: "Paris", postcode: "75001" },
  { name: "Lyon", postcode: "69000" },
  { name: "Marseille", postcode: "13000" },
  { name: "Toulouse", postcode: "31000" },
  { name: "Nice", postcode: "06000" },
  { name: "Nantes", postcode: "44000" },
  { name: "Montpellier", postcode: "34000" },
  { name: "Strasbourg", postcode: "67000" },
  { name: "Bordeaux", postcode: "33000" },
  { name: "Lille", postcode: "59000" },
];

const addresses = [
  "12 rue de la Paix",
  "45 avenue des Champs",
  "8 boulevard Victor Hugo",
  "23 place de la République",
  "67 rue de Rivoli",
  "34 avenue Montaigne",
  "91 rue Saint-Honoré",
  "156 boulevard Haussmann",
  "78 rue de la Pompe",
  "203 avenue de la Grande Armée",
  "89 rue de Courcelles",
  "145 rue du Faubourg",
  "267 boulevard Saint-Germain",
  "98 rue de Grenelle",
  "134 avenue Kléber",
  "176 rue de la Convention",
];

const domains = [
  "gmail.com",
  "yahoo.fr",
  "outlook.com",
  "hotmail.fr",
  "orange.fr",
  "free.fr",
  "wanadoo.fr",
  "laposte.net",
  "sfr.fr",
  "numericable.fr",
];

const tags = [
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
  "Fermentation",
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
  "Hygiène",
  "Sécurité alimentaire",
  "Innovation",
  "Créativité",
];

const colors = [
  "rgba(255, 0, 0, 0.5)",
  "rgba(0, 255, 0, 0.5)",
  "rgba(0, 0, 255, 0.5)",
  "rgba(255, 255, 0, 0.5)",
  "rgba(255, 0, 255, 0.5)",
  "rgba(0, 255, 255, 0.5)",
  "rgba(128, 0, 0, 0.5)",
  "rgba(0, 128, 0, 0.5)",
  "rgba(0, 0, 128, 0.5)",
  "rgba(128, 128, 0, 0.5)",
  "rgba(128, 0, 128, 0.5)",
  "rgba(0, 128, 128, 0.5)",
  "rgba(255, 165, 0, 0.5)",
  "rgba(139, 69, 19, 0.5)",
  "rgba(220, 20, 60, 0.5)",
  "rgba(46, 139, 87, 0.5)",
  "rgba(255, 215, 0, 0.5)",
  "rgba(139, 0, 139, 0.5)",
  "rgba(0, 100, 0, 0.5)",
  "rgba(0, 0, 139, 0.5)",
];

const formations = [
  {
    title: "Développeur Web Full Stack",
    description:
      "Formation complète pour devenir développeur web full stack avec les dernières technologies",
    code: "DWFS2024",
    level: "Bac+3",
    modules: [
      {
        title: "Fondamentaux du Web",
        description: "Apprentissage des bases HTML, CSS et JavaScript",
        duration: 120,
        courses: [
          {
            title: "Introduction au HTML",
            description: "Les bases du langage de balisage HTML",
            lessons: [
              {
                title: "Structure d'un document HTML",
                description: "Comprendre la structure de base d'une page web",
                modalite: "presentiel",
              },
              {
                title: "Les balises essentielles",
                description: "Maîtriser les balises HTML les plus importantes",
                modalite: "distanciel",
              },
              {
                title: "Formulaires HTML",
                description: "Créer des formulaires interactifs",
                modalite: "presentiel",
              },
            ],
          },
          {
            title: "CSS Avancé",
            description: "Techniques avancées de mise en forme",
            lessons: [
              {
                title: "Flexbox et Grid",
                description: "Maîtriser les layouts modernes",
                modalite: "presentiel",
              },
              {
                title: "Animations CSS",
                description: "Créer des animations fluides",
                modalite: "distanciel",
              },
              {
                title: "Responsive Design",
                description: "Adapter vos sites à tous les écrans",
                modalite: "presentiel",
              },
            ],
          },
        ],
      },
      {
        title: "JavaScript Moderne",
        description: "Maîtrise du JavaScript ES6+ et des frameworks modernes",
        duration: 180,
        courses: [
          {
            title: "JavaScript ES6+",
            description: "Les nouvelles fonctionnalités de JavaScript",
            lessons: [
              {
                title: "Arrow functions et destructuring",
                description: "Syntaxe moderne de JavaScript",
                modalite: "presentiel",
              },
              {
                title: "Promesses et async/await",
                description: "Programmation asynchrone",
                modalite: "distanciel",
              },
              {
                title: "Modules et imports",
                description: "Organisation du code JavaScript",
                modalite: "presentiel",
              },
            ],
          },
          {
            title: "React Fundamentals",
            description: "Introduction au framework React",
            lessons: [
              {
                title: "Composants React",
                description: "Créer vos premiers composants",
                modalite: "presentiel",
              },
              {
                title: "State et Props",
                description: "Gestion de l'état des composants",
                modalite: "distanciel",
              },
              {
                title: "Hooks React",
                description: "Utiliser les hooks pour la logique métier",
                modalite: "presentiel",
              },
            ],
          },
        ],
      },
      {
        title: "Backend avec Node.js",
        description: "Développement côté serveur avec Node.js et Express",
        duration: 150,
        courses: [
          {
            title: "Node.js Fundamentals",
            description: "Les bases du développement backend",
            lessons: [
              {
                title: "Serveur HTTP avec Node.js",
                description: "Créer un serveur web simple",
                modalite: "presentiel",
              },
              {
                title: "Modules et NPM",
                description: "Gestion des dépendances",
                modalite: "distanciel",
              },
              {
                title: "File System et Streams",
                description: "Manipulation de fichiers",
                modalite: "presentiel",
              },
            ],
          },
          {
            title: "Express et APIs REST",
            description: "Création d'APIs robustes",
            lessons: [
              {
                title: "Routing avec Express",
                description: "Organiser les routes de votre API",
                modalite: "presentiel",
              },
              {
                title: "Middleware et sécurité",
                description: "Sécuriser vos APIs",
                modalite: "distanciel",
              },
              {
                title: "Tests d'APIs",
                description: "Tester vos endpoints",
                modalite: "presentiel",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    title: "Concepteur Développeur d'Applications",
    description:
      "Formation pour concevoir et développer des applications complexes",
    code: "CDA2024",
    level: "Bac+3/4",
    modules: [
      {
        title: "Architecture Logicielle",
        description: "Conception d'applications scalables",
        duration: 200,
        courses: [
          {
            title: "Design Patterns",
            description: "Les modèles de conception essentiels",
            lessons: [
              {
                title: "Singleton et Factory",
                description: "Patterns de création",
                modalite: "presentiel",
              },
              {
                title: "Observer et Strategy",
                description: "Patterns comportementaux",
                modalite: "distanciel",
              },
              {
                title: "MVC et MVVM",
                description: "Patterns architecturaux",
                modalite: "presentiel",
              },
            ],
          },
          {
            title: "Microservices",
            description: "Architecture en microservices",
            lessons: [
              {
                title: "Introduction aux microservices",
                description: "Concepts et avantages",
                modalite: "presentiel",
              },
              {
                title: "Communication inter-services",
                description: "APIs et messaging",
                modalite: "distanciel",
              },
              {
                title: "Déploiement et monitoring",
                description: "DevOps pour microservices",
                modalite: "presentiel",
              },
            ],
          },
        ],
      },
      {
        title: "Bases de Données Avancées",
        description: "Conception et optimisation de bases de données",
        duration: 160,
        courses: [
          {
            title: "Modélisation de données",
            description: "Conception de schémas optimaux",
            lessons: [
              {
                title: "Normalisation des données",
                description: "Formes normales et optimisation",
                modalite: "presentiel",
              },
              {
                title: "Relations complexes",
                description: "Modéliser des relations avancées",
                modalite: "distanciel",
              },
              {
                title: "Performance et indexation",
                description: "Optimiser les requêtes",
                modalite: "presentiel",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    title: "Artisan Boulanger-Pâtissier",
    description:
      "Formation complète aux métiers de la boulangerie et pâtisserie artisanale",
    code: "ABP2024",
    level: "CAP",
    modules: [
      {
        title: "Techniques de Base en Boulangerie",
        description: "Les fondamentaux du métier de boulanger",
        duration: 240,
        courses: [
          {
            title: "Pétrissage et Fermentation",
            description: "Maîtriser les techniques de base",
            lessons: [
              {
                title: "Types de farines et propriétés",
                description: "Connaître les différentes farines",
                modalite: "presentiel",
              },
              {
                title: "Techniques de pétrissage",
                description: "Méthodes manuelles et mécaniques",
                modalite: "presentiel",
              },
              {
                title: "Fermentation et levains",
                description: "Processus de fermentation",
                modalite: "presentiel",
              },
            ],
          },
          {
            title: "Façonnage et Cuisson",
            description: "Donner forme et cuire les produits",
            lessons: [
              {
                title: "Techniques de façonnage",
                description: "Façonner différents types de pains",
                modalite: "presentiel",
              },
              {
                title: "Maîtrise de la cuisson",
                description: "Température et temps de cuisson",
                modalite: "presentiel",
              },
              {
                title: "Finitions et dorure",
                description: "Parfaire l'aspect des produits",
                modalite: "presentiel",
              },
            ],
          },
        ],
      },
      {
        title: "Pâtisserie Artisanale",
        description: "L'art de la pâtisserie française",
        duration: 200,
        courses: [
          {
            title: "Pâtes de Base",
            description: "Maîtriser les pâtes fondamentales",
            lessons: [
              {
                title: "Pâte brisée et sablée",
                description: "Les pâtes pour tartes",
                modalite: "presentiel",
              },
              {
                title: "Pâte feuilletée",
                description: "Technique du feuilletage",
                modalite: "presentiel",
              },
              {
                title: "Pâte à choux",
                description: "Éclairs et profiteroles",
                modalite: "presentiel",
              },
            ],
          },
          {
            title: "Crèmes et Garnitures",
            description: "Préparer les garnitures classiques",
            lessons: [
              {
                title: "Crème pâtissière et variations",
                description: "La base des garnitures",
                modalite: "presentiel",
              },
              {
                title: "Ganaches et mousses",
                description: "Textures modernes",
                modalite: "presentiel",
              },
              {
                title: "Fruits et confitures",
                description: "Travailler les fruits",
                modalite: "presentiel",
              },
            ],
          },
        ],
      },
      {
        title: "Hygiène et Sécurité Alimentaire",
        description: "Respecter les normes d'hygiène",
        duration: 80,
        courses: [
          {
            title: "HACCP en Boulangerie",
            description: "Méthode HACCP appliquée",
            lessons: [
              {
                title: "Analyse des dangers",
                description: "Identifier les risques",
                modalite: "presentiel",
              },
              {
                title: "Points critiques",
                description: "Maîtriser les points de contrôle",
                modalite: "distanciel",
              },
              {
                title: "Traçabilité",
                description: "Documenter les processus",
                modalite: "presentiel",
              },
            ],
          },
        ],
      },
    ],
  },
];

const groupsData = [
  {
    name: "Promo Dev Web 2024-A",
    desc: "Groupe de développeurs web promotion automne 2024",
    isActive: true,
  },
  {
    name: "Promo Dev Web 2024-B",
    desc: "Groupe de développeurs web promotion hiver 2024",
    isActive: true,
  },
  {
    name: "CDA Advanced 2024",
    desc: "Concepteurs développeurs d'applications niveau avancé",
    isActive: true,
  },
  {
    name: "Boulangers Artisans 2024",
    desc: "Formation boulangerie artisanale promotion 2024",
    isActive: true,
  },
  {
    name: "Pâtissiers Créatifs 2024",
    desc: "Spécialisation pâtisserie créative",
    isActive: false,
  },
];

const skillsData = [
  { description: "Maîtrise du HTML sémantique", badge: "html-expert" },
  { description: "Expertise CSS et Responsive Design", badge: "css-master" },
  { description: "Développement JavaScript avancé", badge: "js-ninja" },
  { description: "Architecture React complexe", badge: "react-architect" },
  { description: "API REST et GraphQL", badge: "api-designer" },
  { description: "Bases de données relationnelles", badge: "db-expert" },
  { description: "DevOps et CI/CD", badge: "devops-engineer" },
  { description: "Sécurité applicative", badge: "security-expert" },
  { description: "Techniques de pétrissage", badge: "kneading-master" },
  { description: "Maîtrise de la fermentation", badge: "fermentation-expert" },
  { description: "Art du façonnage", badge: "shaping-artist" },
  { description: "Cuisson parfaite", badge: "baking-master" },
  { description: "Créativité pâtissière", badge: "pastry-creative" },
  { description: "Respect des normes HACCP", badge: "haccp-certified" },
];

const objectivesData = [
  {
    descriptions: [
      "Créer des sites web responsives et accessibles",
      "Développer des applications web interactives",
      "Maîtriser les frameworks modernes",
      "Implémenter des APIs sécurisées",
    ],
  },
  {
    descriptions: [
      "Concevoir des architectures logicielles robustes",
      "Implémenter des patterns de conception",
      "Optimiser les performances applicatives",
      "Gérer des projets de développement complexes",
    ],
  },
  {
    descriptions: [
      "Maîtriser les techniques traditionnelles de boulangerie",
      "Créer des produits de pâtisserie innovants",
      "Respecter les normes d'hygiène alimentaire",
      "Gérer un atelier de production artisanale",
    ],
  },
];

// =================== FONCTIONS UTILITAIRES ===================

function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createMail(
  firstname: string,
  lastname: string,
  index: number
): string {
  return `${firstname.toLowerCase()}.${lastname.toLowerCase()}${index}@${
    domains[getRandomNumber(0, domains.length - 1)]
  }`;
}

function getRandomDate(daysAgo: number = 30): Date {
  const now = new Date();
  const randomDays = Math.floor(Math.random() * daysAgo);
  return new Date(now.getTime() - randomDays * 24 * 60 * 60 * 1000);
}

function createConnectionInfos() {
  const dates = [];
  for (let i = 14; i >= 1; i--) {
    const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    const duration = getRandomNumber(1 * 3600, 8 * 3600) * 1000; // 1-8 heures en millisecondes
    dates.push({ date: date.toString(), duration });
  }
  return dates;
}

let tagsColors: string[] = [];

function setTagsColors() {
  let leftColors = [...colors];
  for (let i = 0; i < tags.length; i++) {
    if (leftColors.length === 0) {
      leftColors = [...colors];
    }
    const randomIndex = getRandomNumber(0, leftColors.length - 1);
    tagsColors.push(leftColors[randomIndex]);
    leftColors = leftColors.filter((_, index) => index !== randomIndex);
  }
}

// =================== CRÉATION DES DONNÉES MONGODB ===================

async function dropMongoDatabase() {
  await mongoose.connection.dropDatabase();
  console.log("MongoDB Database dropped!");
}

async function createMongoRoles() {
  const interfaceRoles = [
    {
      role: "interface:admin",
      label: "interface de l'admin",
      rank: 1,
      protection: 2,
    },
    {
      role: "interface:teacher",
      label: "interface du formateur",
      rank: 2,
      protection: 2,
    },
    {
      role: "interface:student",
      label: "interface de l'apprenant",
      rank: 3,
      protection: 2,
    },
  ];

  const actionsRoles = [
    { role: "admin", label: "administrateur", rank: 1, protection: 2 },
    { role: "teacher", label: "équipe pédagogique", rank: 2, protection: 1 },
    { role: "student", label: "apprenant", rank: 3, protection: 1 },
  ];

  const dbRoles: any[] = [];
  [...interfaceRoles, ...actionsRoles].forEach((role) => {
    dbRoles.push(new Role(role));
  });
  await Role.bulkSave(dbRoles);
  console.log("MongoDB Roles created");
}

async function createMongoPermissions() {
  const bulkPermissions = new Map<string, any>();
  const bulkRoleUpdates = new Map<string, any>();

  for (const [roleName, value] of Object.entries({
    ...permDefsInterface,
    ...permDefsActions,
  })) {
    const role = await Role.findOne({ role: roleName });
    if (!role) continue;

    const rolePermissions = [];

    for (const [action, ressources] of Object.entries(value)) {
      for (const res of ressources) {
        const permissionName = `${action}:${res}`;

        if (!bulkPermissions.has(permissionName)) {
          const existingPermission = await Permission.findOne({
            name: permissionName,
          });
          if (existingPermission) {
            existingPermission.roles = [role];
            bulkPermissions.set(permissionName, existingPermission);
            rolePermissions.push(existingPermission._id);
          } else {
            const newPermission = new Permission({
              roles: [role],
              name: permissionName,
            });
            bulkPermissions.set(permissionName, newPermission);
            rolePermissions.push(newPermission._id);
          }
        } else {
          const permission = bulkPermissions.get(permissionName)!;
          permission.roles = [...permission.roles, role];
          rolePermissions.push(permission._id);
        }
      }
    }

    bulkRoleUpdates.set(role._id.toString(), {
      updateOne: {
        filter: { _id: role._id },
        update: { $set: { permissions: rolePermissions } },
      },
    });
  }

  await Permission.bulkSave(Array.from(bulkPermissions.values()));
  await Role.bulkWrite(Array.from(bulkRoleUpdates.values()));
  console.log("MongoDB Permissions created");
}

async function createMongoTags() {
  setTagsColors();
  const tagList: any[] = [];
  tags.forEach((tag, index) => {
    const newTag = new Tag({ name: tag, color: tagsColors[index] });
    tagList.push(newTag);
  });
  await Tag.bulkSave(tagList);
  console.log("MongoDB Tags created");
}

async function createMongoGroups() {
  const roleStudent = await Role.findOne({ role: "student" });
  if (!roleStudent) throw new Error("Student role not found");

  const groups: any[] = [];
  groupsData.forEach((groupData) => {
    const newGroup = new Group({
      ...groupData,
      roles: [roleStudent._id],
    });
    groups.push(newGroup);
  });
  await Group.bulkSave(groups);
  console.log("MongoDB Groups created");
}

async function createMongoUsers() {
  const hash = await bcrypt.hash("Abcdef@123456", 10);

  // Récupération des rôles
  const [
    roleAdmin,
    roleInterfaceAdmin,
    roleTeacher,
    roleInterfaceTeacher,
    roleStudent,
    roleInterfaceStudent,
  ] = await Promise.all([
    Role.findOne({ role: "admin" }),
    Role.findOne({ role: "interface:admin" }),
    Role.findOne({ role: "teacher" }),
    Role.findOne({ role: "interface:teacher" }),
    Role.findOne({ role: "student" }),
    Role.findOne({ role: "interface:student" }),
  ]);

  const groups = await Group.find();

  const users: any[] = [];

  // Administrateur principal
  const mainAdmin = new User({
    firstname: "jacques",
    lastname: "durand",
    address: "12 place royale",
    postCode: "64000",
    city: "pau",
    email: "admin@studio.eco",
    phoneNumber: "06 06 06 06 06",
    nickname: "studio",
    password: hash,
    roles: [roleAdmin!._id, roleInterfaceAdmin!._id],
    isActive: true,
    emailVerified: true,
    invitationSent: true,
  });
  users.push(mainAdmin);

  // Formateurs
  const teachers = [
    {
      firstname: "marie",
      lastname: "martin",
      email: "marie.martin@studio.eco",
      specialty: "web",
    },
    {
      firstname: "pierre",
      lastname: "dubois",
      email: "pierre.dubois@studio.eco",
      specialty: "backend",
    },
    {
      firstname: "sophie",
      lastname: "bernard",
      email: "sophie.bernard@studio.eco",
      specialty: "frontend",
    },
    {
      firstname: "jean",
      lastname: "moreau",
      email: "jean.moreau@studio.eco",
      specialty: "boulangerie",
    },
    {
      firstname: "claire",
      lastname: "petit",
      email: "claire.petit@studio.eco",
      specialty: "patisserie",
    },
  ];

  teachers.forEach((teacher, index) => {
    const city = cities[index % cities.length];
    const newTeacher = new User({
      firstname: teacher.firstname,
      lastname: teacher.lastname,
      address: addresses[index % addresses.length],
      postCode: city.postcode,
      city: city.name,
      email: teacher.email,
      phoneNumber: "06 06 06 06 06",
      password: hash,
      roles: [roleTeacher!._id, roleInterfaceTeacher!._id],
      isActive: true,
      emailVerified: true,
      invitationSent: true,
    });
    users.push(newTeacher);
  });

  // Étudiants
  for (let i = 0; i < 30; i++) {
    const firstname = firstnames[i % firstnames.length];
    const lastname = lastnames[i % lastnames.length];
    const city = cities[i % cities.length];
    const group = groups[i % groups.length];

    const newStudent = new User({
      firstname: firstname.toLowerCase(),
      lastname: lastname.toLowerCase(),
      email: createMail(firstname, lastname, i + 1),
      password: hash,
      address: addresses[i % addresses.length],
      postCode: city.postcode,
      city: city.name,
      phoneNumber: "06 06 06 06 06",
      roles: [roleStudent!._id, roleInterfaceStudent!._id],
      group: group._id,
      isActive: true,
      emailVerified: true,
      invitationSent: true,
    });
    users.push(newStudent);
  }

  await User.bulkSave(users);
  console.log("MongoDB Users created");

  // Créer les informations de connexion pour quelques étudiants
  const students = await User.find({
    roles: { $in: [roleStudent!._id] },
  }).limit(10);
  for (const student of students) {
    const connectionDates = createConnectionInfos();
    const infos: any[] = [];
    connectionDates.forEach((date) => {
      infos.push(
        new ConnectionInfos({
          userId: student._id,
          lastConnection: date.date,
          duration: date.duration,
        })
      );
    });
    const savedInfos = await ConnectionInfos.insertMany(infos);
    const infosIds = savedInfos.map((info) => info._id);
    await User.findOneAndUpdate(
      { _id: student._id },
      { connectionInfos: infosIds }
    );
  }

  // Associer les utilisateurs aux groupes
  for (const group of groups) {
    const groupUsers = await User.find({ group: group._id });
    const userIds = groupUsers.map((user) => user._id);
    await Group.findOneAndUpdate({ _id: group._id }, { users: userIds });
  }
}

// =================== CRÉATION DES DONNÉES POSTGRESQL ===================

async function createPostgreSQLTags() {
  const tagList: any[] = [];
  setTagsColors();
  tags.forEach((tag, index) => {
    tagList.push({ name: tag, color: tagsColors[index] });
  });
  await prisma.tag.createMany({
    data: tagList,
    skipDuplicates: true,
  });
  console.log("PostgreSQL Tags created");
}

async function createPostgreSQLAdmins() {
  const roleAdmin = await Role.findOne({ role: "admin" });
  const adminUsers = await User.find({ roles: { $in: [roleAdmin!._id] } });

  const adminsData = adminUsers.map((user) => ({ idMdb: user._id.toString() }));
  await prisma.admin.createMany({
    data: adminsData,
    skipDuplicates: true,
  });
  console.log("PostgreSQL Admins created");
}

async function createPostgreSQLTeachers() {
  const roleTeacher = await Role.findOne({ role: "teacher" });
  const teacherUsers = await User.find({ roles: { $in: [roleTeacher!._id] } });

  const teachersData = teacherUsers.map((user) => ({
    idMdb: user._id.toString(),
  }));
  await prisma.teacher.createMany({
    data: teachersData,
    skipDuplicates: true,
  });
  console.log("PostgreSQL Teachers created");
}

async function createPostgreSQLStudents() {
  const roleStudent = await Role.findOne({ role: "student" });
  const studentUsers = await User.find({ roles: { $in: [roleStudent!._id] } });

  const studentsData = studentUsers.map((user) => ({
    idMdb: user._id.toString(),
  }));
  await prisma.student.createMany({
    data: studentsData,
    skipDuplicates: true,
  });
  console.log("PostgreSQL Students created");
}

async function createPostgreSQLGroups() {
  const mongoGroups = await Group.find();
  const groupsData = mongoGroups.map((group) => ({
    idMdb: group._id.toString(),
  }));
  await prisma.group.createMany({
    data: groupsData,
    skipDuplicates: true,
  });
  console.log("PostgreSQL Groups created");
}

async function createPostgreSQLContacts() {
  const roleTeacher = await Role.findOne({ role: "teacher" });
  const teacherUsers = await User.find(
    { roles: { $in: [roleTeacher!._id] } },
    { _id: 1, firstname: 1, lastname: 1, phoneNumber: 1, email: 1 }
  );

  const contacts = teacherUsers.map((user) => ({
    idMdb: user._id.toString(),
    role: "formateur",
    name: `${user.firstname} ${user.lastname}`,
    email: user.email,
    phone: user.phoneNumber || "Non renseigné",
  }));

  await prisma.contact.createMany({
    data: contacts,
    skipDuplicates: true,
  });
  console.log("PostgreSQL Contacts created");
}

async function createPostgreSQLSkills() {
  await prisma.skill.createMany({
    data: skillsData,
    skipDuplicates: true,
  });
  console.log("PostgreSQL Skills created");
}

async function createPostgreSQLFormationsAndContent() {
  const adminId = 1; // Premier admin créé
  const tags = await prisma.tag.findMany();
  const skills = await prisma.skill.findMany();
  const contacts = await prisma.contact.findMany();
  const groups = await prisma.group.findMany();

  for (
    let formationIndex = 0;
    formationIndex < formations.length;
    formationIndex++
  ) {
    const formationData = formations[formationIndex];

    // Sélection des tags selon la formation
    let selectedTags: any[] = [];
    if (formationIndex === 0) {
      // Dev Web
      selectedTags = tags.filter((tag) =>
        [
          "HTML",
          "CSS",
          "JavaScript",
          "TypeScript",
          "React",
          "Node.js",
          "Express",
        ].includes(tag.name)
      );
    } else if (formationIndex === 1) {
      // CDA
      selectedTags = tags.filter((tag) =>
        [
          "Java",
          "Spring",
          "C#",
          "Python",
          "GraphQL",
          "REST API",
          "PostgreSQL",
        ].includes(tag.name)
      );
    } else {
      // Boulangerie
      selectedTags = tags.filter((tag) =>
        [
          "Boulangerie",
          "Patisserie",
          "Fermentation",
          "Artisanale",
          "Hygiène",
        ].includes(tag.name)
      );
    }

    // Création de la formation
    const formation = await prisma.formation.create({
      data: {
        title: formationData.title,
        description: formationData.description,
        code: formationData.code,
        level: formationData.level,
        adminId: adminId,
        tags: {
          create: selectedTags.map((tag) => ({
            tag: { connect: { id: tag.id } },
          })),
        },
      },
    });

    // Création des compétences spécifiques à cette formation
    const formationSkills = skills.filter((_, index) => {
      if (formationIndex === 0) return index < 8; // Dev Web
      if (formationIndex === 1) return index >= 4 && index < 10; // CDA
      return index >= 8; // Boulangerie
    });

    // Création du parcours
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 7); // Dans 7 jours
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 6); // 6 mois plus tard

    const parcours = await prisma.parcours.create({
      data: {
        title: `Parcours ${formationData.title} 2024`,
        description: `Parcours complet de formation ${formationData.title}`,
        startDate: startDate,
        endDate: endDate,
        degree: formationData.level,
        author: "jacques durand",
        visibility: true,
        isPublished: true,
        adminId: adminId,
        formationId: formation.id,
        virtualClass: `https://meet.google.com/parcours-${formation.id}`,
        skills: {
          create: formationSkills.map((skill) => ({
            skill: { connect: { id: skill.id } },
          })),
        },
        contacts: {
          create: contacts.slice(0, 3).map((contact) => ({
            contact: { connect: { id: contact.id } },
          })),
        },
        groups: {
          create: groups
            .slice(formationIndex, formationIndex + 2)
            .map((group) => ({
              group: { connect: { id: group.id } },
            })),
        },
        tags: {
          create: selectedTags.slice(0, 5).map((tag) => ({
            tag: { connect: { id: tag.id } },
          })),
        },
      },
    });

    // Création des objectifs
    const objectives = objectivesData[formationIndex];
    for (const description of objectives.descriptions) {
      await prisma.objective.create({
        data: {
          description,
          parcoursId: parcours.id,
        },
      });
    }

    // Création des modules avec leurs cours et leçons
    for (
      let moduleIndex = 0;
      moduleIndex < formationData.modules.length;
      moduleIndex++
    ) {
      const moduleData = formationData.modules[moduleIndex];

      const module = await prisma.module.create({
        data: {
          title: moduleData.title,
          description: moduleData.description,
          duration: moduleData.duration,
          author: "jacques durand",
          adminId: adminId,
          minDate: new Date(
            startDate.getTime() + moduleIndex * 30 * 24 * 60 * 60 * 1000
          ),
          maxDate: new Date(
            startDate.getTime() + (moduleIndex + 1) * 30 * 24 * 60 * 60 * 1000
          ),
          parcours: {
            create: [
              {
                parcours: { connect: { id: parcours.id } },
              },
            ],
          },
          contacts: {
            create: contacts.slice(0, 2).map((contact) => ({
              contact: { connect: { id: contact.id } },
            })),
          },
        },
      });

      // Création des compétences bonus pour le module
      const bonusSkills = await prisma.bonusSkill.createMany({
        data: [
          {
            description: `Compétence bonus ${moduleData.title} - Niveau 1`,
            parcoursId: parcours.id,
          },
          {
            description: `Compétence bonus ${moduleData.title} - Niveau 2`,
            parcoursId: parcours.id,
          },
        ],
      });

      // Associer les compétences bonus au module
      const createdBonusSkills = await prisma.bonusSkill.findMany({
        where: { description: { contains: moduleData.title } },
      });

      for (const bonusSkill of createdBonusSkills) {
        await prisma.bonusSkillsOnModule.create({
          data: {
            bonusSkillId: bonusSkill.id,
            moduleId: module.id,
          },
        });
      }

      // Création des cours
      for (
        let courseIndex = 0;
        courseIndex < moduleData.courses.length;
        courseIndex++
      ) {
        const courseData = moduleData.courses[courseIndex];

        const course = await prisma.course.create({
          data: {
            title: courseData.title,
            description: courseData.description,
            moduleId: module.id,
            order: courseIndex,
            adminId: adminId,
            author: "jacques durand",
            visibility: true,
            isPublished: true,
            scenario: true,
            dates: [
              { date: new Date().toISOString(), type: "start" },
              {
                date: new Date(
                  Date.now() + 7 * 24 * 60 * 60 * 1000
                ).toISOString(),
                type: "end",
              },
            ],
            contacts: {
              create: contacts.slice(0, 1).map((contact) => ({
                contact: { connect: { id: contact.id } },
              })),
            },
            tags: {
              create: selectedTags.slice(0, 3).map((tag) => ({
                tag: { connect: { id: tag.id } },
              })),
            },
          },
        });

        // Associer les objectifs au cours
        const courseObjectives = await prisma.objective.findMany({
          where: { parcoursId: parcours.id },
        });

        for (const objective of courseObjectives.slice(0, 2)) {
          await prisma.objectivesOnCourse.create({
            data: {
              objectiveId: objective.id,
              courseId: course.id,
            },
          });
        }

        // Associer les compétences bonus au cours
        for (const bonusSkill of createdBonusSkills) {
          await prisma.bonusSkillOnCourse.create({
            data: {
              bonusSkillId: bonusSkill.id,
              courseId: course.id,
            },
          });
        }

        // Création des leçons
        for (
          let lessonIndex = 0;
          lessonIndex < courseData.lessons.length;
          lessonIndex++
        ) {
          const lessonData = courseData.lessons[lessonIndex];
          const lessonTag = selectedTags[lessonIndex % selectedTags.length];

          const lesson = await prisma.lesson.create({
            data: {
              title: lessonData.title,
              description: lessonData.description,
              modalite: lessonData.modalite,
              order: lessonIndex,
              adminId: adminId,
              courseId: course.id,
              tagId: lessonTag.id,
              author: "jacques durand",
              isPublished: true,
              visibility: true,
            },
          });

          // Création des activités pour chaque leçon
          const activities = [
            {
              title: `Ressources ${lessonData.title}`,
              description: `Documents et liens utiles pour ${lessonData.title}`,
              type: "resource",
              url: `/resources/${lesson.id}`,
              order: 0,
            },
          ];

          for (const activityData of activities) {
            const activity = await prisma.activity.create({
              data: {
                ...activityData,
                lessonId: lesson.id,
                authorId: adminId,
              },
            });

            // Création des ressources d'activité
            await prisma.resourceActivity.createMany({
              data: [
                {
                  label: `Ressource principale - ${activityData.title}`,
                  order: 0,
                  url: `${activityData.url}/main`,
                  activityId: activity.id,
                },
                {
                  label: `Ressource complémentaire - ${activityData.title}`,
                  order: 1,
                  url: `${activityData.url}/complement`,
                  activityId: activity.id,
                },
              ],
            });
          }
        }
      }
    }

    console.log(
      `Formation "${formationData.title}" created with all related content`
    );
  }
}

async function createStudentProgress() {
  const students = await prisma.student.findMany();
  const lessons = await prisma.lesson.findMany();
  const courses = await prisma.course.findMany();

  // Créer des lectures de leçons pour simuler la progression
  for (let i = 0; i < Math.min(students.length, 15); i++) {
    const student = students[i];
    const studentLessons = lessons.slice(0, getRandomNumber(5, lessons.length));

    for (const lesson of studentLessons) {
      const beganAt = getRandomDate(30);
      const finishedAt =
        Math.random() > 0.3
          ? new Date(beganAt.getTime() + getRandomNumber(15, 120) * 60 * 1000)
          : null;

      await prisma.lessonRead.create({
        data: {
          beganAt,
          lastOpenedAt: finishedAt || new Date(),
          finishedAt,
          lessonId: lesson.id,
          studentId: student.id,
        },
      });

      // Noter quelques leçons
      if (finishedAt && Math.random() > 0.5) {
        await prisma.lessonRating.create({
          data: {
            rating: getRandomNumber(3, 5),
            lessonId: lesson.id,
            studentId: student.id,
          },
        });
      }
    }

    // Créer des accomplissements
    const studentCourses = courses.slice(0, getRandomNumber(2, 5));
    for (const course of studentCourses) {
      if (Math.random() > 0.6) {
        await prisma.accomplishment.create({
          data: {
            name: `Réussite du cours ${course.title}`,
            description: `L'étudiant a terminé avec succès le cours ${course.title}`,
            accomplishedAt: getRandomDate(15),
            hasBeenCongratulated: Math.random() > 0.5,
            showToOtherStudent: Math.random() > 0.7,
            studentId: student.id,
            courseId: course.id,
          },
        });
      }
    }
  }

  console.log("Student progress data created");
}

async function createMediatheque() {
  const admins = await prisma.admin.findMany();

  const mediaTypes = ["image", "video", "audio", "document", "presentation"];
  const mediaFiles = [
    {
      name: "Introduction au HTML.pdf",
      type: "document",
      size: 2048576,
      url: "/media/intro-html.pdf",
    },
    {
      name: "CSS Grid Tutorial.mp4",
      type: "video",
      size: 15728640,
      url: "/media/css-grid-tutorial.mp4",
    },
    {
      name: "JavaScript Best Practices.pptx",
      type: "presentation",
      size: 5242880,
      url: "/media/js-best-practices.pptx",
    },
    {
      name: "React Component Lifecycle.png",
      type: "image",
      size: 1048576,
      url: "/media/react-lifecycle.png",
    },
    {
      name: "Node.js Architecture.pdf",
      type: "document",
      size: 3145728,
      url: "/media/nodejs-arch.pdf",
    },
    {
      name: "Database Design Principles.mp4",
      type: "video",
      size: 20971520,
      url: "/media/db-design.mp4",
    },
    {
      name: "API Security Guidelines.pdf",
      type: "document",
      size: 1572864,
      url: "/media/api-security.pdf",
    },
    {
      name: "Fermentation Process.mp4",
      type: "video",
      size: 12582912,
      url: "/media/fermentation.mp4",
    },
    {
      name: "Bread Shaping Techniques.pdf",
      type: "document",
      size: 4194304,
      url: "/media/bread-shaping.pdf",
    },
    {
      name: "Pastry Basics.mp3",
      type: "audio",
      size: 8388608,
      url: "/media/pastry-basics.mp3",
    },
  ];

  const mediaData = mediaFiles.map((file, index) => ({
    type: file.type,
    url: file.url,
    name: file.name,
    authorId: admins[index % admins.length].id,
    size: file.size,
    used: getRandomNumber(0, 50),
  }));

  await prisma.mediatheque.createMany({
    data: mediaData,
  });

  console.log("Mediatheque created");
}

// =================== FONCTION PRINCIPALE ===================

async function loadFixtures() {
  try {
    console.log("🚀 Starting fixtures creation...");

    // Connexion à MongoDB
    await mongoConnect();

    // Nettoyage optionnel des bases (décommentez si nécessaire)
    // await dropMongoDatabase();
    // await prisma.$executeRaw`TRUNCATE TABLE "Tag", "Admin", "Teacher", "Student", "Group", "Contact", "Formation", "Parcours", "Module", "Course", "Lesson", "Activity", "ResourceActivity", "Accomplishment", "LessonRead", "LessonRating", "Skill", "BonusSkill", "Objective", "Mediatheque" RESTART IDENTITY CASCADE;`;

    console.log("📊 Creating MongoDB data...");
    await createMongoRoles();
    await createMongoPermissions();
    await createMongoTags();
    await createMongoGroups();
    await createMongoUsers();

    console.log("🗄️ Creating PostgreSQL data...");
    await createPostgreSQLTags();
    await createPostgreSQLAdmins();
    await createPostgreSQLTeachers();
    await createPostgreSQLStudents();
    await createPostgreSQLGroups();
    await createPostgreSQLContacts();
    await createPostgreSQLSkills();

    console.log(
      "📚 Creating formations, parcours, modules, courses and lessons..."
    );
    await createPostgreSQLFormationsAndContent();

    console.log("📈 Creating student progress data...");
    await createStudentProgress();

    console.log("📁 Creating mediatheque...");
    await createMediatheque();

    console.log("✅ All fixtures created successfully!");
  } catch (error) {
    console.error("❌ Error creating fixtures:", error);
  } finally {
    await disconnect();
  }
}

// Vérification de l'environnement
if (!MONGO_URL) {
  console.error("❌ MONGO_LOCAL_URL environment variable is not set");
  process.exit(1);
}

// Exécution
loadFixtures();
