import { IPermission } from "./utils/interfaces/db/permission";

const permDefs = {
  admin: {
    read: ["admin", "teacher", "student"],
    write: ["teacher", "student"],
    delete: ["teacher", "student"],
  },
  teacher: {
    read: ["teacher", "student"],
    write: ["student"],
    delete: ["student"],
  },
};

const permissions = Array<IPermission>();

for (const [key, value] of Object.entries(permDefs)) {
  console.log(`${key}: ${value}`);
  for (const [itemKey, itemValue] of Object.entries(value)) {
    permissions.push({ role: key, action: itemKey, subject: itemValue });
  }
}

console.log(permissions);
