import Lesson from "./lesson";
import User from "./user";

export default interface LessonRead {
  id: number;
  beganAt: Date;
  finishedAt?: Date;
  lesson: Lesson;
  student: User;
}
