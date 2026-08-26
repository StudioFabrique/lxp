import { prisma } from "../../utils/db.ts";
import Role from "../../utils/interfaces/db/role.ts";
import User, { type IUser } from "../../utils/interfaces/db/user.ts";
import bcrypt from "bcrypt";
import { exactInsensitive, normalizeEmail } from "../../utils/unique-fields.ts";

async function postTeacher(teacher: IUser) {
  const email = normalizeEmail(teacher.email ?? "");

  if (email.length === 0) {
    throw {
      statusCode: 400,
      message: "L'adresse email est obligatoire.",
    };
  }

  // vérification de la disponibilité de l'adresse email, à la casse près :
  // l'email est ici enregistré tel quel, une égalité stricte laissait passer
  // la même adresse écrite différemment.
  const existingUser = await User.findOne(
    { email: exactInsensitive(email) },
    { email: 1 },
  );

  if (existingUser) {
    throw {
      statusCode: 409,
      message: `L'utilisateur avec l'email : ${email} existe déjà`,
    };
  }

  // enregistrement du contact dans la base de données Mongodb
  const password = await bcrypt.hash(generateRandomString(), 10);
  const fetchedRole = await Role.findOne({ role: "teacher" }, { _id: 1 });

  const newTeacher = await User.create({
    ...teacher,
    email,
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
      const contact = await prisma.$transaction(async (tx) => {
        const createdContact = await tx.contact.create({
          data: {
            idMdb: updatedTeacher._id,
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

        return createdContact;
      });

      return {
        ...contact,
        firstname: updatedTeacher.firstname,
        lastname: updatedTeacher.lastname,
      };
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
