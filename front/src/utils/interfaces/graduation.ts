import User from "./user";

export default interface Graduation {
  _id?: string;
  title: string;
  degree: string;
  date: Date;
  user?: User;
}
