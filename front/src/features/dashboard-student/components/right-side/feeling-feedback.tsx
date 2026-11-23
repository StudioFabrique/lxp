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
import FeelingLevelMorph from "./feeling-level-morph";
import Loader from "../../../../components/loaders/Loader";
import { isSameDate } from "../../../calendar/components/calendar-utils";
import BoxWrapper from "../../../../components/wrappers/BoxWrapper";
import { useDemoMode } from "../../../../store/DemoContext";

const FEEDBACK_TOAST_ID = "feeling-feedback";

const FeelingFeedback = () => {
  const { socket } = useContext(AuthContext);
  const { demoMode } = useDemoMode();

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
    // En démonstration le temps réel est coupé (compte partagé, écritures
    // interdites) : l'envoi reste simulé côté interface pour que le visiteur
    // puisse essayer le ressenti du jour, sans rien enregistrer.
    if (demoMode) {
      toast.success("Merci ! En démonstration, votre ressenti n'est pas conservé.", {
        id: FEEDBACK_TOAST_ID,
      });
      setFeedbackSent(true);
      return;
    }

    if (!socket) {
      toast.error(
        "Connexion en temps réel interrompue : votre ressenti n'a pas été envoyé. Rechargez la page puis réessayez.",
        { id: FEEDBACK_TOAST_ID },
      );
      return;
    }

    socket.emit("receive-student-feedback", {
      ...values,
    });

    toast.success("Merci, votre ressenti a bien été envoyé.", {
      id: FEEDBACK_TOAST_ID,
    });

    setFeedbackSent(true);
  }, showFormErrors);

  const { isLoading } = useQuery({
    queryKey: ["own-feedback"],
    queryFn: async () => {
      const data = await dashboardStudentApi.queries.getOwnFeedback();
      const lastFeedback = data.data;
      // En démonstration le compte est partagé : un ressenti déjà déposé
      // aujourd'hui ne doit pas empêcher le visiteur d'essayer le formulaire.
      if (lastFeedback && !demoMode) {
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
        <FeelingLevelMorph value={currentProgressValue} />
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
              className="btn btn-xs self-end btn-primary text-primary-content"
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
