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
import Modal from "../../../components/UI/modal/modal";
import { useEffect, useState } from "react";

export default function EditLessonHome() {
  const { lessonId } = useParams();
  const { sendRequest, error } = useHttp();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const currentType = useSelector(
    (state: any) => state.lesson.currentType
  ) as string;
  const activities = useSelector(
    (state: any) => state.lesson.lesson.activities
  ) as Activity[];
  const activityToDelete = useSelector(
    (state: any) => state.lesson.activityToDelete
  ) as Activity;

  /**
   * soumet une nouvelle activité vers la base de données, sa propriété "order" est déterminée en fonction de son placement dans la liste
   * une nouvelle activité est tjrs placée en fin de liste par défaut, donc son "order" est égal à la longueur du tableau
   * @param value any (activity n'ayant pas encore toutes ses propriétés d'initialisées)
   */
  const handleSubmit = (value: any) => {
    const applyData = (data: any) => {
      toast.success("Document enregistré !");
      dispatch(lessonActions.addActivity(data));
      dispatch(lessonActions.resetCurrentType());
    };
    const getData = async () => {
      console.log(activities.length);
      sendRequest(
        {
          path: `/activity/${lessonId}`,
          method: "post",
          body: {
            type: currentType,
            order: activities.length > 0 ? activities.length + 1 : 1,
            value: await fromHtmlToMarkdown(value),
          },
        },
        applyData
      );
    };
    getData();
  };

  /**
   * soumet les modifications apportées à une activité vers la bdd
   */
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
      dispatch(lessonActions.setBlogEdition(null));
      setIsLoading(false);
    };
    const getData = async () => {
      setIsLoading(true);
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

  /**
   * définit le type d'une activité pour afficher le composant approprié dans la vue pour y ajouter du contenu
   * @param activityType string
   */
  const handleSelectActivityType = (activityType: string) => {
    dispatch(lessonActions.setCurrentType(activityType));
  };

  /**
   * supprime une activité de la bdd de manière définitive ainssi que toutes les ressources qui
   * lui sont associées après confirmation via une fenêtre modal
   */
  const handleDeleteActivity = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const applyData = (_data: any) => {
      dispatch(lessonActions.removeActivity(activityToDelete.id));
      dispatch(lessonActions.setActivityToDelete(null));
      setIsLoading(false);
    };
    setIsLoading(true);
    sendRequest(
      {
        path: `/activity/${activityToDelete.id}`,
        method: "delete",
      },
      applyData
    );
  };

  /**
   * annule la suppression d'une activité et ferme la modal
   * de confirmation
   */
  const handleCancelDeletion = () => {
    dispatch(lessonActions.setActivityToDelete(null));
  };

  // gère les erreurs HTTP
  useEffect(() => {
    if (error.length > 0) {
      toast.error(error);
      dispatch(lessonActions.setActivityToDelete(null));
      setIsLoading(false);
    }
  }, [error, dispatch]);

  return (
    <>
      {activities && activities.length > 0 ? (
        <section className="mt-8 flex flex-col items-center">
          <ul className="w-full">
            {sortArray(activities, "order").map((item) => (
              <li key={item.id}>
                <h2 className="font-bold text-md text-primary">
                  Activité n° {item.order}
                </h2>
                {item.type === "text" ? (
                  <BlogUpdate
                    activity={item}
                    onUpdate={handleUpdate}
                    isSubmitting={isLoading}
                  />
                ) : null}
                {item.type === "video" ? <p>Video</p> : null}
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
        <CurrentBlock isSubmitting={isLoading} onSubmit={handleSubmit} />
      )}
      {activityToDelete ? (
        <Modal
          onLeftClick={handleCancelDeletion}
          onRightClick={handleDeleteActivity}
          title={`Supprimer l'activité n° ${activityToDelete.order + 1}`}
          isSubmitting={isLoading}
          message="Attention l'activité et les ressources qui lui sont associées seront définitivement supprimées."
          leftLabel="Annuler"
          rightLabel="Confirmer"
        />
      ) : null}
    </>
  );
}
