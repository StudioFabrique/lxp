import Activity from "../../../utils/interfaces/activity";
import { useCallback, useEffect, useState } from "react";
import useHttp from "../../../hooks/use-http";
import ActivityHeader from "../../../components/edit-lesson/activities/activity-header";
import ActivityContent from "../../../components/edit-lesson/activities/activity-content";
import ActivityMetadata from "../../../components/edit-lesson/activities/activity-metadata";
import { useParams } from "react-router-dom";

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
              onCancel={toggleEditing}
            />
            <article>
              <ActivityContent
                activity={activity}
                isEditing={isEditing}
                onSubmitted={handleSubmitted}
                onCancel={toggleEditing}
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
                onCancel={() => {}}
              />
            </article>
            <div className="flex justify-end">
              <button className="btn btn-primary" onClick={toggleEditing}>
                Editer
              </button>
            </div>
          </>
        )}
      </section>
    </main>
  );
}

export default PreviewActivity;
