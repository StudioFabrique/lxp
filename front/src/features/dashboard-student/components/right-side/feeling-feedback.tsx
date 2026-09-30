import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { feelingFeedbackSchema } from "../../../user/feedback.schema";
import { useFormField } from "../../../../components/form/useFormField";
import { showFormErrors } from "../../../../components/form/form-errors";

import { ChangeEvent, useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { dashboardStudentApi } from "../../api/dashboard-student.api";
import { AuthContext } from "../../../../store/AuthProvider";
import FeelingLevel from "../../../../components/UI/feeling-level";
import Loader from "../../../../components/loaders/Loader";
import { isSameDate } from "../../../calendar/components/calendar-utils";
import BoxWrapper from "../../../../components/wrappers/BoxWrapper";

const FeelingFeedback = () => {
  const { socket } = useContext(AuthContext);

  const [feedbackAlreadySent, setFeedbackSent] = useState<boolean>(false);

  const form = useForm({
    resolver: zodResolver(feelingFeedbackSchema),
    defaultValues: { feelingLevel: 3, comment: "" },
  });
  const [currentProgressValue, setCurrentProgressValue] = useFormField(
    form,
    "feelingLevel",
  );

  const [commentValue, setCommentValue] = useFormField(form, "comment");

  const handleSubmitFeedback = form.handleSubmit((values) => {
    if (!socket) {
      toast("problème socket");
      return;
    }

    socket.emit("receive-student-feedback", {
      ...values,
    });

    toast("feedback envoyé !");

    setFeedbackSent(true);
  }, showFormErrors);

  const { isLoading } = useQuery({
    queryKey: ["own-feedback"],
    queryFn: async () => {
      const data = await dashboardStudentApi.queries.getOwnFeedback();
      const lastFeedback = data.data;
      if (lastFeedback) {
        const feedbackDate = new Date(lastFeedback.feedbackAt);
        if (isSameDate(new Date(), feedbackDate)) {
          setFeedbackSent(true);
          setCurrentProgressValue(lastFeedback.feelingLevel);
        }
      }
      return data;
    },
  });

  return (
    <BoxWrapper className="h-auto text-base">
      <span className="flex justify-between items-center">
        <p className="font-bold">Comment vous sentez-vous aujourd'hui ?</p>
        <FeelingLevel value={currentProgressValue} />
      </span>
      {isLoading ? (
        <Loader variant="panel" label="Chargement du feedback" />
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
    </BoxWrapper>
  );
};

export default FeelingFeedback;
