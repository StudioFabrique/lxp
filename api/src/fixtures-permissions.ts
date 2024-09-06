const permDefs = {
  admin: {
    read: [
      "role",
      "tag",
      "permission",
      "user",
      "group",
      "formation",
      "parcours",
      "module",
      "course",
      "bonusSkill",
      "lesson",
      "default",
      "everything",
      "admin",
      "miniAdmin",
      "teacher",
      "bossTeacher",
      "student",
      "coach",
      "stagiaire",
    ],
    write: [
      "role",
      "tag",
      "permission",
      "user",
      "group",
      "formation",
      "parcours",
      "module",
      "course",
      "bonusSkill",
      "lesson",
      "default",
      "everything",
      "admin",
      "miniAdmin",
      "teacher",
      "bossTeacher",
      "student",
      "coach",
      "stagiaire",
    ],
    update: [
      "role",
      "tag",
      "permission",
      "user",
      "group",
      "objective",
      "formation",
      "parcours",
      "module",
      "course",
      "bonusSkill",
      "lesson",
      "default",
      "everything",
      "admin",
      "miniAdmin",
      "teacher",
      "bossTeacher",
      "student",
      "coach",
      "stagiaire",
    ],
    delete: [
      "role",
      "tag",
      "permission",
      "user",
      "group",
      "formation",
      "parcours",
      "objective",
      "module",
      "course",
      "bonusSkill",
      "lesson",
      "default",
      "everything",
      "admin",
      "miniAdmin",
      "teacher",
      "bossTeacher",
      "student",
      "coach",
      "stagiaire",
    ],
  },
  miniAdmin: {
    read: [],
    write: [],
    update: [],
    delete: [],
  },
  teacher: {
    read: [
      "role",
      "tag",
      "permission",
      "user",
      "group",
      "formation",
      "parcours",
      "module",
      "course",
      "bonusSkill",
      "lesson",
      "default",
      "everything",
      "admin",
      "miniAdmin",
      "teacher",
      "bossTeacher",
      "student",
      "coach",
      "stagiaire",
    ],
    write: [
      "role",
      "tag",
      "permission",
      "user",
      "group",
      "formation",
      "parcours",
      "module",
      "course",
      "bonusSkill",
      "lesson",
      "default",
      "everything",
      "admin",
      "miniAdmin",
      "teacher",
      "bossTeacher",
      "student",
      "coach",
      "stagiaire",
    ],
    update: [
      "role",
      "tag",
      "permission",
      "user",
      "group",
      "formation",
      "parcours",
      "module",
      "course",
      "bonusSkill",
      "lesson",
      "default",
      "everything",
      "admin",
      "miniAdmin",
      "teacher",
      "bossTeacher",
      "student",
      "coach",
      "stagiaire",
    ],
    delete: [
      "role",
      "tag",
      "permission",
      "user",
      "group",
      "formation",
      "parcours",
      "module",
      "course",
      "bonusSkill",
      "lesson",
      "default",
      "everything",
      "admin",
      "miniAdmin",
      "teacher",
      "bossTeacher",
      "student",
      "coach",
      "stagiaire",
    ],
  },
  student: {
    read: [
      "tag",
      "user",
      "group",
      "formation",
      "parcours",
      "module",
      "course",
      "bonusSkill",
      "lesson",
      "cursus",
      "default",
    ],
    write: ["default"],
    update: ["default"],
    delete: [],
  },
  bossTeacher: {
    read: [],
    write: [],
    update: [],
    delete: [],
  },
  stagiaire: {
    read: [],
    write: [],
    update: [],
    delete: [],
  },
  coach: {
    read: [],
    write: [],
    update: [],
    delete: [],
  },
};

export default permDefs;
