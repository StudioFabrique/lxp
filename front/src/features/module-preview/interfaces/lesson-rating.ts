export default interface LessonRating {
  id: number;
  rating: number;
  comment?: string | null;
  lessonId: number;
  studentId: number;
}
