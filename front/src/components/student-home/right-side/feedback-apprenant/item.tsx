import { motion, useCycle } from "framer-motion";
import { PartyPopperIcon } from "lucide-react";
import imageProfileReplacement from "../../../../config/image-profile-replacement";
import { Accomplishment } from "./feedback-apprenant";

const Item = ({ accomplishment }: { accomplishment: Accomplishment }) => {
  const [animate, cycle] = useCycle(
    { scale: 1.0, opacity: 1 },
    { scale: 1.5, opacity: 0 }
  );

  return (
    <div className="flex gap-2 items-center w-full bg-primary text-primary-content rounded-lg p-2">
      <img
        className="rounded-lg h-[40px] w-[40px] object-cover"
        src={`data:image/jpeg;base64,${imageProfileReplacement}`}
        alt="User Avatar"
      />
      <span className="flex flex-col items-start overflow-clip">
        <p className="font-semibold truncate">{accomplishment.name}</p>
        <p className="text-sm truncate">{accomplishment.description}</p>
      </span>
      <motion.button
        type="button"
        onTap={() => cycle(1)}
        animate={animate}
        className="jus p-2 bg-secondary/70 text-primary-content rounded-lg"
      >
        <PartyPopperIcon />
      </motion.button>
    </div>
  );
};

export default Item;
