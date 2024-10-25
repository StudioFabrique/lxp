/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { autoSubmitTimer } from "../../../config/auto-submit-timer";
import { fromHtmlToMarkdown } from "../../../helpers/html-parser";
import useHttp from "../../../hooks/use-http";
import { lessonActions } from "../../../store/redux-toolkit/lesson/lesson";
import Activity from "../../../utils/interfaces/activity";
import { sortArray } from "../../../utils/sortArray";

const useActivity = () => {
  const { lessonId } = useParams();
  const { sendRequest, error } = useHttp();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [submit, setSubmit] = useState(false);
  const [success, setSuccess] = useState(false);

  const currentType = useSelector(
    (state: any) => state.lesson.currentType,
  ) as string;
  const activities = useSelector(
    (state: any) => state.lesson.lesson.activities,
  ) as Activity[];
  const activityToDelete = useSelector(
    (state: any) => state.lesson.activityToDelete,
  ) as Activity;
  const blogEdition = useSelector(
    (state: any) => state.lesson.blogEdition,
  ) as number;

  /**
   * soumet une nouvelle activité vers la base de données, sa propriété "order" est déterminée en fonction de son placement dans la liste
   * une nouvelle activité est tjrs placée en fin de liste par défaut, donc son "order" est égal à la longueur du tableau
   * @param value tout ce qui est nécessaire pour créer une activité
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
        applyData,
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
      applyData,
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

  /**
   * Déplace une activité vers le haut dans la liste en échangeant son ordre avec l'activité précédente
   */
  const handleClickUp = (act: Activity) => {
    const updatedActivities = activities.map((item) => {
      if (item.order === act.order) {
        return { ...item, order: item.order - 1 };
      }
      if (item.order === act.order - 1) {
        return { ...item, order: act.order };
      } else {
        return item;
      }
    });
    dispatch(lessonActions.setActivity(updatedActivities));
    setSubmit(true);
  };

  /**
   * Déplace une activité vers le bas dans la liste en échangeant son ordre avec l'activité suivante
   * @param act L'activité à déplacer vers le bas
   */
  const handleClickDown = (act: Activity) => {
    const updatedActivities = activities.map((item) => {
      if (item.order === act.order) {
        return { ...item, order: item.order + 1 };
      }
      if (item.order === act.order + 1) {
        return { ...item, order: act.order };
      } else {
        return item;
      }
    });
    dispatch(lessonActions.setActivity(updatedActivities));
    setSubmit(true);
  };

  /**
   * Met à jour l'ordre des activités dans la base de données
   */
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
      applyData,
    );
    setSubmit(false);
  }, [lessonId, activities, sendRequest]);

  /**
   * Effet de bord qui déclenche la mise à jour de l'ordre des activités
   * après un délai quand submit est true
   */
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (submit) {
      timer = setTimeout(() => {
        updateActivitiesOrder();
      }, autoSubmitTimer);
    }
    return () => clearTimeout(timer);
  }, [submit, updateActivitiesOrder]);

  /**
   * Effet de bord qui réinitialise l'état success après 3 secondes
   */
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (success) {
      timer = setTimeout(() => {
        setSuccess(false);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [success]);

  return {
    isLoading,
    currentType,
    activities,
    activityToDelete,
    blogEdition,
    handleSubmit,
    handleSelectActivityType,
    handleDeleteActivity,
    handleCancelDeletion,
    handleClickUp,
    handleClickDown,
    success,
  };
};

export default useActivity;
