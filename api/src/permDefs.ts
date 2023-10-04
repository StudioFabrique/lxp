const permDefs = {
  admin: {
    read: [
      // roles
      "admin",
      "mini-admin",
      "teacher",
      "student",
      "coach",
      "boss_teacher",
      "stagiaire",
      "everything",
      // ressources
      "tag",
      "permission",
      "user",
      "group",
      "formation",
      "parcours",
      "module",
      "cours",
    ],
    write: [
      // roles
      "teacher",
      "student",
      "coach",
      "boss_teacher",
      "stagiaire",
      // ressources
      "tag",
      "permission",
      "user",
      "group",
      "formation",
      "parcours",
      "module",
      "cours",
    ],
    update: [
      // roles
      "teacher",
      "student",
      "coach",
      "boss_teacher",
      "stagiaire",
      // ressources
      "tag",
      "permission",
      "user",
      "group",
      "formation",
      "parcours",
      "module",
      "cours",
    ],
    delete: [
      // roles
      "teacher",
      "student",
      "coach",
      "boss_teacher",
      "stagiaire",
      // ressources
      "tag",
      "permission",
      "user",
      "group",
      "formation",
      "parcours",
      "module",
      "cours",
    ],
  },
  teacher: {
    read: [
      // roles
      "teacher",
      "boss_teacher",
      "student",
      "coach",
      "stagiaire",
      "everything",
      // ressources
      "permission",
      "user",
    ],
    update: [
      // roles
      "student",
      "coach",
      "stagiaire",
      // ressources
    ],
  },
  student: {
    read: [
      // roles

      // ressources
      "parcours",
      "permission",
    ],
  },
  boss_teacher: {
    read: [
      // roles
      "teacher",
      "student",
      "coach",
      "stagiaire",
      "everything",
      // ressources
      "permission",
      "user",
    ],
    update: [
      // roles
      "student",
      "coach",
      "stagiaire",
      // ressources
    ],
  },
  stagiaire: {
    read: [
      // roles

      // ressources
      "parcours",
      "permission",
    ],
  },
};

export default permDefs;
