import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./utils/interfaces/db/user";
import Role from "./utils/interfaces/db/role";
import PromptStats from "./utils/interfaces/db/prompt-stats";
import Group from "./utils/interfaces/db/group";
dotenv.config();

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

async function disconnect() {
  await mongoose.disconnect();
  process.exit();
}

async function seedChatbotPrompts() {
  const studentRole = await Role.findOne({ role: "student" });
  console.log({ studentRole });

  // Configuration des groupes à créer
  const groupsConfig = [
    { name: "Développeurs Web", studentCount: 12, prefix: "dev" },
    { name: "Data Scientists", studentCount: 8, prefix: "data" },
    { name: "DevOps Engineers", studentCount: 10, prefix: "devops" },
  ];

  // Supprime les anciennes données pour éviter les doublons
  await PromptStats.deleteMany({});
  await User.deleteMany({ email: { $regex: /@example\.com$/ } });
  await Group.deleteMany({ name: { $in: groupsConfig.map((g) => g.name) } });

  const maxDate = new Date(2026, 1, 1);
  let studentsPrompts: any[] = [];

  for (const config of groupsConfig) {
    // Créer les étudiants pour ce groupe
    const createdStudentIds: mongoose.Types.ObjectId[] = [];
    for (let i = 1; i <= config.studentCount; i++) {
      const user = new User({
        firstname: `${config.prefix.charAt(0).toUpperCase() + config.prefix.slice(1)}Student${i}`,
        lastname: `Test${i}`,
        email: `${config.prefix}${i}@example.com`,
        roles: [studentRole?._id],
        emailVerified: true,
        isActive: true,
        invitationSent: true,
      });
      await user.save();
      createdStudentIds.push(user._id);
    }

    // Créer le groupe et y ajouter les étudiants
    const group = new Group({
      name: config.name,
      users: createdStudentIds,
      roles: [studentRole?._id],
    });
    await group.save();

    // Mettre à jour les étudiants pour référencer le groupe
    await User.updateMany(
      { _id: { $in: createdStudentIds } },
      { $push: { groups: group._id } },
    );

    console.log(
      `Groupe "${group.name}" créé avec ${createdStudentIds.length} étudiants`,
    );

    const students = await User.find({ _id: { $in: createdStudentIds } });
    const tmpDate = new Date(2025, 0, 1);

    // Générer les PromptStats pour ce groupe
    while (tmpDate < maxDate) {
      const prompts: any[] = [];
      for (const student of students) {
        const prompt = {
          userId: student._id,
          groupId: group._id,
          tokensUsed: Math.floor(Math.random() * 100),
          date: new Date(tmpDate),
        };
        prompts.push(prompt);
      }
      await PromptStats.insertMany(prompts);
      tmpDate.setDate(tmpDate.getDate() + 1);
    }

    // Calculer les stats par étudiant
    const prompts = await PromptStats.find({ groupId: group._id });
    for (const student of students) {
      const studentPrompts = prompts.filter(
        (p) => p.userId.toString() === student._id.toString(),
      );
      const totalTokensUsed = studentPrompts.reduce(
        (sum, p) => sum + p.tokensUsed,
        0,
      );
      studentsPrompts.push({
        studentId: student._id,
        totalTokensUsed,
        prompts: studentPrompts.length,
      });
    }
  }

  // Mettre à jour le promptCount pour tous les étudiants
  for (const p of studentsPrompts) {
    await User.updateOne(
      { _id: p.studentId },
      { $set: { promptCount: p.prompts || 0 } },
    );
  }

  console.log(`\nTotal: ${groupsConfig.length} groupes créés`);
}

async function main() {
  await mongoConnect();
  await seedChatbotPrompts();
  await disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
