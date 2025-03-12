export default interface LessonsQualityStats {
  globalQualityRating: number;
  coursesRating: CourseQualityRating[];
}

export type CourseQualityRating = {
  courseId: number;
  courseTitle: string;
  rating: number;
};
