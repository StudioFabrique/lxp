import User, { IUser } from "../../utils/interfaces/db/user.model";

export interface ICreateUserRequest {
  email: string;
  firstname: string;
  lastname: string;
  description: string;
  pseudo: string;
  address: string;
  postCode: number;
  city: string;
  birthDate: Date;
  userType: number;
}

export default async function createUser(user: ICreateUserRequest) {
  const userToFind = await User.findOne({ email: user.email });
  if (userToFind) {
    return null;
  }

  const createdUser = await User.create(user);

  return createdUser;
}
