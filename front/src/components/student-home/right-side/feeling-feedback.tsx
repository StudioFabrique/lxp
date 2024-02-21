/* eslint-disable @typescript-eslint/no-explicit-any */

import { ChangeEvent, useContext, useEffect, useState } from "react";
import { Context } from "../../../store/context.store";
import useHttp from "../../../hooks/use-http";
import Loader from "../../UI/loader";
import toast from "react-hot-toast";
import FeelingLevel from "../../UI/feeling-level";

const FeelingFeedback = () => {
  const { sendRequest, isLoading } = useHttp(true);
  const { socket } = useContext(Context);

  const [feedbackAlreadySent, setFeedbackSent] = useState<boolean>(false);

  const [currentProgressValue, setCurrentProgressValue] = useState<number>(3);

  const [commentValue, setCommentValue] = useState<string>();

  const handleSubmitFeedback = () => {
    if (!socket) {
      toast("problème socket");
      return;
    }

    socket.emit("receive_student-feedback", {
      feelingLevel: currentProgressValue,
      comment: commentValue,
    });

    toast("feedback envoyé !");

    setFeedbackSent(true);
  };

  useEffect(() => {
    const applyData = (data: { data: any }) => {
      const lastFeedback = data.data;
      if (
        lastFeedback &&
        Math.floor(
          (new Date(lastFeedback.feedbackAt).getTime() - new Date().getTime()) *
            2.77778e-7
        ) < 24
      ) {
        setFeedbackSent(true);
        setCurrentProgressValue(lastFeedback.feelingLevel);
      }
    };

    sendRequest({ path: "/user/last-feedback", method: "get" }, applyData);
  }, [sendRequest]);

  return (
    <div className="flex flex-col gap-4 bg-secondary text-secondary-content p-5 rounded-lg">
      <span className="flex justify-between items-center">
        <p className="font-bold w-[70%]">
          Comment vous sentez-vous aujourd'hui ?
        </p>
        <FeelingLevel value={currentProgressValue} />
      </span>
      {isLoading ? (
        <Loader />
      ) : (
        !feedbackAlreadySent && (
          <>
            <input
              type="range"
              className="range range-xs range-primary my-2 bg-secondary-focus"
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
              className="textarea text-base-content resize-none"
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
