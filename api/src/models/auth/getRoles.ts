import Role from "../../utils/interfaces/db/role";

async function getRoles() {
  return await Role.find({});
}

export default getRoles;
