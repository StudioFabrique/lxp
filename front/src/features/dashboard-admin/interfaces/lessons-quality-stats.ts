export default interface LessonsQualityStats {
  globalQualityRating: number;
  coursesRating: CourseQualityRating[];
}

export type CourseQualityRating = {
  firstLessonId: number;
  moduleId: number;
  courseTitle: string;
  rating: number;
};
