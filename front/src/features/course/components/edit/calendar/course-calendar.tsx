/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCourseSelector, useCourseDispatch } from "../../../store/CourseContext";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useParams } from "react-router";

import CourseDates from "../../../../../../src/utils/interfaces/course-dates";
import DatesList from "./dates-list";
import DatesForm from "./dates-form";
import setId from "../../../../../utils/helpers/set-id";
import Module from "../../../../../../src/utils/interfaces/module";
import { courseApi } from "../../../api/course.api";

const CourseCalendar = () => {
  const dispatch = useCourseDispatch();
  const { courseId } = useParams();
  const module = useCourseSelector(
    (state) => state.course?.module,
  ) as Module;
  const dates = useCourseSelector(
    (state) => state.courseDates,
  ) as CourseDates[];
  const [isLoading, setIsLoading] = useState(false);

  const { data: datesData, error } = useQuery({
    ...courseApi.queries.dates(courseId!),
    enabled: !!courseId,
  });

  useEffect(() => {
    if (datesData) {
      dispatch({ type: "SET_COURSE_DATES", payload: datesData.dates });
    }
  }, [datesData, dispatch]);

  useEffect(() => {
    console.log(module?.duration);
  }, [module]);

  const handleSubmitDates = async (values: CourseDates) => {
    console.log(dates);

    if (!dates) {
      dispatch({ type: "SET_COURSE_DATES", payload: [] });
    }
    const tmpDates = { ...values, id: setId(dates) };
    setIsLoading(true);
    try {
      await courseApi.mutations.addDate(courseId!, tmpDates);
      dispatch({ type: "SET_COURSE_DATES", payload: [...dates, tmpDates] });
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Erreur inconnue");
    }
    setIsLoading(false);
  };

  const handleDeleteItem = async (id: number) => {
    try {
      await courseApi.mutations.deleteDate(courseId!, id);
      dispatch({ type: "DELETE_COURSE_DATES", payload: id });
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Erreur inconnue");
    }
  };

  useEffect(() => {
    if (error) {
      setIsLoading(false);
      toast.error((error as any)?.message ?? "Erreur inconnue");
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
