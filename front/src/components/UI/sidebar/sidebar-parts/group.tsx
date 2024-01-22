import { Link } from "react-router-dom";
import Can from "../../can/can.component";
import AddIcon from "../../svg/add-icon";
import { useState } from "react";
import MotionSidebarWrapper from "./motion-sidebar-wrapper";
import {} from "lucide-react";
import GroupIcon from "../../svg/group-icon";

const Group = ({ currentRoute }: { currentRoute: string[] }) => {
  const [isHover, setIsHover] = useState(false);
  const isCurrentPathActive = currentRoute[1] === "group";

  return (
    <li
      onMouseOver={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <Link to={`/${currentRoute[0]}/group`} className="flex items-center">
        <div
          className={`tooltip tooltip-top w-6 h-6 z-10 ${
            (isHover || isCurrentPathActive) && "text-primary"
          }`}
          data-tip="Groupes"
        >
          <GroupIcon />
        </div>

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
      </Link>
    </li>
  );
};

export default Group;
