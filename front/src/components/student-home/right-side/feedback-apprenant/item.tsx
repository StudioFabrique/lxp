import { PartyPopperIcon } from "lucide-react";
import { useContext, useState } from "react";
import { Accomplishment } from "../../../../utils/interfaces/accomplishment";
import FeedbacksButton from "../../../UI/feedbacks/feedbacks-button";
import { Context } from "../../../../store/context.store";

type ItemProps = {
  accomplishment: Accomplishment;
  onRemove: (id: number) => void;
};

const Item = ({ accomplishment, onRemove }: ItemProps) => {
  const { socket, user } = useContext(Context);
  const [buttonClicked, setButtonClicked] = useState(false);

  const handleClick = () => {
    setButtonClicked(true);

    if (socket) {
      const idMdbUserFrom = user?._id;
      socket.emit("receive-accomplishment", {
        studentMdbIdToFelicitate: accomplishment.student.idMdb,
        accomplishmentId: accomplishment.id,
        idMdbUserFrom,
      });
    }

    // On laisse 1.5 secondes (1500ms) pour que l'animation se joue avant de démonter le composant
    setTimeout(() => {
      onRemove(accomplishment.id);
    }, 1500);
  };

  return (
    <div className="flex justify-between gap-2 items-center w-full bg-primary text-neutral-content rounded-lg p-2 md:p-3">
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
        showFeedback
        onClick={handleClick}
        disabled={buttonClicked}
      >
        <PartyPopperIcon />
      </FeedbacksButton>
    </div>
  );
};

export default Item;
