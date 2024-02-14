import { Link } from "react-router-dom";
import Can from "../../can/can.component";
import AddIcon from "../../svg/add-icon";
import { useState } from "react";
import MotionSidebarWrapper from "./motion-sidebar-wrapper";
import GroupIcon from "../../svg/group-icon";

const Group = ({ currentRoute }: { currentRoute: string[] }) => {
  const [isHover, setIsHover] = useState(false);
  const isCurrentPathActive = currentRoute[1] === "group";

  return (
    <li
      onMouseOver={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <div className="flex items-center">
        <Link
          to={`/${currentRoute[0]}/group`}
          className="tooltip tooltip-top w-6 h-6 z-10"
          data-tip="Groupes"
        >
          <div className="flex hover justify-center items-center">
            <GroupIcon />
            <span
              className={`absolute p-5 rounded-lg hover:bg-primary/50 ${
                isCurrentPathActive && "bg-primary/50"
              }`}
            />
          </div>
        </Link>

        <MotionSidebarWrapper isHover={isHover}>
          <Can action="write" object="group">
            <Link to={`/${currentRoute[0]}/group/add`}>
              <div
                className="tooltip tooltip-top w-6 h-6"
                data-tip="Création d'un nouveau groupe"
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

export default Group;
