import { Link } from "react-router-dom";
import CourseIcon from "../svg/course-icon";
import Can from "../can/can.component";
import AddIcon from "../svg/add-icon";

const SidebarCourse = (props: { interfaceType: string }) => (
  <ul className="text-primary flex flex-col gap-y-4">
    <li>
      <Link to={`/${props.interfaceType}/course`}>
        <div
          className="tooltip tooltip-right w-6 h-6"
          data-tip="Accueil Interface de création des cours"
        >
          <CourseIcon />
        </div>
      </Link>
    </li>
    <li>
      <Can action="write" object="course">
        <Link to={`/${props.interfaceType}/course/add`}>
          <div
            className="tooltip tooltip-right w-6 h-6"
            data-tip="Création d'un nouveau cours"
          >
            <AddIcon />
          </div>
        </Link>
      </Can>
    </li>
  </ul>
);

export default SidebarCourse;
