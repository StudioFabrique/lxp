import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import useHttp from "../../../hooks/use-http";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";

import CourseDates from "../../../utils/interfaces/course-dates";
import DatesList from "./dates-list";
import { courseDatesActions } from "../../../store/redux-toolkit/course/course-dates";
import DatesForm from "./dates-form";
import setId from "../../../helpers/set-id";

const CourseCalendar = () => {
  const dispatch = useDispatch();
  const { courseId } = useParams();
  const { sendRequest, error } = useHttp();
  const dates = useSelector(
    (state: any) => state.courseDates.courseDates
  ) as CourseDates[];
  const [isLoading, setIsLoading] = useState(false);

  /**
   * enregistre une nouvelle plage de dates dans la bdd
   * @param values CourseDates
   */
  const handleSubmitDates = (values: CourseDates) => {
    console.log(dates);

    if (!dates) {
      dispatch(courseDatesActions.setCourseDates([]));
    }
    const tmpDates = { ...values, id: setId(dates) };
    setIsLoading(true);
    const applyData = (_data: any) => {
      setIsLoading(false);
      dispatch(courseDatesActions.setCourseDates([...dates, tmpDates]));
    };
    sendRequest(
      {
        path: `/course/dates/${courseId}`,
        method: "put",
        body: tmpDates,
      },
      applyData
    );
  };

  /**
   * efface une plage de dates de la bdd
   * @param id number
   */
  const handleDeleteItem = (id: number) => {
    const applyData = (data: { success: boolean; message: string }) => {
      dispatch(courseDatesActions.deleteCourseDates(id));
    };
    sendRequest(
      {
        path: `/course/dates/${courseId}/${id}`,
        method: "delete",
      },
      applyData
    );
  };

  /**
   * retourne la liste des plages de dates associées à un cours
   * et la stock dans redux
   */
  useEffect(() => {
    const applyData = (data: { dates: CourseDates[] }) => {
      dispatch(courseDatesActions.setCourseDates(data.dates));
    };
    sendRequest(
      {
        path: `/course/dates/${courseId}`,
      },
      applyData
    );
  }, [courseId, dispatch, sendRequest]);

  // gère les erreurs HTTP
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
        <DatesForm isLoading={isLoading} onSubmitDates={handleSubmitDates} />
        {dates && dates.length > 0 ? (
          <DatesList datesList={dates} onDeleteItem={handleDeleteItem} />
        ) : null}
      </article>
    </section>
  );
};

export default CourseCalendar;
