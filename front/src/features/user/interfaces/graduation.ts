import User from "../../../utils/interfaces/user";

export default interface Graduation {
  _id?: string;
  id?: number;
  title: string;
  degree: string;
  date: Date;
  user?: User;
}
