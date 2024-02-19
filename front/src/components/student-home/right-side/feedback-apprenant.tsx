import { motion, useCycle } from "framer-motion";
import { PartyPopperIcon } from "lucide-react";
import imageProfileReplacement from "../../../config/image-profile-replacement";
import { useState } from "react";

const FeedbackApprenant = () => {
  const [animate, cycle] = useCycle(
    { scale: 1.0, opacity: 1 },
    { scale: 1.5, opacity: 0 }
  );

  return (
    <div className="flex flex-col items-center bg-secondary text-secondary-content rounded-lg p-5 gap-5 h-[350px]">
      <p className="font-bold self-start">Derniers feedback des apprenants</p>
      <div className="flex flex-col w-full gap-5 carousel carousel-vertical">
        <div className="flex justify-between gap-2 items-center w-full bg-primary text-primary-content rounded-lg p-2">
          <img
            className="rounded-lg h-[40px] w-[40px] object-cover"
            src={`data:image/jpeg;base64,${imageProfileReplacement}`}
            alt="User Avatar"
          />
          <span className="flex flex-col items-start overflow-clip">
            <p className="font-semibold truncate">Stanley FROGATE</p>
            <p className="text-sm truncate">vient d'ajouter un commentaire</p>
          </span>
          <motion.button
            type="button"
            onTap={() => cycle(1)}
            animate={animate}
            className="p-2 bg-secondary/70 text-primary-content rounded-lg"
          >
            <PartyPopperIcon />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackApprenant;
