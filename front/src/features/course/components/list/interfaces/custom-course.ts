export default interface CustomCourse {
  id: number;
  moduleId: number;
  author: string;
  title: string;
  module: string;
  parcours: string;
  updatedAt: string;
  isPublished: boolean;
  visibility: boolean;
  lessons: Array<{
    id: number;
    title: string;
    order: number;
  }>;
}
