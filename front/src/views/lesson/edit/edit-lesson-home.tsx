/* eslint-disable @typescript-eslint/no-explicit-any */

import { CheckCircle, Loader2 } from "lucide-react";
import Wrapper from "../../../components/UI/wrapper/wrapper.component";
import useLessonHome from "./use-lesson-home";
import ActivityTypes from "../../../components/edit-lesson/activity-types";
import DNDAcitivities from "../../../components/edit-lesson/activities/dnd-activities";
import CurrentBlock from "../../../components/edit-lesson/current-block";

export default function EditLessonHome() {
  const {
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
  } = useLessonHome();

  return (
    <main className="w-full">
      <section className="w-full flex flex-col gap-y-4 mb-4">
        <article className="w-full flex justify-between items-center">
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
        </article>

        {createActivity && activityType.length === 0 ? (
          <article>
            <ActivityTypes onActivityType={setActivityType} />
          </article>
        ) : null}
      </section>

      {activityType.length !== 0 ? (
        <article
          className={`
            transition-opacity duration-300
            ${
              activityType.length !== 0
                ? "opacity-100"
                : "opacity-0 pointer-events-none"
            }
          `}
        >
          <CurrentBlock
            setActivityType={setActivityType}
            activityType={activityType}
          />
        </article>
      ) : (
        <article>
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
        </article>
      )}
    </main>
  );
}
