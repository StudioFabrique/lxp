import { useSelector } from "react-redux";
import Wrapper from "../../UI/wrapper/wrapper.component";
import Module from "../../../utils/interfaces/module";
import DatesSelecter from "../../UI/dates-selecter/dates-selecter.component";
import useInput from "../../../hooks/use-input";
import { regexGeneric } from "../../../utils/constantes";
import { useEffect, useRef } from "react";
import useHttp from "../../../hooks/use-http";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { autoSubmitTimer } from "../../../config/auto-submit-timer";
import { useDispatch } from "react-redux";
import { courseInfosAction } from "../../../store/redux-toolkit/course/course-infos";
import SubmitButton from "../../UI/submit-button";

const CourseCalendar = () => {
  const { courseId } = useParams();
  const dispatch = useDispatch();
  const { sendRequest, error } = useHttp();
  const module = useSelector(
    (state: any) => state.courseInfos.course.module
  ) as Module;
  const synchroneDuration = useSelector(
    (state: any) => state.courseInfos.course.synchroneDuration
  ) as number;
  const asynchroneDuration = useSelector(
    (state: any) => state.courseInfos.course.asynchroneDuration
  ) as number;
  const { value: synchrone } = useInput(
    (value) => regexGeneric.test(value),
    synchroneDuration.toString() ?? "0"
  );
  const { value: asynchrone } = useInput(
    (value) => regexGeneric.test(value),
    asynchroneDuration.toString() ?? "0"
  );
  const isInitialRender = useRef(true);

  const handleSubmitDate = () => {};

  /**
   * définit le style du champ formulaire en fonction de sa validité
   * @param hasError boolean
   * @returns string
   */
  const setInputStyle = (hasError: boolean) => {
    return hasError
      ? "flex-1 input input-error text-error input-sm input-bordered focus:outline-none w-full"
      : "flex-1 input input-sm input-bordered focus:outline-none w-full";
  };

  /**
   * soumet les durées du cours saisies par l'utilisateur à la base de données
   */
  useEffect(() => {
    let timer: any;
    if (!isInitialRender.current) {
      if (asynchrone.isValid && synchrone.isValid) {
        timer = setTimeout(() => {
          const applyData = (data: any) => {
            console.log(data);
            dispatch(courseInfosAction.setCourseDuration(data));
          };
          sendRequest(
            {
              path: `/course/duration/${courseId}`,
              method: "put",
              body: {
                synchroneDuration: synchrone.value,
                asynchroneDuration: asynchrone.value,
              },
            },
            applyData
          );
        }, autoSubmitTimer);
      }
    } else {
      isInitialRender.current = false;
    }
    return () => clearTimeout(timer);
  }, [
    courseId,
    synchrone.value,
    asynchrone.value,
    synchrone.isValid,
    asynchrone.isValid,
    sendRequest,
    dispatch,
  ]);

  // gère les erreurs HTTP
  useEffect(() => {
    if (error.length > 0) toast.error(error);
  }, [error]);

  return (
    <section className="w-full flex flex-col gap-y-8">
      <h2 className="text-3xl font-extrabold">Calendrier</h2>
      <p>{JSON.stringify(module)}</p>
      <article className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Wrapper>
          <h2 className="text-xl font-bold">Dates de cours *</h2>
          <form className="flex flex-col gap-y-8">
            <DatesSelecter
              startDateProp={module.minDate!}
              endDateProp={module.maxDate}
              onSubmitDates={handleSubmitDate}
            />
            <div>
              <SubmitButton
                label="Ajouter une plage"
                loadingLabel="Ajout en cours..."
                isLoading={false}
              />
            </div>
          </form>
        </Wrapper>
        <Wrapper>
          <h2 className="text-xl fontbold">Durée du cours</h2>
          <form className="flex flex-col gap-y-8">
            <div className="flex justify-between items-center gap-x-4">
              <label className="w-2/6" htmlFor="synchrone">
                Synchrone
              </label>
              <input
                className={setInputStyle(synchrone.hasError)}
                type="number"
                id="synchrone"
                name="synchrone"
                min={0}
                value={synchrone.value}
                onChange={synchrone.valueChangeHandler}
                onBlur={synchrone.valueBlurHandler}
              />
            </div>
            <div className="flex justify-between items-center gap-x-4">
              <label className="w-2/6" htmlFor="asynchrone">
                Asynchrone
              </label>
              <input
                className={setInputStyle(asynchrone.hasError)}
                type="number"
                id="asynchrone"
                name="asynchrone"
                min={0}
                value={asynchrone.value}
                onChange={asynchrone.valueChangeHandler}
                onBlur={asynchrone.valueBlurHandler}
              />
            </div>
          </form>
        </Wrapper>
      </article>
    </section>
  );
};

export default CourseCalendar;
