import Role from "../../utils/interfaces/db/role";
import User, { IUser } from "../../utils/interfaces/db/user";
import bcrypt from "bcrypt";

async function postTeacher(teacher: IUser) {
  const existingUser = await User.findOne(
    { email: teacher.email },
    { email: 1 }
  );

  if (existingUser) {
    throw new Error(
      `L'utilisateur avec l'email : ${teacher.email} existe déjà`
    );
  }

  const password = await bcrypt.hash(generateRandomString(), 10);
  const fetchedRole = await Role.findOne({ role: "teacher" }, { _id: 1 });

  const newTeacher = await User.create({
    ...teacher,
    password,
    roles: [new Object(fetchedRole!._id)],
  });

  console.log({ newTeacher });
  if (newTeacher) {
    const updatedTeacher = await User.findOne(
      { _id: newTeacher._id },
      { _id: 1, firstname: 1, lastname: 1 }
    ).populate("roles", { label: 1 });
    return updatedTeacher;
  } else {
    return false;
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
