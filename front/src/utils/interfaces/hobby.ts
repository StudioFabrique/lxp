import User from "./user";

export default interface Hobby {
  id?: number;
  title: string;
  user?: User;
}
