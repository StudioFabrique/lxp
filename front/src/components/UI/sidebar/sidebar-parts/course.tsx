import { Link } from "react-router-dom";
import Can from "../../can/can.component";
import AddIcon from "../../svg/add-icon";

const Course = (props: { interfaceType: string }) => (
  <ul className="text-primary flex gap-y-4">
    <li>
      <Can action="write" object="course">
        <Link to={`/${props.interfaceType}/course/add`}>
          <div
            className="tooltip tooltip-top w-6 h-6"
            data-tip="Création d'un nouveau cours"
          >
            <AddIcon />
          </div>
        </Link>
      </Can>
    </li>
  </ul>
);

export default Course;
