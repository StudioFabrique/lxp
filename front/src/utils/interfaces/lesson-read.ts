import Lesson from "./lesson";
import User from "./user";

export default interface LessonRead {
  id: number;
  beganAt?: Date;
  lastOpenedAt?: Date;
  lastReadAt?: Date;
  finishedAt?: Date;
  /** Dernière activité consultée dans cette leçon, lorsqu'elle existe. */
  activityId?: number;
  lesson: Lesson;
  student: User;
  parcoursId?: number;
}
