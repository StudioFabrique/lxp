import { Link } from "react-router-dom";
import Can from "../../can/can.component";
import AddIcon from "../../svg/add-icon";
import CourseIcon from "../../svg/course-icon";
import { useState } from "react";
import MotionSidebarWrapper from "./motion-sidebar-wrapper";

const Course = ({ interfaceType }: { interfaceType: string }) => {
  const [isHover, setIsHover] = useState(false);

  return (
    <li onMouseOver={() => setIsHover(true)}>
      <Link to={`/${interfaceType}/course`} className="flex items-center">
        <div className="tooltip tooltip-top w-6 h-6 z-10" data-tip="Cours">
          <CourseIcon />
        </div>

        <MotionSidebarWrapper isHover={isHover} setIsHover={setIsHover}>
          <Can action="write" object="course">
            <Link to={`/${interfaceType}/course/add`}>
              <div
                className="ml-14 mr-4 tooltip tooltip-top w-6 h-6"
                data-tip="Création d'un nouveau cours"
              >
                <AddIcon />
              </div>
            </Link>
          </Can>
          {/* <Can action="write" object="course">
            <Link to={`/${interfaceType}/course/add`}>
              <div
                className="ml-16 tooltip tooltip-top w-6 h-6"
                data-tip="Création d'un nouveau cours"
              >
                <AddIcon />
              </div>
            </Link>
          </Can>
          <Can action="write" object="course">
            <Link to={`/${interfaceType}/course/add`}>
              <div
                className="mr-4 tooltip tooltip-top w-6 h-6"
                data-tip="Création d'un nouveau cours"
              >
                <AddIcon />
              </div>
            </Link>
          </Can> */}
        </MotionSidebarWrapper>
      </Link>
    </li>
  );
};

export default Course;
