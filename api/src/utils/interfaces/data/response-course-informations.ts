export default interface ResponseCourseInformations {
  id: number;
  title: string;
  description: string | null;
  image?: string | null;
  virtualClass?: string | null;
  visibility?: boolean | null;
  tags: any[];
  contacts: any[];
  module: any;
}
