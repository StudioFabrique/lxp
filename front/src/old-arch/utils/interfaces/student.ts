import Group from "./group";

export default interface Student {
  _id: string;
  email: string;
  password?: string;
  firstname: string;
  lastname: string;
  address?: string;
  postCode?: string;
  city?: string;
  roles: Array<string>;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  group?: Group;
}
