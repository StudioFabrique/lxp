/* eslint-disable @typescript-eslint/no-explicit-any */

import BlogUpdate from "../../../components/edit-lesson/activities/blog-update";
import Activity from "../../../utils/interfaces/activity";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useHttp from "../../../hooks/use-http";
import { displayDate } from "../../../helpers/dispaly-dates";

function PreviewActivity() {
  const { activityId } = useParams();
  const [activity, setActivity] = useState<Activity | null>(null);
  const { sendRequest } = useHttp();
  const [isEditing, setIsEditing] = useState(false);

  const getActivity = useCallback(() => {
    const applyData = (data: { success: boolean; activity: Activity }) => {
      if (data.success) {
        setActivity(data.activity);
      }
    };
    sendRequest({ path: `/activity/${activityId}` }, applyData);
  }, [activityId, sendRequest]);

  const onSubmitted = (newValue: boolean) => {
    setIsEditing(newValue);
    getActivity();
  };

  useEffect(() => {
    getActivity();
  }, [getActivity]);

  console.log({ activity });

  return (
    <main className="w-full">
      {activity && isEditing ? (
        <section className="w-full flex flex-col gap-y-4 mb-4">
          <article className="w-full flex justify-between items-center">
            <h1 className="text-xl font-bold">Mise à jour de l'activité</h1>
            <button
              className="btn btn-primary"
              onClick={() => setIsEditing((prevState) => !prevState)}
            >
              Retour
            </button>
          </article>
          <article>
            {activity && activity.type === "text" ? (
              <BlogUpdate
                activity={activity}
                isEditing={isEditing}
                onSubmitted={onSubmitted}
              />
            ) : null}
          </article>
        </section>
      ) : activity ? (
        <section className="w-full flex flex-col gap-y-4 mb-4">
          <article className="w-full flex justify-between items-center">
            <h1 className="text-xl font-bold">Aperçu de l'activité</h1>
            <button
              className="btn btn-primary"
              onClick={() => setIsEditing((prevState) => !prevState)}
            >
              Editer
            </button>
          </article>
          <article className="flex items-center justify-between">
            <span>
              <h2 className="text-lg font-bold">{activity?.title}</h2>
              <p className="text-sm text-gray-500">{activity?.description}</p>
            </span>
            <span className="text-xs italic opacity-50">
              {displayDate(activity.createdAt, activity.updatedAt)}
            </span>
          </article>
          <article>
            <BlogUpdate
              activity={activity}
              isEditing={isEditing}
              onSubmitted={onSubmitted}
            />
          </article>
        </section>
      ) : null}
    </main>
  );
}

export default PreviewActivity;
