import { Link } from "react-router-dom";
import Can from "../../can/can.component";
import AddIcon from "../../svg/add-icon";
import CourseIcon from "../../svg/course-icon";
import { useState } from "react";
import MotionSidebarWrapper from "./motion-sidebar-wrapper";

const Course = ({ currentRoute }: { currentRoute: string[] }) => {
  const [isHover, setIsHover] = useState(false);
  const isCurrentPathActive = currentRoute[1] === "course";

  return (
    <li
      onMouseOver={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <div className="flex items-center">
        <Link
          to={`/${currentRoute[0]}/course`}
          className={`tooltip tooltip-top w-6 h-6 z-10 ${
            (isHover || isCurrentPathActive) && "text-primary"
          }`}
          data-tip="Cours"
        >
          <div className="flex hover:text-primary text-primary-content justify-center items-center">
            <CourseIcon />
            <span
              className={`absolute p-5 rounded-lg ${
                isCurrentPathActive && "bg-primary/50"
              }`}
            />
          </div>
        </Link>

        <MotionSidebarWrapper isHover={isHover}>
          <Can action="write" object="course">
            <Link to={`/${currentRoute[0]}/course/add`}>
              <div
                className="tooltip tooltip-top w-6 h-6"
                data-tip="Création d'un nouveau cours"
              >
                <AddIcon />
              </div>
            </Link>
          </Can>
        </MotionSidebarWrapper>
      </div>
    </li>
  );
};

export default Course;
