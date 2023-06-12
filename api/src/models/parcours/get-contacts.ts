import Role from "../../utils/interfaces/db/role";
import User from "../../utils/interfaces/db/user/user.model";

async function getContacts() {
  const teacherRoles = await Role.find({ rank: 2 }, { _id: 1 });

  console.log(teacherRoles);

  const contacts = await User.find(
    { roles: { $in: teacherRoles } },
    { _id: 1, firstname: 1, lastname: 1, email: 1, roles: 1 }
  ).populate("roles");

  console.log(contacts);

  return contacts;
}

export default getContacts;
