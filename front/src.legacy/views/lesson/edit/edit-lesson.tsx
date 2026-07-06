import { useRef } from "react";
import LessonForm from "../../../components/edit-course/scenario/lesson-form";
import useEditLesson from "../../../hooks/use-edit-lesson";
import Wrapper from "../../../components/UI/wrapper/wrapper.component";
import { Loader2 } from "lucide-react";

/**
 * EditLesson Component
 * Composant permettant l'édition d'une leçon existante
 */
function EditLesson() {
  // Référence vers le formulaire pour accès direct au DOM si nécessaire
  const formRef = useRef<HTMLInputElement>(null);

  // Récupération des props et fonctions du hook personnalisé useEditLesson
  const {
    lesson, // Données de la leçon
    isLoading, // État de chargement
    title, // Titre de la leçon
    description, // Description de la leçon
    mode, // Mode de la leçon
    setMode, // Fonction pour modifier le mode
    tag, // Tag sélectionné
    setTag, // Fonction pour modifier le tag
    tagsList, // Liste des tags disponibles
    setLessonValues, // Fonction pour réinitialiser les valeurs
    handleUpdateLesson, // Fonction de mise à jour de la leçon
  } = useEditLesson();

  return (
    <main className="w-full p-2">
      {/* En-tête de la page */}
      <section className="w-full flex flex-col gap-y-4 mb-4">
        <article className="w-full flex justify-between items-center">
          <div className="flex items-center gap-x-4">
            <h1 className="text-xl font-bold">Mise à jour de la leçon</h1>
          </div>
        </article>
      </section>

      {/* Formulaire d'édition */}
      <section className="w-full">
        {/* Affichage conditionnel du formulaire si la leçon est chargée */}
        {lesson ? (
          <Wrapper>
            <LessonForm
              ref={formRef}
              title={title}
              description={description}
              mode={mode}
              tag={tag}
              isLoading={isLoading}
              onSetTag={setTag}
              tags={tagsList}
              onSetMode={setMode}
              onSubmitLesson={() => {}}
            >
              {/* Boutons d'actions */}
              <div className="flex justify-end items-center gap-x-4">
                {/* Bouton de réinitialisation */}
                <button
                  className="btn btn-secondary"
                  onClick={() => setLessonValues(lesson)}
                >
                  Réinitialiser
                </button>
                {/* Bouton de mise à jour avec indicateur de chargement */}
                <button
                  className="btn btn-primary flex items-center gap-x-2"
                  onClick={handleUpdateLesson}
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="animate spin" /> : null}
                  Mettre à jour la leçon
                </button>
              </div>
            </LessonForm>
          </Wrapper>
        ) : null}
      </section>
    </main>
  );
}

export default EditLesson;
