/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import useHttp from "../../../hooks/use-http";
import { useParams } from "react-router-dom";
import Activity from "../../../utils/interfaces/activity";
import { fromHtmlToMarkdown } from "../../../helpers/html-parser";
import CurrentBlock from "../../../components/edit-lesson/current-block";
import { BlogUpdate } from "../../../components/edit-lesson/activities/blog-update";

export default function EditLessonHome() {
  const { lessonId } = useParams();
  const { sendRequest } = useHttp();

  const currentType = useSelector(
    (state: any) => state.lesson.currentType
  ) as string;
  const activities = useSelector(
    (state: any) => state.lesson.lesson.activities
  ) as Activity[];

  const handleSubmit = (value: any) => {
    const applyData = (data: any) => {
      toast.success(data.message);
    };
    const getData = async () => {
      sendRequest(
        {
          path: `/activity/${lessonId}`,
          method: "post",
          body: {
            type: currentType,
            order: activities.length > 0 ? activities.length - 1 : 0,
            value: await fromHtmlToMarkdown(value),
          },
        },
        applyData
      );
    };
    getData();
  };

  console.log({ activities });

  return (
    <>
      {activities && activities.length > 0 ? (
        <ul>
          {activities.map((item) => (
            <BlogUpdate activity={item} onSubmit={handleSubmit} />
          ))}
        </ul>
      ) : !currentType ? (
        <p className="text-primary mt-8">
          Ajoutez du contenu à la leçon en sélectionnant un type d'activité
        </p>
      ) : (
        <CurrentBlock onSubmit={handleSubmit} />
      )}
    </>
  );
}
