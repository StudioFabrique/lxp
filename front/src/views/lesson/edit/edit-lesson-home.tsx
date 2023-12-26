/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import useHttp from "../../../hooks/use-http";
import { useParams } from "react-router-dom";
import Activity from "../../../utils/interfaces/activity";
import { fromHtmlToMarkdown } from "../../../helpers/html-parser";
import CurrentBlock from "../../../components/edit-lesson/current-block";
import { BlogUpdate } from "../../../components/edit-lesson/activities/blog-update";
import AddBlock from "../../../components/edit-lesson/add-block";
import { lessonActions } from "../../../store/redux-toolkit/lesson/lesson";
import { sortArray } from "../../../utils/sortArray";

export default function EditLessonHome() {
  const { lessonId } = useParams();
  const { sendRequest } = useHttp();
  const dispatch = useDispatch();

  const currentType = useSelector(
    (state: any) => state.lesson.currentType
  ) as string;
  const activities = useSelector(
    (state: any) => state.lesson.lesson.activities
  ) as Activity[];

  const handleSubmit = (value: any) => {
    const applyData = (data: any) => {
      toast.success("Document enregistré !");
      dispatch(lessonActions.addActivity(data));
      dispatch(lessonActions.resetCurrentType());
    };
    const getData = async () => {
      console.log(await fromHtmlToMarkdown(value));
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

  const handleUpdate = (activity: any) => {
    const applyData = (data: {
      success: boolean;
      message: string;
      response: Activity;
    }) => {
      if (data.success) {
        toast.success(data.message);
        dispatch(lessonActions.updateActivity(data.response));
      }
    };
    const getData = async () => {
      sendRequest(
        {
          path: `/activity/${activity.id!}`,
          method: "put",
          body: {
            value: await fromHtmlToMarkdown(activity.value),
            type: activity.type,
            order: activity.order,
            url: activity.url,
          },
        },
        applyData
      );
    };
    getData();
  };

  const handleSelectActivityType = (activityType: string) => {
    dispatch(lessonActions.setCurrentType(activityType));
  };

  return (
    <>
      {activities && activities.length > 0 ? (
        <section className="mt-8 flex flex-col items-center">
          <ul>
            {sortArray(activities, "order").map((item, index) => (
              <li key={item.id}>
                <h2 className="font-bold text-md text-primary">
                  Activité n° {index + 1}
                </h2>
                {item.type === "text" ? (
                  <BlogUpdate activity={item} onUpdate={handleUpdate} />
                ) : null}
              </li>
            ))}
          </ul>
          <div className="divider text-primary">
            <h2 className="font-bold text-primary">AJOUTER UN BLOC</h2>
          </div>
          <AddBlock onActivityType={handleSelectActivityType} />
        </section>
      ) : null}
      {!currentType ? (
        <p className="text-primary mt-8">
          Ajoutez du contenu à la leçon en sélectionnant un type d'activité
        </p>
      ) : (
        <CurrentBlock onSubmit={handleSubmit} />
      )}
    </>
  );
}
