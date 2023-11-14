//  admin and teacher

import Group from "./group";
import Role from "./role";

export default interface User {
  _id: string;
  email: string;
  password?: string;
  firstname: string;
  lastname: string;
  nickname?: string;
  address?: string;
  postCode?: string;
  city?: string;
  phoneNumber?: string;
  roles: Array<Role>;
  avatar?: string;
  createdAt?: Date;
  updatedAt?: Date;
  isActive: boolean;
  group?: Group;
}
