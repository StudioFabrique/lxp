import { Link } from "react-router-dom";
import ImageHeader from "../image-header";
import { PlayCircleIcon } from "lucide-react";
import Course from "../../utils/interfaces/course";

type ResumeActivityProps = {
  lastCourse: Course[];
};

const ResumeActivity = ({ lastCourse }: ResumeActivityProps) => {
  return (
    <div className="flex gap-2">
      <ImageHeader
        imageUrl={/* image ?? */ "/images/parcours-default.webp"}
        title={`Module: module`}
        subTitle={`Cours: cours`}
        children={[
          <></>,
          <div className="p-5 w-full flex justify-end">
            <Link to={``} className="btn btn-primary flex">
              <PlayCircleIcon />
              <p>Démarrer</p>
            </Link>
          </div>,
        ]}
      />
      <div className="bg-secondary w-16"></div>
    </div>
  );
};

export default ResumeActivity;
