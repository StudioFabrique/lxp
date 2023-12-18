import { Link } from "react-router-dom";
import CourseIcon from "../svg/course-icon";
import Can from "../can/can.component";
import AddIcon from "../svg/add-icon";

const SidebarParcours = (props: { interfaceType: string }) => (
  <ul className="text-primary flex flex-col gap-y-4">
    <li>
      <Link to={`/${props.interfaceType}/parcours/`}>
        <div
          className="tooltip tooltip-right w-6 h-6"
          data-tip="Accueil Interface de création des parcours"
        >
          <CourseIcon />
        </div>
      </Link>
    </li>
    <li>
      <Can action="write" object="course">
        <Link to={`/${props.interfaceType}/créer-un-parcours/`}>
          <div
            className="tooltip tooltip-right w-6 h-6"
            data-tip="Création d'un nouveau parcours"
          >
            <AddIcon />
          </div>
        </Link>
      </Can>
    </li>
  </ul>
);

export default SidebarParcours;
