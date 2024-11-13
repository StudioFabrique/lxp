/* eslint-disable @typescript-eslint/no-explicit-any */

// Import des composants et hooks nécessaires
import BlogUpdate from "../../../components/edit-lesson/activities/blog-update";
import Activity from "../../../utils/interfaces/activity";
import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import useHttp from "../../../hooks/use-http";
import { displayDate } from "../../../helpers/dispaly-dates";
import VideoPlayer from "../../../components/UI/video-player";
import Video from "../../../components/edit-lesson/activities/video";

// Composant principal pour prévisualiser et éditer une activité
function PreviewActivity() {
  // Récupération de l'ID de l'activité depuis l'URL
  const { activityId } = useParams();
  // État pour stocker les données de l'activité
  const [activity, setActivity] = useState<Activity | null>(null);
  // Hook personnalisé pour les requêtes HTTP
  const { sendRequest } = useHttp();
  // État pour gérer le mode édition
  const [isEditing, setIsEditing] = useState(false);

  // Fonction pour récupérer les données de l'activité depuis l'API
  const getActivity = useCallback(() => {
    const applyData = (data: { success: boolean; activity: Activity }) => {
      if (data.success) {
        setActivity(data.activity);
      }
    };
    sendRequest({ path: `/activity/${activityId}` }, applyData);
  }, [activityId, sendRequest]);

  // Gestionnaire appelé après la soumission d'une modification
  const onSubmitted = (newValue: boolean) => {
    setIsEditing(newValue);
    getActivity();
  };

  // Chargement initial des données
  useEffect(() => {
    getActivity();
  }, [getActivity]);

  console.log({ activity });

  return (
    <main className="w-full">
      {/* Mode édition */}
      {activity && isEditing ? (
        <section className="w-full flex flex-col gap-y-4 mb-4">
          <article className="w-full flex justify-between items-center">
            <h1 className="text-xl font-bold">Mise à jour de l'activité</h1>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => setIsEditing((prevState) => !prevState)}
            >
              Annuler
            </button>
          </article>
          <article>
            {/* Rendu conditionnel selon le type d'activité en mode édition */}
            {activity && activity.type === "text" ? (
              <BlogUpdate
                activity={activity}
                isEditing={isEditing}
                onSubmitted={onSubmitted}
              />
            ) : null}
            {activity && activity.type === "video" ? (
              <VideoPlayer
                source={activity.url}
                title={activity.title}
                description={activity.description}
              />
            ) : null}
          </article>
        </section>
      ) : activity ? (
        // Mode visualisation
        <section className="w-full flex flex-col gap-y-4 mb-4">
          <article className="w-full flex justify-between items-center">
            <h1 className="text-xl font-bold">Aperçu de l'activité</h1>
            <Link className="btn btn-primary btn-sm" to={".."}>
              Retour
            </Link>
          </article>
          {/* En-tête de l'activité avec titre, description et dates */}
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
            {/* Rendu conditionnel selon le type d'activité en mode visualisation */}
            {activity.type === "text" ? (
              <BlogUpdate
                activity={activity}
                isEditing={isEditing}
                onSubmitted={onSubmitted}
              />
            ) : null}
            {activity.type === "video" ? <Video activity={activity} /> : null}
          </article>
          {/* Bouton pour passer en mode édition */}
          <div className="flex justify-end">
            <button
              className="btn btn-primary"
              onClick={() => setIsEditing((prevState) => !prevState)}
            >
              Editer
            </button>
          </div>
        </section>
      ) : null}
    </main>
  );
}

export default PreviewActivity;
