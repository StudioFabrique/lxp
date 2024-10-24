import { useState, useCallback, useEffect } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useHttp from "../../../hooks/use-http";
import Activity from "../../../utils/interfaces/activity";
import Lesson from "../../../utils/interfaces/lesson";

const useLessonHome = () => {
  const { sendRequest, error, isLoading } = useHttp();
  const lesson = useSelector((state: RootState) => state.lesson.lesson);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [success, setSuccess] = useState(false);

  const [createActivity, setCreateActivity] = useState(false);
  const nav = useNavigate();

  const handleChooseActivity = (activityType: string) => {
    if (!lesson?.id) return;

    switch (activityType) {
      case "text":
        nav(`/admin/lesson/edit/${lesson.id}/blog`);
        break;
      default:
        console.warn(`Activity type '${activityType}' not implemented`);
        break;
    }
  };

  const getActivities = useCallback(() => {
    const applyData = (data: Lesson) => {
      setActivities(data.activities!);
    };
    if (lesson) {
      sendRequest({ path: `/lesson/${lesson.id}` }, applyData);
    }
  }, [lesson, sendRequest]);

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
      applyData,
    );
  };

  const handleDeleteActivity = (activityId: number) => {
    const applyData = (data: { message: string }) => {
      toast.success(data.message);
      getActivities();
    };
    sendRequest(
      { path: `/activity/${activityId}`, method: "delete" },
      applyData,
    );
  };

  useEffect(() => {
    getActivities();
  }, [getActivities]);

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
    setActivities,
    success,
    createActivity,
    setCreateActivity,
    handleChooseActivity,
    handleReorderActivities,
    handleDeleteActivity,
  };
};

export default useLessonHome;
