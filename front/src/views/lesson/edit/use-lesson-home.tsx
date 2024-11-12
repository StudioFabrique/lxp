/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback, useEffect } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import useHttp from "../../../hooks/use-http";
import Activity from "../../../utils/interfaces/activity";
import Lesson from "../../../utils/interfaces/lesson";

/**
 * Hook personnalisé pour gérer la logique de la page d'accueil des leçons
 * Gère les activités, leur réorganisation et leur suppression
 */
const useLessonHome = () => {
  const { sendRequest, isLoading } = useHttp();
  const lesson = useSelector((state: any) => state.lesson.lesson);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [success, setSuccess] = useState(false);
  const [activityType, setActivityType] = useState("");
  const [createActivity, setCreateActivity] = useState(false);

  /**
   * Récupère la liste des activités pour une leçon donnée
   */
  const getActivities = useCallback(() => {
    const applyData = (data: Lesson) => {
      setActivities(data.activities!);
    };
    if (lesson) {
      sendRequest({ path: `/lesson/${lesson.id}` }, applyData);
    }
  }, [lesson, sendRequest]);

  /**
   * Gère la réorganisation des activités
   * @param activitiesIds Tableau des IDs des activités dans leur nouvel ordre
   */
  const handleReorderActivities = (activitiesIds: number[]) => {
    const applyData = (data: { success: boolean; message: string }) => {
      if (data.success) {
        console.log(data);
        setSuccess(true);
        toast.success(data.message);
      }
    };
    sendRequest(
      {
        path: `/activity/reorder/${lesson.id}`,
        method: "put",
        body: activitiesIds,
      },
      applyData
    );
  };

  /**
   * Supprime une activité spécifique
   * @param activityId ID de l'activité à supprimer
   */
  const handleDeleteActivity = (activityId: number) => {
    const applyData = (data: { message: string }) => {
      toast.success(data.message);
      getActivities();
    };
    sendRequest(
      { path: `/activity/${activityId}`, method: "delete" },
      applyData
    );
  };

  const handleSubmit = (
    description: string,
    value: string,
    title: string,
    type: string
  ) => {
    console.log(value);
    const applyData = (data: any) => {
      toast.success(data.message);
      getActivities();
      setCreateActivity(false);
      setActivityType("");
    };
    sendRequest(
      {
        path: `/activity/${lesson.id}`,
        method: "post",
        body: { description, value, title, type },
      },
      applyData
    );
  };

  // Charge les activités au montage du composant ou quand la leçon change
  useEffect(() => {
    getActivities();
  }, [getActivities]);

  // Gère le message de succès qui disparaît après 5 secondes
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (success) {
      timer = setTimeout(() => setSuccess(false), 5000);
    }
    return () => clearTimeout(timer);
  }, [success]);

  return {
    isLoading,
    activities,
    activityType,
    setActivities,
    success,
    createActivity,
    setCreateActivity,
    setActivityType,
    handleReorderActivities,
    handleDeleteActivity,
    handleSubmit,
  };
};

export default useLessonHome;
