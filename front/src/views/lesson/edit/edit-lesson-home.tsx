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
import { useCallback, useEffect, useState } from "react";
import Video from "../../../components/edit-lesson/activities/video";
import ActionsButtonsGroup from "../../../components/edit-lesson/actions-buttons-group";
import { CheckCircle, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import Wrapper from "../../../components/UI/wrapper/wrapper.component";
import { autoSubmitTimer } from "../../../config/auto-submit-timer";

export default function EditLessonHome() {
  const { lessonId } = useParams();
  const { sendRequest, error } = useHttp();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [submit, setSubmit] = useState(false);
  const [success, setSuccess] = useState(false);

  const currentType = useSelector(
    (state: any) => state.lesson.currentType
  ) as string;
  const activities = useSelector(
    (state: any) => state.lesson.lesson.activities
  ) as Activity[];
  const activityToDelete = useSelector(
    (state: any) => state.lesson.activityToDelete
  ) as Activity;
  const blogEdition = useSelector(
    (state: any) => state.lesson.blogEdition
  ) as number;

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
            order: activities.length > 0 ? activities.length - 1 : 0,
            value: await fromHtmlToMarkdown(value),
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

  console.log({ activities });

  const handleClickUp = (act: Activity) => {
    const oldOrder = act.order;
    const replacedAct = activities.find((item) => item.order === oldOrder - 1);
    if (replacedAct) {
      let updatedActivities = activities.filter(
        (item) => item.id !== act.id && item.id !== replacedAct.id
      );
      updatedActivities = [
        ...updatedActivities,
        { ...act, order: act.order - 1 },
        { ...replacedAct, order: replacedAct.order + 1 },
      ];
      dispatch(lessonActions.setActivity(updatedActivities));
      setSubmit(true);
    }
  };

  const handleClickDown = (act: Activity) => {
    const oldOrder = act.order;
    const replacedAct = activities.find((item) => item.order === oldOrder + 1);
    if (replacedAct) {
      let updatedActivities = activities.filter(
        (item) => item.id !== act.id && item.id !== replacedAct.id
      );
      updatedActivities = [
        ...updatedActivities,
        { ...act, order: act.order + 1 },
        { ...replacedAct, order: replacedAct.order - 1 },
      ];
      dispatch(lessonActions.setActivity(updatedActivities));
      setSubmit(true);
    }
  };

  const updateActivitiesOrder = useCallback(() => {
    const applyData = (data: { message: string }) => {
      console.log(data.message);
      setIsLoading(false);
      setSuccess(true);
    };
    setIsLoading(true);
    sendRequest(
      {
        path: `/activity/reorder/${lessonId}`,
        method: "put",
        body: sortArray(activities, "order").map((item) => item.id),
      },
      applyData
    );
    setSubmit(false);
  }, [lessonId, activities, sendRequest]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (submit) {
      timer = setTimeout(() => {
        updateActivitiesOrder();
      }, autoSubmitTimer);
    }
    return () => clearTimeout(timer);
  }, [submit, updateActivitiesOrder]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (success) {
      timer = setTimeout(() => {
        setSuccess(false);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [success]);

  console.log({ activities });

  return (
    <>
      {activities && activities.length > 0 ? (
        <section className="mt-8 flex flex-col items-center">
          <ul className="w-full flex flex-col justify-center items-center">
            {sortArray(activities, "order").map((item) => (
              <li className="w-full mb-8" key={item.id}>
                <div className="flex justify-center items-center gap-x-8">
                  <span className="text-primary flex flex-col gap-y-2">
                    <button
                      className="btn btn-primary btn-sm btn-circle rounded-md btn-outline"
                      disabled={item.order === 0}
                      onClick={() => handleClickUp(item)}
                    >
                      <ChevronUp />
                    </button>
                    <button
                      className="btn btn-primary btn-sm btn-circle rounded-md btn-outline"
                      disabled={item.order === activities.length - 1}
                      onClick={() => handleClickDown(item)}
                    >
                      <ChevronDown />
                    </button>
                  </span>

                  <div className="w-full flex flex-col gap-y-2">
                    <Wrapper>
                      <span className="flex items-center gap-x-2">
                        <h2 className="font-bold text-md text-primary">
                          Activité n° {item.order + 1}
                        </h2>
                        {isLoading ? (
                          <Loader2 className="w-4 h-4 text-primary animate-spin" />
                        ) : null}
                        {success ? (
                          <CheckCircle className="w-4 h-4 text-success" />
                        ) : null}
                      </span>
                    </Wrapper>
                    <div className="w-full flex justify-center">
                      {item.type === "text" ? (
                        <BlogUpdate activity={item} />
                      ) : null}
                      {item.type === "video" ? <Video activity={item} /> : null}
                    </div>
                    {!blogEdition ? (
                      <ActionsButtonsGroup activity={item} />
                    ) : null}
                  </div>
                </div>
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
          leftLabel="Annuler"
          rightLabel="Confirmer"
        >
          <p>
            Attention l'activité et les ressources qui lui sont associées seront
            définitivement supprimées.
          </p>
        </Modal>
      ) : null}
    </>
  );
}
