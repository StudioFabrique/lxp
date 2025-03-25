import { PartyPopperIcon } from "lucide-react";
import { useContext } from "react";
import { Context } from "../../../../store/context.store";
import { Accomplishment } from "../../../../utils/interfaces/accomplishment";
import FeedbacksButton from "../../../UI/feedbacks/feedbacks-button";

const Item = ({ accomplishment }: { accomplishment: Accomplishment }) => {
  const { socket, user } = useContext(Context);

  const handleClick = () => {
    if (!socket) return;
    const idMdbUserFrom = user?._id;

    socket.emit("receive-accomplishment", {
      studentMdbIdToFelicitate: accomplishment.student.idMdb,
      accomplishmentId: accomplishment.id,
      idMdbUserFrom,
    });
  };

  return (
    <div className="flex justify-between gap-2 items-center w-full bg-primary text-base-100 rounded-lg p-2 md:p-3">
      <div className="flex gap-2 md:gap-4 flex-1 min-w-0">
        <span className="flex flex-col items-start overflow-hidden flex-1">
          <p className="font-semibold truncate w-full">{accomplishment.name}</p>
          <p className="text-sm truncate w-full">
            {accomplishment.description}
          </p>
        </span>
      </div>
      <FeedbacksButton
        className="btn btn-primary btn-sm text-nowrap"
        feedbackType="confetti"
        enableAnimationOnClick
        onClick={handleClick}
      >
        <PartyPopperIcon />
      </FeedbacksButton>
    </div>
  );
};

export default Item;
