import { Contact } from "../../../generated/prisma/browser";
import { prisma } from "../../utils/db";
import Role from "../../utils/interfaces/db/role";
import User, { IUser } from "../../utils/interfaces/db/user";
import bcrypt from "bcrypt";

async function postTeacher(teacher: IUser) {
  const existingUser = await User.findOne(
    { email: teacher.email },
    { email: 1 },
  );

  // vérification de la disponibilité de l'adresse email
  if (existingUser) {
    throw {
      statusCode: 409,
      message: `L'utilisateur avec l'email : ${teacher.email} existe déjà`,
    };
  }

  // enregistrement du contact dans la base de données Mongodb
  const password = await bcrypt.hash(generateRandomString(), 10);
  const fetchedRole = await Role.findOne({ role: "teacher" }, { _id: 1 });

  const newTeacher = await User.create({
    ...teacher,
    password,
    isActive: teacher.isActive ?? false,
    roles: [new Object(fetchedRole!._id)],
  });

  // si l'enregistement de l'utisilateur dans la base de données Mongodb a réussi
  // on enregistre la référence de cet enregistrement dans la base de données sql
  if (newTeacher) {
    const updatedTeacher = await User.findOne(
      { _id: newTeacher._id },
      { _id: 1, firstname: 1, lastname: 1, phoneNumber: 1, email: 1 },
    ).populate("roles", { label: 1 });

    if (updatedTeacher) {
      let contact: Contact | null = null;
      const transaction = await prisma.$transaction(async (tx) => {
        contact = await tx.contact.create({
          data: {
            idMdb: updatedTeacher._id,
            name: `${updatedTeacher.lastname} ${updatedTeacher.firstname}`,
            role: updatedTeacher.roles[0].label,
            phone: updatedTeacher.phoneNumber,
            email: updatedTeacher.email,
          },
        });

        await tx.admin.create({
          data: {
            idMdb: updatedTeacher._id,
          },
        });
      });

      return contact;
    }
  } else {
    throw {
      statusCode: 500,
      message:
        "Erreur lors de la création de l'utilisateur, veuillez reessayer",
    };
  }
}

export default postTeacher;

function generateRandomString() {
  const approvedCharacters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ,.'-+éàè@â!?ôêûù";
  let randomString = "";

  for (let i = 0; i < 15; i++) {
    const randomIndex = Math.floor(Math.random() * approvedCharacters.length);
    randomString += approvedCharacters.charAt(randomIndex);
  }

  return randomString;
}
