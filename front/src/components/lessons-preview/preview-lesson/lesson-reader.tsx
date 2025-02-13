import { Link } from "react-router-dom";
import Lesson from "../../../utils/interfaces/lesson";
import RatingPanelButton from "../../UI/lesson-rating/rating-panel-button";
import ActivityPreview from "./activity";
import { PropsWithChildren } from "react";
import { EditIcon } from "lucide-react";
import Can from "../../UI/can/can.component";

type PreviewLessonProps = {
  selectedLesson: Lesson;
  currentLessonRating?: number;
  isLessonAlreadyCompleted: boolean;
  onRateContent: (rating: number) => void;
};

// Composant pour prévisualiser une leçon avec ses activités
const LessonReader = ({
  selectedLesson,
  currentLessonRating,
  onRateContent,
  children,
}: PropsWithChildren<PreviewLessonProps>) => {
  // Vérifie s'il y a des activités dans la leçon
  const hasActivities = Boolean(selectedLesson.activities?.length);

  return (
    <div className="flex flex-col gap-4">
      <div className="w-full flex justify-end">
        {/* Bouton de notation */}
        {selectedLesson.activities &&
        currentLessonRating &&
        selectedLesson.activities?.length > 0 ? (
          <RatingPanelButton
            note={currentLessonRating}
            onRateContent={onRateContent}
          />
        ) : null}
        <Can action="write" object="lesson">
          <Link
            to={`/admin/lesson/edit/${selectedLesson.id}`}
            className="btn btn-primary btn-sm"
          >
            <EditIcon />
          </Link>
        </Can>
      </div>

      {/* Affiche les activités si elles existent, sinon affiche un message */}
      {hasActivities ? (
        selectedLesson.activities?.map((activity) => (
          <ActivityPreview key={activity.id} activity={activity} />
        ))
      ) : (
        <p>La leçon selectionnée ne contient aucune activité</p>
      )}

      {/* Boutons de navigation */}
      <div className="flex justify-end items-center my-5">{children}</div>
    </div>
  );
};

export default LessonReader;
