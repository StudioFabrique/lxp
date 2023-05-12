//  admin and teacher

import Role from "./role";

export default interface User {
  _id: string;
  email: string;
  password?: string;
  firstname: string;
  lastname: string;
  address?: string;
  postCode?: string;
  city?: string;
  roles: Array<Role>;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}
