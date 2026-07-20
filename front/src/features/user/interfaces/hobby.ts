import User from "../../../utils/interfaces/user";

export default interface Hobby {
  _id?: string;
  title: string;
  user?: User;
}
