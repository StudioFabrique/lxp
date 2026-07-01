// Import des composants et hooks nécessaires
import type { Activity } from "../../../utils/interfaces/activity";
import { useCallback, useEffect, useState } from "react";
import useHttp from "../../../hooks/use-http";
import ActivityHeader from "../../../components/edit-lesson/activities/activity-header";
import ActivityContent from "../../../components/edit-lesson/activities/activity-content";
import ActivityMetadata from "../../../components/edit-lesson/activities/activity-metadata";
import { useParams } from "react-router";

/**
 * Composant PreviewActivity
 * Permet de prévisualiser et éditer une activité
 */
function PreviewActivity() {
  // Récupération de l'ID de l'activité depuis l'URL
  const { activityId } = useParams();
  // État pour stocker les données de l'activité
  const [activity, setActivity] = useState<Activity | null>(null);
  // Hook personnalisé pour les requêtes HTTP
  const { sendRequest } = useHttp();
  // État pour gérer le mode édition
  const [isEditing, setIsEditing] = useState(false);

  /**
   * Récupère les données de l'activité depuis l'API
   */
  const getActivity = useCallback(() => {
    const applyData = (data: { success: boolean; activity: Activity }) => {
      if (data.success) {
        setActivity(data.activity);
      }
    };
    sendRequest({ path: `/activity/${activityId}` }, applyData);
  }, [activityId, sendRequest]);

  /**
   * Gère la soumission des modifications
   * @param newValue - Nouvel état d'édition
   */
  const handleSubmitted = (newValue: boolean) => {
    setIsEditing(newValue);
    getActivity();
  };

  /**
   * Bascule entre les modes édition et visualisation
   */
  const toggleEditing = () => setIsEditing((prev) => !prev);

  /**
   * Annule les modifications et recharge les données
   */
  const handleCancel = () => {
    setIsEditing(false);
    getActivity();
  };

  // Charge les données de l'activité au montage du composant
  useEffect(() => {
    getActivity();
  }, [getActivity]);

  // Ne rend rien si l'activité n'est pas chargée
  if (!activity) return null;

  return (
    <main className="w-full">
      <section className="w-full flex flex-col gap-y-4 mb-4">
        {isEditing ? (
          // Mode édition
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
          // Mode visualisation
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
