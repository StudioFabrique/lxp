// Imports des composants UI réutilisables
import FadeWrapper from "../../../components/UI/fade-wrapper/fade-wrapper";
import Header from "../../../components/UI/header";
import Wrapper from "../../../components/UI/wrapper/wrapper.component";
import bgImage from "../../../assets/images/chaton.jpg";

// Import du hook personnalisé pour la gestion de l'état
import useAddLesson from "./use-add-lesson";

// Imports des composants spécifiques à l'ajout de leçon
import LessonForm from "../../../components/edit-course/scenario/lesson-form";
import CourseSelecters from "../../../components/add-lesson/course-selecters";
import NewLessonActions from "../../../components/add-lesson/new-lesson-actions";
import bgImageGradient from "../../../utils/bg-image-gradient";

/**
 * Composant principal pour l'ajout d'une nouvelle leçon
 * Gère l'affichage du formulaire en deux étapes :
 * 1. Sélection du parcours/module/cours
 * 2. Saisie des informations de la leçon
 */
function AddNewLesson() {
  // Récupération des états et fonctions depuis le hook personnalisé
  const {
    parcoursList,
    parcoursId,
    modulesList,
    moduleId,
    courseList,
    courseId,
    setParcoursId,
    setModuleId,
    setCourseId,
    title,
    description,
    tag,
    tags,
    setTag,
    mode,
    setMode,
    handleSubmitLesson,
    getItem,
    handleResetForm,
    handleStep,
    nextClicked,
    isLoading,
  } = useAddLesson();

  // Configuration du style pour l'image de fond
  const classImage: React.CSSProperties = {
    backgroundImage: bgImageGradient(bgImage),
    width: "100%",
    minHeight: "30rem",
    maxHeight: "30rem",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    borderRadius: "0.75rem",
  };

  return (
    <FadeWrapper>
      {/* En-tête de la page */}
      <div className="w-full">
        <Header
          title="Créer une leçon"
          description="Créer une nouvelle leçon associée à un cours"
        />
      </div>

      {/* Contenu principal en deux colonnes */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-16 mx-auto my-16">
        <div className="flex flex-col gap-y-8">
          {/* Affichage conditionnel basé sur l'étape du formulaire */}
          {!nextClicked ? (
            // Étape 1 : Sélection du parcours/module/cours
            <CourseSelecters
              parcoursList={parcoursList}
              modulesList={modulesList}
              courseList={courseList}
              parcoursId={parcoursId}
              moduleId={moduleId}
              courseId={courseId}
              handleStep={handleStep}
              getItem={getItem}
              setParcoursId={setParcoursId}
              setModuleId={setModuleId}
              setCourseId={setCourseId}
            />
          ) : (
            // Étape 2 : Formulaire de création de leçon
            <Wrapper>
              <LessonForm
                title={title}
                description={description}
                tag={tag}
                tags={tags!}
                mode={mode}
                onSetTag={setTag}
                onSetMode={setMode}
                isLoading={isLoading}
                onSubmitLesson={handleSubmitLesson}
              >
                <NewLessonActions
                  isLoading={false}
                  handleResetForm={handleResetForm}
                  handleStep={handleStep}
                />
              </LessonForm>
            </Wrapper>
          )}
        </div>
        {/* Image décorative */}
        <div style={classImage} />
      </div>
    </FadeWrapper>
  );
}

export default AddNewLesson;
