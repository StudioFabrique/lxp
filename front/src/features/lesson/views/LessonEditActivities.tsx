import Wrapper from "../../../../src/components/wrappers/BoxWrapper";
import useLessonHome from "../hooks/useLessonHome";
import ActivityTypes from "../components/edit/activity-types";
import DNDAcitivities from "../components/edit/activities/dnd-activities";
import CurrentBlock from "../components/edit/current-block";
import ElementNotFound from "../../../components/UI/element-not-found";
import Header from "../../../../src/components/headers/Header";

export default function EditLessonHome() {
  const {
    activities,
    activityType,
    setActivities,
    createActivity,
    setCreateActivity,
    setActivityType,
    handleReorderActivities,
    handleDeleteActivity,
    onFinish,
  } = useLessonHome();

  return (
    <main className="w-full flex flex-col gap-y-6">
      <section className="w-full flex flex-col gap-y-4">
        <Header title="Activités" description="Ajouter et éditer des activités">
          <button
            className="btn btn-primary text-base-100"
            onClick={() => setCreateActivity((prevState) => !prevState)}
            disabled={createActivity && activityType.length > 0}
          >
            {createActivity ? "Annuler" : "Ajouter une activité"}
          </button>
        </Header>

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
          <CurrentBlock activityType={activityType} onFinish={onFinish} />
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
              <ElementNotFound message="Aucune activité trouvée." />
            </Wrapper>
          )}
        </article>
      )}
    </main>
  );
}
