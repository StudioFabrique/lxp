//  admin and teacher

import Group from "./group";
import Hobby from "./hobby";
import { Link } from "./link";
import Role from "./role";

export default interface User {
  _id: string;
  idMdb?: string;
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
  hobbies?: Array<Hobby>;
  links?: Array<Link>;
  connectionInfos?: Array<{ lastConnection: string; duration: number }>;
  parcours?: string;
  formation?: string;
}
