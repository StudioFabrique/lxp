import { Link } from "react-router-dom";
import Can from "../../can/can.component";
import AddIcon from "../../svg/add-icon";
import { useState } from "react";
import MotionSidebarWrapper from "./motion-sidebar-wrapper";
import {} from "lucide-react";
import GroupIcon from "../../svg/group-icon";

const Group = ({ interfaceType }: { interfaceType: string }) => {
  const [isHover, setIsHover] = useState(false);

  return (
    <li onMouseOver={() => setIsHover(true)}>
      <Link to={`/${interfaceType}/group`} className="flex items-center">
        <div className="tooltip tooltip-top w-6 h-6 z-10" data-tip="Groupes">
          <GroupIcon />
        </div>

        <MotionSidebarWrapper isHover={isHover} setIsHover={setIsHover}>
          <Can action="write" object="group">
            <Link to={`/${interfaceType}/group/add`}>
              <div
                className="ml-14 tooltip tooltip-top w-6 h-6"
                data-tip="Création d'un nouveau groupe"
              >
                <AddIcon />
              </div>
            </Link>
          </Can>
          <Can action="write" object="group">
            <Link to={`/${interfaceType}/group/add`}>
              <div
                className="mr-4 tooltip tooltip-top w-6 h-6"
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
