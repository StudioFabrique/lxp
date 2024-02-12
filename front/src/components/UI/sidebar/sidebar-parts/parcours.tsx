import { Link } from "react-router-dom";
import Can from "../../can/can.component";
import AddIcon from "../../svg/add-icon";
import { RocketIcon } from "lucide-react";
import { useState } from "react";
import MotionSidebarWrapper from "./motion-sidebar-wrapper";

const Parcours = ({ currentRoute }: { currentRoute: string[] }) => {
  const [isHover, setIsHover] = useState(false);
  const isCurrentPathActive = currentRoute[1] === "parcours";

  return (
    <li
      onMouseOver={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <div className="flex items-center">
        <Link
          to={`/${currentRoute[0]}/parcours`}
          className={`tooltip tooltip-top w-6 h-6 z-10 ${
            (isHover || isCurrentPathActive) && "text-primary"
          }`}
          data-tip="Parcours"
        >
          <div className="flex hover:text-primary text-primary-content justify-center items-center">
            <RocketIcon className="z-10 pointer-events-none" />
            <span
              className={`absolute p-5 rounded-lg ${
                isCurrentPathActive && "bg-primary/50"
              }`}
            />
          </div>
        </Link>

        <MotionSidebarWrapper isHover={currentRoute[0] === "admin" && isHover}>
          <Can action="write" object="parcours">
            <Link to={`/${currentRoute[0]}/parcours/créer-un-parcours`}>
              <div
                className="tooltip tooltip-top w-6 h-6"
                data-tip="Création d'un nouveau parcours"
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

export default Parcours;
