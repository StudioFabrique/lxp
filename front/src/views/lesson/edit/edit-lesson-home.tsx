import { useState } from "react";
import { useSelector } from "react-redux";
import ActivityTypes from "../../../components/edit-lesson/activity-types";
import Wrapper from "../../../components/UI/wrapper/wrapper.component";
import useHttp from "../../../hooks/use-http";
import Lesson from "../../../utils/interfaces/lesson";
import { useNavigate } from "react-router-dom";

export default function EditLessonHome() {
  const { sendRequest, error } = useHttp();
  const lesson = useSelector(
    (state: { lesson: Lesson | null }) => state.lesson,
  );
  const [createActivity, setCreateActivity] = useState(false);
  const nav = useNavigate();

  const handleChooseActivity = (activityType: number) => {
    switch (activityType) {
      case 1:
        nav("/adminlesson/edit/blog");
        break;
      default:
        break;
    }
  };

  return (
    <>
      <section className="w-full flex flex-col gap-y-4">
        <span className="w-full flex justify-between items-center">
          <h1 className="text-xl font-bold">Activités</h1>
          <button
            className="btn btn-primary"
            onClick={() => setCreateActivity(true)}
          >
            Ajouter une activité
          </button>
        </span>
      </section>

      {/* Conteneur avec animation pour ActivityTypes */}
      <div
        className={`
        transform transition-all duration-300 ease-in-out
        ${
          createActivity
            ? "opacity-100 max-h-[500px] mt-4"
            : "opacity-0 max-h-0"
        }
      `}
      >
        <ActivityTypes onActivityType={handleChooseActivity} />
      </div>

      {/* Wrapper avec animation */}
      <div
        className={`
        transform transition-all duration-300 ease-in-out
        ${createActivity ? "translate-y-4" : "translate-y-0"}
      `}
      >
        {lesson && lesson.activities ? (
          <p>liste activités</p>
        ) : (
          <Wrapper>Aucune activité n'est enregistrée pour cette leçon.</Wrapper>
        )}
      </div>
    </>
  );
}
