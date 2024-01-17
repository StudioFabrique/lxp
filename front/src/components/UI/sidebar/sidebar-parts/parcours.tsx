import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Can from "../../can/can.component";
import AddIcon from "../../svg/add-icon";
import { RocketIcon } from "lucide-react";
import { useEffect, useState } from "react";

const Parcours = ({ interfaceType }: { interfaceType: string }) => {
  const [isHover, setIsHover] = useState(false);

  useEffect(() => {
    console.log(isHover);
  }, [isHover]);

  return (
    <li
      onMouseOver={() => setIsHover(true)}
      /* onMouseLeave={() => setIsHover(false)} */
    >
      <Link to={`/${interfaceType}/parcours`} className="flex">
        <div className="tooltip tooltip-right w-6 h-6" data-tip="Parcours">
          <RocketIcon />
        </div>

        <motion.ul
          animate={{
            /* width: isHover ? 10 : 0, */
            opacity: isHover ? 1 : 0,
            visibility: isHover ? "visible" : "hidden",
          }}
          className="absolute ml-16 text-primary flex gap-y-4"
        >
          <li>
            {/* <Can action="write" object="parcours"> */}
            <Link to={`/${interfaceType}/parcours/créer-un-parcours`}>
              <div
                className="tooltip tooltip-right w-6 h-6"
                data-tip="Création d'un nouveau parcours"
              >
                <AddIcon />
              </div>
            </Link>
            {/* </Can> */}
          </li>
        </motion.ul>
      </Link>
    </li>
  );
};

export default Parcours;
