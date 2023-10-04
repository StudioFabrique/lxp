const permDefs = {
  admin: {
    read: [
      "admin",
      "mini-admin",
      "teacher",
      "student",
      "coach",
      "boss_teacher",
      "stagiaire",
      "everything",
      "permission",
      "user",
      "parcours",
      "module",
      "cours",
    ],
    write: [
      "teacher",
      "student",
      "coach",
      "boss_teacher",
      "stagiaire",
      "permission",
      "user",
      "parcours",
      "module",
      "cours",
    ],
    update: [
      "teacher",
      "student",
      "coach",
      "boss_teacher",
      "stagiaire",
      "permission",
      "user",
      "parcours",
      "module",
      "cours",
    ],
    delete: [
      "teacher",
      "student",
      "coach",
      "boss_teacher",
      "stagiaire",
      "permission",
      "user",
      "parcours",
      "module",
      "cours",
    ],
  },
  teacher: {
    read: [
      "teacher",
      "boss_teacher",
      "student",
      "coach",
      "stagiaire",
      "everything",
      "permission",
      "user",
    ],
    update: ["student", "coach", "stagiaire"],
  },
  student: {
    read: ["parcours", "permission"],
  },
  boss_teacher: {
    read: [
      "teacher",
      "student",
      "coach",
      "stagiaire",
      "everything",
      "permission",
      "user",
    ],
    update: ["student", "coach", "stagiaire"],
  },
};
