//  admin and teacher

export default interface User {
  id: string;
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  address?: string;
  postCode: string;
  city: string;
  roles: Array<string>;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}
