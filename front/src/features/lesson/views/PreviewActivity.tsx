import type { Activity } from "../../../../src.legacy/utils/interfaces/activity";
import { useCallback, useEffect, useState } from "react";
import useHttp from "../../../../src.legacy/hooks/use-http";
import ActivityHeader from "../components/edit/activities/activity-header";
import ActivityContent from "../components/edit/activities/activity-content";
import ActivityMetadata from "../components/edit/activities/activity-metadata";
import { useParams } from "react-router";

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

  const handleSubmitted = (newValue: boolean) => {
    setIsEditing(newValue);
    getActivity();
  };

  const toggleEditing = () => setIsEditing((prev) => !prev);

  const handleCancel = () => {
    setIsEditing(false);
    getActivity();
  };

  useEffect(() => {
    getActivity();
  }, [getActivity]);

  if (!activity) return null;

  return (
    <main className="w-full">
      <section className="w-full flex flex-col gap-y-4 mb-4">
        {isEditing ? (
          <>
            <ActivityHeader
              title="Mise à jour de l'activité"
              onCancel={handleCancel}
            />
            <article>
              <ActivityContent
                activity={activity}
                isEditing={isEditing}
                onSubmitted={handleSubmitted}
                onCancel={handleCancel}
              />
            </article>
          </>
        ) : (
          <>
            <ActivityHeader title="Aperçu de l'activité" />
            <ActivityMetadata activity={activity} />
            <article>
              <ActivityContent
                activity={activity}
                isEditing={isEditing}
                onSubmitted={handleSubmitted}
                onCancel={handleCancel}
              />
            </article>
            {activity.type !== "resource" ? (
              <div className="flex justify-end">
                <button className="btn btn-primary" onClick={toggleEditing}>
                  Editer
                </button>
              </div>
            ) : null}
          </>
        )}
      </section>
    </main>
  );
}

export default PreviewActivity;
