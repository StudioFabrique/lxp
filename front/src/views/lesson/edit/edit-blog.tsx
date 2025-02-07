/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSelector } from "react-redux";
import BlogUpdate from "../../../components/edit-lesson/activities/blog-update";

export default function EditBlog() {
  const activity = useSelector((state: any) => state.lesson.activity);

  return (
    <main>
      <h1>Edition blog</h1>
      <p>{activity?.title}</p>
      <BlogUpdate activity={activity} />
    </main>
  );
}
