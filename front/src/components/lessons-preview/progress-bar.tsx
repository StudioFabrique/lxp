import { PlaneLandingIcon, PlaneTakeoffIcon } from "lucide-react";
import Course from "../../utils/interfaces/course";

type ProgressBarProps = {
  courses: Course[];
};

// Composant de barre de progression qui affiche l'avancement dans les cours
const ProgressBar = ({ courses }: ProgressBarProps) => {
  // Retourne un rendu de composant null si aucun cours n'est présent
  if (!(courses.length > 0)) return null;

  return (
    // Conteneur principal avec style responsive
    <div className="flex max-xl:hidden items-center gap-4 bg-secondary/20 rounded-xl p-4">
      <span>
        <PlaneTakeoffIcon className="w-10 h-10 stroke-1" />
      </span>
      {/* Itération sur chaque cours pour afficher sa progression */}
      {courses.map((course) => (
        <div
          key={course.id}
          className="bg-secondary/20 h-[80%] w-full rounded-lg"
        >
          <div className="flex gap-x-2 h-full items-center px-2">
            {/* Affichage des leçons avec indicateur de progression */}
            {course.lessons.map((lesson) => (
              <span
                key={lesson.id}
                className={`h-[70%] w-full  ${
                  lesson.lessonsRead && lesson.lessonsRead?.length > 0
                    ? "bg-primary"
                    : "bg-primary/20"
                }`}
              ></span>
            ))}
          </div>
        </div>
      ))}
      <span>
        <PlaneLandingIcon className="w-10 h-10 stroke-1" />
      </span>
    </div>
  );
};

export default ProgressBar;
