import { motion, useCycle } from "framer-motion";
import { PartyPopperIcon } from "lucide-react";
import { Accomplishment } from "./student-accomplishments";
import { useContext } from "react";
import { Context } from "../../../../store/context.store";

const Item = ({ accomplishment }: { accomplishment: Accomplishment }) => {
  const { socket, user } = useContext(Context);

  const [animate, cycle] = useCycle(
    { scale: 1.0, opacity: 1 },
    { scale: 1.5, opacity: 0 },
  );

  const handleTap = () => {
    if (!socket) return;
    const idMdbUserFrom = user?._id;

    socket.emit("receive-accomplishment", {
      studentMdbIdToFelicitate: accomplishment.student.idMdb,
      accomplishmentId: accomplishment.id,
      idMdbUserFrom,
    });

    cycle(1);
  };

  return (
    <div className="flex justify-between gap-2 items-center w-full bg-primary text-primary-content rounded-lg p-2 md:p-3">
      <div className="flex gap-2 md:gap-4 flex-1 min-w-0">
        {/* <img
          className="rounded-lg h-[40px] w-[40px] md:h-[48px] md:w-[48px] object-cover shrink-0"
          src={`data:image/jpeg;base64,${imageProfileReplacement}`}
          alt="User Avatar"
        /> */}
        <span className="flex flex-col items-start overflow-hidden flex-1">
          <p className="font-semibold truncate w-full">{accomplishment.name}</p>
          <p className="text-sm truncate w-full">
            {accomplishment.description}
          </p>
        </span>
      </div>
      <motion.button
        type="button"
        onTap={handleTap}
        animate={animate}
        className="p-2 bg-secondary/70 text-primary-content rounded-lg shrink-0"
      >
        <PartyPopperIcon />
      </motion.button>
    </div>
  );
};

export default Item;
