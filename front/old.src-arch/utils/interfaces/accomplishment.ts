import User from "./user";

export interface Accomplishment {
  description: string;
  id: number;
  name: string;
  student: User;
  accomplishedAt?: Date;
}
