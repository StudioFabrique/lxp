/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCourseSelector, useCourseDispatch } from "../../../store/CourseContext";
import { useEffect, useState } from "react";
import useHttp from "../../../../../../src.legacy/hooks/use-http";
import toast from "react-hot-toast";
import { useParams } from "react-router";

import CourseDates from "../../../../../../src.legacy/utils/interfaces/course-dates";
import DatesList from "./dates-list";
import DatesForm from "./dates-form";
import setId from "../../../../../../src.legacy/helpers/set-id";
import Module from "../../../../../../src.legacy/utils/interfaces/module";

const CourseCalendar = () => {
  const dispatch = useCourseDispatch();
  const { courseId } = useParams();
  const { sendRequest, error } = useHttp();
  const module = useCourseSelector(
    (state) => state.course?.module,
  ) as Module;
  const dates = useCourseSelector(
    (state) => state.courseDates,
  ) as CourseDates[];
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log(module?.duration);
  }, [module]);

  const handleSubmitDates = (values: CourseDates) => {
    console.log(dates);

    if (!dates) {
      dispatch({ type: "SET_COURSE_DATES", payload: [] });
    }
    const tmpDates = { ...values, id: setId(dates) };
    setIsLoading(true);
    const applyData = () => {
      setIsLoading(false);
      dispatch({ type: "SET_COURSE_DATES", payload: [...dates, tmpDates] });
    };
    sendRequest(
      {
        path: `/course/dates/${courseId}`,
        method: "put",
        body: tmpDates,
      },
      applyData,
    );
  };

  const handleDeleteItem = (id: number) => {
    const applyData = () => {
      dispatch({ type: "DELETE_COURSE_DATES", payload: id });
    };
    sendRequest(
      {
        path: `/course/dates/${courseId}/${id}`,
        method: "delete",
      },
      applyData,
    );
  };

  useEffect(() => {
    const applyData = (data: { dates: CourseDates[] }) => {
      dispatch({ type: "SET_COURSE_DATES", payload: data.dates });
    };
    sendRequest(
      {
        path: `/course/dates/${courseId}`,
      },
      applyData,
    );
  }, [courseId, dispatch, sendRequest]);

  useEffect(() => {
    if (error.length > 0) {
      setIsLoading(false);
      toast.error(error);
    }
  }, [error]);

  return (
    <section className="w-full flex flex-col gap-y-8">
      <h2 className="text-3xl font-extrabold">Calendrier</h2>
      <article className="w-full flex flex-col gap-y-8">
        {module?.minDate && module?.maxDate ? (
          <DatesForm
            isLoading={isLoading}
            module={module}
            datesList={dates}
            onSubmitDates={handleSubmitDates}
          />
        ) : null}
        {dates && dates.length > 0 ? (
          <DatesList datesList={dates} onDeleteItem={handleDeleteItem} />
        ) : null}
      </article>
    </section>
  );
};

export default CourseCalendar;
