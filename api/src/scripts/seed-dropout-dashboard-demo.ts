import { randomUUID } from "node:crypto";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { env } from "../config/env.ts";
import { prisma } from "../utils/db.ts";
import User from "../utils/interfaces/db/user.ts";
import Role from "../utils/interfaces/db/role.ts";
import Group from "../utils/interfaces/db/group.ts";
import { DropoutPrediction, DropoutWeek } from "../services/dropout-analysis.ts";

// Données locales de démonstration, identifiées par leur adresse et leur clé.
const students = [
  { firstname: "Lina", lastname: "Moreau", critical: true, description: "Souhaite progresser en développement web ; a besoin d'un accompagnement régulier." },
  { firstname: "Adam", lastname: "Petit", critical: true, description: "Apprend le développement web et rencontre des difficultés sur les exercices récents." },
  { firstname: "Inès", lastname: "Bernard", critical: false, description: "Progresse régulièrement dans son parcours de développement web." },
  { firstname: "Noah", lastname: "Laurent", critical: false, description: "Participe aux activités et consolide ses acquis." },
] as const;
const demoIndicators = [
  { pass_rate: 0.28, monthly_connection_days: 4, days_since_last_activity: 22 },
  { pass_rate: 0.42, monthly_connection_days: 7, days_since_last_activity: 15 },
  { pass_rate: 0.86, monthly_connection_days: 23, days_since_last_activity: 1 },
  { pass_rate: 0.72, monthly_connection_days: 18, days_since_last_activity: 3 },
] as const;

async function main() {
  if (env.ENVIRONMENT !== "development") throw new Error("Ce script est réservé à la base de développement.");
  await mongoose.connect(env.MONGO_LOCAL_URL);
  try {
    const teacher = await User.findOne({ email: "formateur@studio.eco" });
    const teacherRole = await Role.findOne({ role: "teacher", rank: 2 });
    const studentRole = await Role.findOne({ role: "student", rank: 3 });
    if (!teacher || !teacherRole || !studentRole || !teacher.roles.some((id) => String(id) === String(teacherRole._id))) {
      throw new Error("Le compte formateur local et les rôles teacher/student sont requis.");
    }

    const teacherId = String(teacher._id);
    let admin = await prisma.orm.public.Admin.where({ idMdb: teacherId }).first();
    if (!admin) admin = await prisma.orm.public.Admin.create({ idMdb: teacherId });
    let contact = await prisma.orm.public.Contact.where({ idMdb: teacherId }).first();
    if (!contact) contact = await prisma.orm.public.Contact.create({ idMdb: teacherId, role: teacherRole.label, phone: "Non Renseigné", email: teacher.email });

    const learnerIds: string[] = [];
    for (const student of students) {
      const email = `${student.firstname.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}.${student.lastname.toLowerCase()}@example.test`;
      let user = await User.findOne({ email });
      if (!user) user = await User.create({
        firstname: student.firstname, lastname: student.lastname, email,
        description: student.description, password: await bcrypt.hash(randomUUID(), 10),
        isActive: true, emailVerified: true, roles: [studentRole._id],
      });
      learnerIds.push(String(user._id));
      if (!(await prisma.orm.public.Student.where({ idMdb: String(user._id) }).first())) {
        await prisma.orm.public.Student.create({ idMdb: String(user._id) });
      }
    }

    const formationTitle = "formation démo · suivi des apprenants";
    let formation = await prisma.orm.public.Formation.where({ title: formationTitle }).first();
    if (!formation) formation = await prisma.orm.public.Formation.create({ title: formationTitle, level: "Débutant", adminId: admin.id });
    const parcoursTitle = "parcours démo · développement web";
    let parcours = await prisma.orm.public.Parcours.where({ title: parcoursTitle }).first();
    if (!parcours) parcours = await prisma.orm.public.Parcours.create({
      title: parcoursTitle, author: teacherId, adminId: admin.id,
      formationId: formation.id, isPublished: true,
    });
    if (!(await prisma.orm.public.ContactsOnParcours.where({ contactId: contact.id, parcoursId: parcours.id }).first())) {
      await prisma.orm.public.ContactsOnParcours.create({ contactId: contact.id, parcoursId: parcours.id });
    }

    const groupName = "Promotion démo · développement web";
    let group = await Group.findOne({ name: groupName.toLowerCase() });
    if (!group) group = await Group.create({ name: groupName, users: learnerIds, roles: [studentRole._id], createdBy: teacher._id, isActive: true });
    else await Group.updateOne({ _id: group._id }, { $set: { users: learnerIds, isActive: true } });
    let pgGroup = await prisma.orm.public.Group.where({ idMdb: String(group._id) }).first();
    if (!pgGroup) pgGroup = await prisma.orm.public.Group.create({ idMdb: String(group._id) });
    if (!(await prisma.orm.public.GroupsOnParcours.where({ groupId: pgGroup.id, parcoursId: parcours.id }).first())) {
      await prisma.orm.public.GroupsOnParcours.create({ groupId: pgGroup.id, parcoursId: parcours.id });
    }
    await User.updateMany({ _id: { $in: learnerIds } }, { $addToSet: { group: group._id } });

    const key = "demo-dashboard-dropout";
    const completedAt = new Date();
    await DropoutWeek.updateOne({ key }, { $set: {
      status: "complete", completedAt,
      groups: [{ groupId: String(group._id), name: group.name, parcoursId: parcours.id,
        teacherIds: [teacherId], analyzed: learnerIds.length, critical: students.filter((student) => student.critical).length }],
    } }, { upsert: true });
    for (const [index, userId] of learnerIds.entries()) {
      await DropoutPrediction.updateOne({ key: `${key}:${userId}` }, { $set: {
        week: key, userId, status: "complete", critical: students[index].critical,
        effectiveLevel: students[index].critical ? 3 : 0,
        indicators: demoIndicators[index], coverage: { available: 11, total: 11 },
      } }, { upsert: true });
    }
    console.log(`Données créées : ${learnerIds.length} étudiants, 1 groupe, ${students.filter((student) => student.critical).length} alertes pour ${teacher.email}.`);
  } finally {
    await mongoose.disconnect();
    await prisma.close();
  }
}

await main();
