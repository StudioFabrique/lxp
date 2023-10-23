import { useSelector } from "react-redux";
import Module from "../../../utils/interfaces/module";
import useInput from "../../../hooks/use-input";
import { regexGeneric } from "../../../utils/constantes";
import { useCallback, useEffect, useRef } from "react";
import useHttp from "../../../hooks/use-http";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { autoSubmitTimer } from "../../../config/auto-submit-timer";
import { useDispatch } from "react-redux";
import { courseInfosAction } from "../../../store/redux-toolkit/course/course-infos";
import CourseDates from "../../../utils/interfaces/course-dates";
import DatesList from "./dates-list";
import DatesItem from "./dates-item";

const CourseCalendar = () => {
  const { courseId } = useParams();
  const dispatch = useDispatch();
  const currentDates = useSelector(
    (state: any) => state.courseDates.currentDates
  ) as CourseDates;
  const { sendRequest, error } = useHttp();
  const dates = useSelector(
    (state: any) => state.courseInfos.course.dates
  ) as CourseDates[];
  const isInitialRender = useRef(true);

  const handleSubmitDates = useCallback(
    (dates: {
      startDate: string;
      endDate: string;
      synchroneDuration: number;
      asynchroneDuration: number;
    }) => {
      const applyData = (data: {
        minDate: string;
        maxDate: string;
        synchroneDuration: number;
        asynchroneDuration: number;
      }) => {
        console.log({ data });
      };
      sendRequest(
        {
          path: `/course/dates/${courseId}`,
          method: "put",
          body: {
            minDate: dates.startDate,
            maxDate: dates.endDate,
            synchroneDuration: dates.synchroneDuration,
            asynchroneDuration: dates.asynchroneDuration,
          },
        },
        applyData
      );
    },
    [courseId, sendRequest]
  );

  // gère les erreurs HTTP
  useEffect(() => {
    if (error.length > 0) toast.error(error);
  }, [error]);

  return (
    <section className="w-full flex flex-col gap-y-8">
      <h2 className="text-3xl font-extrabold">Calendrier</h2>
      <article className="w-full flex flex-col gap-y-8">
        <DatesList datesList={dates} />
        <DatesItem onSubmitDates={handleSubmitDates} />
      </article>
    </section>
  );
};

export default CourseCalendar;
