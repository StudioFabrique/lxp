 
import { useContext, useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Socket } from "socket.io-client";
import StudentFeedback from "../../../utils/interfaces/student-feedback";
import { AuthContext } from "../../../store/AuthProvider";
import { dashboardAdminApi } from "../api/dashboard-admin.api";
import BoxWrapper from "../../../components/wrappers/BoxWrapper";
import imageProfileReplacement from "../../../config/image-profile-replacement";
import AvatarCard from "../../../components/UI/avatar-card";
import Modal from "../../../components/UI/modal/modal";

export default function LastFeedback() {
  const { socket } = useContext(AuthContext);

  const [feedbacks, setFeedbacks] = useState<StudentFeedback[]>([]);
  const [feedbackToReview, setFeedbackToReview] = useState<StudentFeedback | null>(null);
  const [reviewMessage, setReviewMessage] = useState("");

  useQuery({
    queryKey: ["last-feedbacks-false"],
    queryFn: async () => {
      const data = await dashboardAdminApi.queries.getLastFeedbacks();
      if (data.success) {
        setFeedbacks(data.response as StudentFeedback[]);
      }
      return data;
    },
  });

  const reviewFeedback = (_studentId: string, feedbackId: string) => {
    const feedback = feedbacks.find((item) => item._id === feedbackId);
    if (feedback) {
      setReviewMessage("");
      setFeedbackToReview(feedback);
    }
  };

  const confirmReview = () => {
    if (!mySocket || !feedbackToReview) return;
    mySocket.emit("feedback-reviewed", {
      studentId: feedbackToReview.studentId,
      feedbackId: feedbackToReview._id,
      message: reviewMessage.trim(),
    });
    setFeedbackToReview(null);
    setReviewMessage("");
  };

  const mySocket: Socket | null = useMemo(() => {
    return socket;
  }, [socket]);

  useEffect(() => {
    if (!mySocket) return;
    const onNewFeedback = (feedback: StudentFeedback) => {
      setFeedbacks((prevState) => [feedback, ...prevState]);
    };
    const onReviewed = (feedbackId: string) => {
      setFeedbacks((prevState) =>
        prevState.map((feedback) =>
          feedback._id === feedbackId
            ? { ...feedback, hasBeenReviewed: true }
            : feedback,
        ),
      );
    };
    mySocket.on("new-feedback-received", onNewFeedback);
    mySocket.on("response-feedback-reviewed", onReviewed);
    return () => {
      mySocket.off("new-feedback-received", onNewFeedback);
      mySocket.off("response-feedback-reviewed", onReviewed);
    };
  }, [mySocket]);

  return (
    <div className="flex flex-col gap-y-2 w-full">
      <h2 className="font-bold">Derniers feedbacks des apprenants</h2>
      {feedbacks.length > 0 ? (
        <ul className="flex flex-col gap-y-2">
          {feedbacks.map((item) => (
            <li key={item._id}>
              <BoxWrapper>
                <AvatarCard
                  _id={item._id}
                  avatarSrc={item.avatar ?? imageProfileReplacement}
                  username={item.name}
                  message={item.comment ?? "Aucun commentaire."}
                  feelingLevel={+item.feelingLevel}
                  feedbackAt={item.feedbackAt}
                  hasBeenReviewed={item.hasBeenReviewed}
                  studentId={item.studentId}
                  onReview={reviewFeedback}
                />
              </BoxWrapper>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-2">
          <BoxWrapper>
            <p>Aucun feedback récent.</p>
          </BoxWrapper>
        </div>
      )}
      {feedbackToReview && (
        <Modal
          title={`Reviewer le feedback de ${feedbackToReview.name}`}
          leftLabel="Annuler"
          rightLabel="Valider la review"
          rightClassName="btn-primary"
          rightDisabled={!mySocket?.connected}
          onLeftClick={() => setFeedbackToReview(null)}
          onRightClick={confirmReview}
        >
          <label className="flex flex-col gap-2 py-4">
            <span className="text-sm font-semibold">Note interne de review (facultative)</span>
            <textarea
              className="textarea textarea-bordered w-full min-h-28"
              maxLength={1000}
              value={reviewMessage}
              onChange={(event) => setReviewMessage(event.target.value)}
              placeholder="Votre note de review"
              autoFocus
            />
          </label>
        </Modal>
      )}
    </div>
  );
}
