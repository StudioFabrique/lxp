/* eslint-disable @typescript-eslint/no-explicit-any */

import { CheckCircle, Loader2 } from "lucide-react";
import ActivityTypes from "../../../components/edit-lesson.old/activity-types";
import DNDAcitivities from "../../../components/edit-lesson/dnd-activities";
import Wrapper from "../../../components/UI/wrapper/wrapper.component";
import useLessonHome from "./use-lesson-home";

export default function EditLessonHome() {
  const {
    isLoading,
    activities,
    setActivities,
    success,
    createActivity,
    setCreateActivity,
    handleChooseActivity,
    handleReorderActivities,
    handleDeleteActivity,
  } = useLessonHome();

  return (
    <div className="w-full">
      <section className="w-full flex flex-col gap-y-4 mb-4">
        <span className="w-full flex justify-between items-center">
          <div className="flex items-center gap-x-4">
            <h1 className="text-xl font-bold">Activités</h1>
            {isLoading ? (
              <Loader2 className="text-primary animate-spin" />
            ) : null}
            {success ? <CheckCircle className="text-success" /> : null}
          </div>
          <button
            className="btn btn-primary"
            onClick={() => setCreateActivity(true)}
            disabled={createActivity}
          >
            Ajouter une activité
          </button>
        </span>
      </section>

      <div
        className={`
          transform transition-all duration-300 ease-in-out
          ${createActivity ? "opacity-100 max-h-[500px] mb-4" : "opacity-0 max-h-0 overflow-hidden"}
        `}
      >
        <ActivityTypes onActivityType={handleChooseActivity} />
      </div>
      {activities.length > 0 ? (
        <DNDAcitivities
          activities={activities}
          setActivities={setActivities}
          onReorderActivities={handleReorderActivities}
          onDeleteActivity={handleDeleteActivity}
        />
      ) : (
        <Wrapper>
          <p>Aucune activités</p>
        </Wrapper>
      )}
    </div>
  );
}
