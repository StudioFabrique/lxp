import User from "./user";

export default interface Hobby {
  _id?: string;
  title: string;
  user?: User;
}
