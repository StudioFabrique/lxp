import { useState, useCallback, useEffect } from "react";
import toast from "react-hot-toast";
import { useLessonSelector } from "../store/LessonContext";
import { lessonApi } from "../api/lesson.api";
import type { Activity } from "../../../../src/utils/interfaces/activity";
import type Lesson from "../../../../src/utils/interfaces/lesson";
import { useSearchParams } from "react-router";

const useLessonHome = () => {
  const lesson = useLessonSelector((state) => state.lesson);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [activityType, setActivityType] = useState("");
  const [createActivity, setCreateActivity] = useState(false);
  const [searchParams] = useSearchParams();

  const getActivities = useCallback(() => {
    if (lesson) {
      setIsLoading(true);
      lessonApi.queries
        .getLessonById(lesson.id!)
        .then((data: Lesson) => {
          setActivities(data.activities!);
        })
        .finally(() => setIsLoading(false));
    }
  }, [lesson]);

  const handleReorderActivities = (activitiesIds: number[]) => {
    if (!lesson) return;
    lessonApi.mutations
      .reorderActivities(lesson.id!, activitiesIds)
      .then((data) => {
        if (data.success) {
          setSuccess(true);
          toast.success(data.message);
        }
      });
  };

  const handleDeleteActivity = (activityId: number) => {
    const activity = activities.find((item) => item.id === activityId);
    if (!activity) return;
    lessonApi.mutations
      .deleteActivity(activity.type, activityId)
      .then((data) => {
        toast.success(data.message);
        getActivities();
      });
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
    if (!lesson) return;
    lessonApi.mutations
      .createBlogActivity(lesson.id!, {
        description: data.description,
        value: data.value,
        title: data.title,
        type: data.type,
      })
      .then((data: any) => {
        toast.success(data.message);
      });
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
    if (!lesson) return;
    lessonApi.mutations
      .upsertVideoActivity(lesson.id!, fd, "post")
      .then((data) => {
        if (data.success) {
          toast.success(data.message);
        }
      });
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
