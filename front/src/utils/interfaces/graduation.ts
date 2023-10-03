import User from "./user";

export default interface Graduation {
  title: string;
  degree: string;
  date: Date;
  users?: Array<User>;
}
