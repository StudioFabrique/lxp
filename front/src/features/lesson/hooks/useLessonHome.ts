import { useState, useCallback, useEffect } from "react";
import toast from "react-hot-toast";
import { useLessonSelector } from "../store/LessonContext";
import useHttp from "../../../../src/hooks/useHttp";
import type { Activity } from "../../../../src/utils/interfaces/activity";
import type Lesson from "../../../../src/utils/interfaces/lesson";
import { useSearchParams } from "react-router";

const useLessonHome = () => {
  const { sendRequest, isLoading } = useHttp();
  const lesson = useLessonSelector((state) => state.lesson);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [success, setSuccess] = useState(false);
  const [activityType, setActivityType] = useState("");
  const [createActivity, setCreateActivity] = useState(false);
  const [searchParams] = useSearchParams();

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
    if (!lesson) return;
    sendRequest(
      {
        path: `/activity/reorder/${lesson.id}`,
        method: "put",
        body: { activitiesIds },
      },
      applyData,
    );
  };

  const handleDeleteActivity = (activityId: number) => {
    const activity = activities.find((item) => item.id === activityId);
    if (!activity) return;
    const applyData = (data: { message: string }) => {
      toast.success(data.message);
      getActivities();
    };
    sendRequest(
      {
        path: `/activity/${activity.type}/${activityId}/lesson`,
        method: "delete",
      },
      applyData,
    );
  };

  const handleSubmit = (type: string, data: any) => {
    if (type === "text") {
      handleSubmitBlog(data);
    }
    if (type === "video") {
      handleSubmitVideo(data);
    }

    getActivities();
    setCreateActivity(false);
    setActivityType("");
  };

  const handleSubmitBlog = (data: {
    description: string;
    value: string;
    title: string;
    type: string;
  }) => {
    const applyData = (data: any) => {
      toast.success(data.message);
    };
    if (!lesson) return;
    sendRequest(
      {
        path: `/activity/${lesson.id}`,
        method: "post",
        body: {
          description: data.description,
          value: data.value,
          title: data.title,
          type: data.type,
        },
      },
      applyData,
    );
  };

  const handleSubmitVideo = (value: {
    title: string;
    description: string | null;
    videoValue: string;
    fileValue: File | null;
  }) => {
    const fd = new FormData();
    fd.append(
      "data",
      JSON.stringify({
        title: value.title,
        description: value.description ?? "",
        url: value.fileValue ? "" : value.videoValue,
      }),
    );
    if (value.fileValue) {
      fd.append("video", value.fileValue);
    }
    const applyData = (data: {
      success: boolean;
      message: string;
      response: Activity;
    }) => {
      if (data.success) {
        toast.success(data.message);
      }
    };
    if (!lesson) return;
    sendRequest(
      {
        path: `/activity/video/${lesson.id}`,
        method: "post",
        body: fd,
      },
      applyData,
    );
  };

  const onFinish = () => {
    getActivities();
    setCreateActivity(false);
    setActivityType("");
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

  useEffect(() => {
    if (activityType.length === 0) {
      getActivities();
    }
  }, [activityType, getActivities]);

  useEffect(() => {
    const type = searchParams.get("type");
    if (type) {
      setActivityType(type);
    }
  }, [searchParams]);

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
    onFinish,
  };
};

export default useLessonHome;
