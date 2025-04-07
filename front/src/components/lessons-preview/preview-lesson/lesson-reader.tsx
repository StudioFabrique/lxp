import { Link } from "react-router-dom";
import Lesson from "../../../utils/interfaces/lesson";
import RatingPanelButton from "../../UI/lesson-rating/rating-panel-button";
import ActivityPreview from "./activity";
import { PropsWithChildren } from "react";
import { LucidePlus } from "lucide-react";
import Can from "../../UI/can/can.component";
import NoActivityPlaceholder from "./no-activity-placeholder";

type PreviewLessonProps = {
  selectedLesson: Lesson;
  currentLessonRating?: number;
  isLessonAlreadyCompleted: boolean;
  onRateContent: (rating: number) => void;
  // Vérifie s'il y a des activités dans la leçon
  lessonHasActivities: boolean;
};

// Composant pour prévisualiser une leçon avec ses activités
const LessonReader = ({
  selectedLesson,
  currentLessonRating,
  onRateContent,
  lessonHasActivities,
  children,
}: PropsWithChildren<PreviewLessonProps>) => (
  <div className="flex flex-col gap-4">
    <div className="w-full flex justify-between items-center">
      <h1 className="text-2xl font-bold text-primary">
        {selectedLesson.title}
      </h1>
      {/* Bouton de notation */}
      {currentLessonRating && lessonHasActivities ? (
        <RatingPanelButton
          note={currentLessonRating}
          onRateContent={onRateContent}
        />
      ) : null}
    </div>

    {/* Affiche les activités si elles existent, sinon affiche un message */}
    {lessonHasActivities ? (
      selectedLesson.activities?.map((activity) => (
        <ActivityPreview
          key={activity.id}
          lessonId={selectedLesson.id ?? 0}
          activity={activity}
        />
      ))
    ) : (
      <NoActivityPlaceholder></NoActivityPlaceholder>
    )}

    <Can action="write" object="lesson">
      <div className="bg-secondary/5 p-10 rounded-lg flex justify-center">
        <div className="flex flex-col items-center group w-fit">
          <div className="btn btn-primary text-base-100 group-hover:opacity-0">
            <LucidePlus />
            Ajouter une activité
          </div>
          <div className="absolute flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Link
              to={`/admin/lesson/edit/${selectedLesson.id}?type=text`}
              className="btn btn-primary text-base-100"
            >
              Texte
            </Link>
            <Link
              to={`/admin/lesson/edit/${selectedLesson.id}?type=video`}
              className="btn btn-primary text-base-100"
            >
              Vidéo
            </Link>
            <Link
              to={`/admin/lesson/edit/${selectedLesson.id}?type=image`}
              className="btn btn-primary text-base-100"
            >
              Image
            </Link>
            <Link
              to={`/admin/lesson/edit/${selectedLesson.id}?type=resource`}
              className="btn btn-primary text-base-100"
            >
              Fichier
            </Link>
          </div>
        </div>
      </div>
    </Can>

    {/* Boutons de navigation */}
    <div className="flex justify-end items-center my-5">{children}</div>
  </div>
);

export default LessonReader;
