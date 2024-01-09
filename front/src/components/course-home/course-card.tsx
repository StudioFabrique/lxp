import { Link } from "react-router-dom";
import { Pencil, Eye, EyeOff, Trash2 } from "lucide-react";

import Can from "../UI/can/can.component";
import CustomCourse from "./interfaces/custom-course";
import ArrowTopRightIcon from "../UI/svg/arrow-top-right-icon";
import PublishedIcon from "../UI/svg/published-icon";
import DraftIcon from "../UI/svg/draft-icon";
import { localeDate } from "../../helpers/locale-date";

interface CourseCardProps {
  course: CustomCourse;
}

export default function CourseCard({ course }: CourseCardProps) {
  const classImage: React.CSSProperties = {
    backgroundImage: `url('data:image/jpeg;base64,${course.thumb}')`,
    width: "100%",
    height: "9rem",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    position: "relative",
  };

  console.log({ course });

  return (
    <div className="card w-96 h-full bg-base-100 shadow-xl border border-primary/20">
      <figure style={classImage}>
        {/* position relative à l'image affichée */}
        <div className="flex items-center  absolute bottom-2 right-2">
          <Can action="update" object="course">
            <div className="tooltip tooltip-left" data-tip="Aperçu du cours">
              <Link
                className="btn btn-sm btn-primary btn-circle rounded-md"
                to={`view/${course.id}`}
                aria-label="Aperçu du cours"
              >
                <div className="w-5 h-5 ">
                  <ArrowTopRightIcon />
                </div>
              </Link>
            </div>
          </Can>
        </div>
      </figure>

      <div className="card-body w-full flex flex-col justify-between pt-4">
        <div className="flex flex-col gap-y-2 mb-4">
          <span className="flex justify-between items-center">
            <h2 className="card-title text-primary">{course.title}</h2>

            {course.isPublished ? (
              <div className="w-7 h-7 text-primary">
                <div
                  className="tooltip tooltip-bottom"
                  data-tip="Le course est publié"
                >
                  <PublishedIcon />
                </div>
              </div>
            ) : (
              <div className="w-7 h-7 text-warning">
                <div className="tooltip tooltip-bottom" data-tip="Brouillon">
                  <DraftIcon />
                </div>
              </div>
            )}
          </span>
        </div>
        <div className="flex flex-col items-start gap-y-1 mb-4 w-full">
          <span className="flex justify-between gap-x-4 items-center w-full">
            <p className="font-bold w-24">Parcours</p>
            <p className="flex justify-end">{course.parcours}</p>
          </span>
          <span className="flex justify-between gap-x-4 items-center w-full">
            <p className="font-bold w-24">Module</p>
            <p className="flex justify-end">{course.module}</p>
          </span>
          <span className="flex justify-between gap-x-4 items-center w-full">
            <p className="font-bold w-24">Dernière màj :</p>
            <p className="flex justify-end">{localeDate(course.updatedAt!)}</p>
          </span>
          <span className="flex justify-between gap-x-4 items-center w-full">
            <p className="font-bold w-24">Auteur :</p>
            <p className="flex justify-end capitalize">{course.author}</p>
          </span>
          <span className="flex justify-between gap-x-4 items-center w-full">
            <p className="font-bold w-24">Visibilité :</p>
            <div className="w-6 h-6">
              {course.visibility ? <Eye /> : <EyeOff />}
            </div>
          </span>
        </div>

        <div className="card-actions w-full flex items-center justify-between">
          <div aria-label="suppression du cours">
            <Can action="delete" object="course">
              <div
                className="tooltip tooltip-bottom flex-items-center"
                data-tip="Supprimer le cours"
              >
                <button
                  className="btn btn-sm btn-outline btn-circle rounded-md btn-error"
                  onClick={() => {}}
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </Can>
          </div>

          <Can action="update" object="course">
            <div
              className="tooltip tooltip-bottom"
              data-tip="Modifier le cours"
            >
              <Link
                className="btn btn-outline btn-sm btn-circle rounded-md  text-primary"
                to={`edit/${course.id}`}
                aria-label="modifier le cours"
              >
                <Pencil className="w-5 h-5" />
              </Link>
            </div>
          </Can>
        </div>
      </div>
    </div>
  );
}
