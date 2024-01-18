import { Link } from "react-router-dom";
import Can from "../../can/can.component";
import AddIcon from "../../svg/add-icon";
import { RocketIcon } from "lucide-react";
import { useState } from "react";
import MotionSidebarWrapper from "./motion-sidebar-wrapper";

const Parcours = ({ interfaceType }: { interfaceType: string }) => {
  const [isHover, setIsHover] = useState(false);

  return (
    <li onMouseOver={() => setIsHover(true)}>
      <Link to={`/${interfaceType}/parcours`} className="flex">
        <div className="tooltip tooltip-top w-6 h-6 z-10" data-tip="Parcours">
          <RocketIcon />
        </div>

        <MotionSidebarWrapper isHover={isHover} setIsHover={setIsHover}>
          <Can action="write" object="parcours">
            <Link to={`/${interfaceType}/parcours/créer-un-parcours`}>
              <div
                className="ml-16 tooltip tooltip-top w-6 h-6"
                data-tip="Création d'un nouveau parcours"
              >
                <AddIcon />
              </div>
            </Link>
          </Can>
          <Can action="write" object="parcours">
            <Link to={`/${interfaceType}/parcours/créer-un-parcours`}>
              <div
                className="mr-5 tooltip tooltip-top w-6 h-6"
                data-tip="Création d'un nouveau parcours"
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

export default Parcours;
