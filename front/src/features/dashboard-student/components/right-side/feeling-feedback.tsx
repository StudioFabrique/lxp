/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeEvent, useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { dashboardStudentApi } from "../../api/dashboard-student.api";
import { AuthContext } from "../../../../store/AuthProvider";
import FeelingLevel from "../../../../components/UI/feeling-level";
import Loader from "../../../../components/loaders/Loader";
import { isSameDate } from "../../../../components/calendar/calendar-utils";

const FeelingFeedback = () => {
  const { socket } = useContext(AuthContext);

  const [feedbackAlreadySent, setFeedbackSent] = useState<boolean>(false);

  const [currentProgressValue, setCurrentProgressValue] = useState<number>(3);

  const [commentValue, setCommentValue] = useState<string>("");

  const handleSubmitFeedback = () => {
    if (!socket) {
      toast("problème socket");
      return;
    }

    socket.emit("receive-student-feedback", {
      feelingLevel: currentProgressValue,
      comment: commentValue,
    });

    toast("feedback envoyé !");

    setFeedbackSent(true);
  };

  const { isLoading } = useQuery({
    queryKey: ["own-feedback"],
    queryFn: async () => {
      const data = await dashboardStudentApi.queries.getOwnFeedback();
      const lastFeedback = data.data;
      if (lastFeedback) {
        const feedbackDate = new Date(lastFeedback.feedbackAt);
        if (
          isSameDate(new Date(), feedbackDate)
        ) {
          setFeedbackSent(true);
          setCurrentProgressValue(lastFeedback.feelingLevel);
        }
      }
      return data;
    },
  });

  return (
    <div className="flex flex-col gap-4 bg-base-100 text-base border border-base-300 p-5 rounded-lg">
      <span className="flex justify-between items-center">
        <p className="font-bold">Comment vous sentez-vous aujourd'hui ?</p>
        <FeelingLevel value={currentProgressValue} />
      </span>
      {isLoading ? (
        <Loader />
      ) : (
        !feedbackAlreadySent && (
          <>
            <input
              type="range"
              className="range range-xs range-primary my-2 bg-secondary-focus w-full"
              value={currentProgressValue}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setCurrentProgressValue(e.currentTarget.valueAsNumber)
              }
              min={1}
              max={5}
              step={1}
            />
            <p>{"Commentaire (facultatif)"}</p>
            <textarea
              onChange={(e) => setCommentValue(e.currentTarget.value)}
              value={commentValue}
              className="textarea text-base-content resize-none w-full"
            />
            <button
              type="button"
              className="btn btn-xs self-end btn-primary text-white"
              onClick={handleSubmitFeedback}
            >
              Envoyer
            </button>
          </>
        )
      )}
    </div>
  );
};

export default FeelingFeedback;
