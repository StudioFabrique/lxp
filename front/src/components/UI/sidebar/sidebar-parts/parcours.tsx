import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Can from "../../can/can.component";
import AddIcon from "../../svg/add-icon";
import { RocketIcon } from "lucide-react";
import { useState } from "react";

const Parcours = ({ interfaceType }: { interfaceType: string }) => {
  const [isHover, setIsHover] = useState(false);

  return (
    <li onMouseOver={() => setIsHover(true)}>
      <Link to={`/${interfaceType}/parcours`} className="flex">
        <div className="tooltip tooltip-top w-6 h-6 z-10" data-tip="Parcours">
          <RocketIcon />
        </div>

        <motion.div
          onMouseLeave={() => setIsHover(false)}
          animate={{
            width: isHover ? "auto" : 0,
            opacity: isHover ? 1 : 0,
            visibility: isHover ? "visible" : "hidden",
          }}
          className="absolute text-primary flex gap-x-5 bg-secondary/20 bg-black h-11 items-center -translate-y-2 -translate-x-2 rounded-r-xl"
        >
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
        </motion.div>
      </Link>
    </li>
  );
};

export default Parcours;
