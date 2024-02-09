import Lesson from "./lesson";
import User from "./user";

export default interface LessonRead {
  id: number;
  beganAt?: Date;
  lastReadAt?: Date;
  finishedAt?: Date;
  lesson: Lesson;
  student: User;
}
