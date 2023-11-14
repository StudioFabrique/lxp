import User from "./user";

export default interface Graduation {
  id?: number;
  title: string;
  degree: string;
  date: Date;
  user?: User;
}
