/* eslint-disable @typescript-eslint/no-explicit-any */

// Import des composants et icônes nécessaires
import Wrapper from "../../../components/UI/wrapper/wrapper.component";
import useLessonHome from "./use-lesson-home";
import ActivityTypes from "../../../components/edit-lesson/activity-types";
import DNDAcitivities from "../../../components/edit-lesson/activities/dnd-activities";
import CurrentBlock from "../../../components/edit-lesson/current-block";
import ElementNotFound from "../../../components/UI/element-not-found";
import Header from "../../../components/UI/header";

export default function EditLessonHome() {
  // Récupération des props et méthodes depuis le hook personnalisé useLessonHome
  const {
    // isLoading,
    activities,
    activityType,
    setActivities,
    // success,
    createActivity,
    setCreateActivity,
    setActivityType,
    handleReorderActivities,
    handleDeleteActivity,
    onFinish,
  } = useLessonHome();

  return (
    <main className="w-full flex flex-col gap-y-6">
      {/* En-tête avec titre et bouton d'ajout d'activité */}
      <section className="w-full flex flex-col gap-y-4">
        <Header title="Activités" description="Ajouter et éditer des activités">
          <button
            className="btn btn-primary text-neutral-content"
            onClick={() => setCreateActivity((prevState) => !prevState)}
            disabled={createActivity && activityType.length > 0}
          >
            {createActivity ? "Annuler" : "Ajouter une activité"}
          </button>
        </Header>

        {/* Affichage des types d'activités disponibles lors de la création */}
        {createActivity && activityType.length === 0 ? (
          <article>
            <ActivityTypes onActivityType={setActivityType} />
          </article>
        ) : null}
      </section>

      {/* Zone principale de contenu */}
      {activityType.length !== 0 ? (
        // Affichage du bloc d'édition de l'activité sélectionnée
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
        // Affichage de la liste des activités existantes
        <article>
          {activities.length > 0 ? (
            <DNDAcitivities
              activities={activities}
              setActivities={setActivities}
              onReorderActivities={handleReorderActivities}
              onDeleteActivity={handleDeleteActivity}
            />
          ) : (
            // Message affiché quand il n'y a pas d'activités
            <Wrapper>
              <ElementNotFound message="Aucune activité trouvée." />
            </Wrapper>
          )}
        </article>
      )}
    </main>
  );
}
