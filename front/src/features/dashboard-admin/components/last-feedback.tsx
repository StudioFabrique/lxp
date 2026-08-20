 
import { useContext, useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Socket } from "socket.io-client";
import StudentFeedback from "../../../utils/interfaces/student-feedback";
import { AuthContext } from "../../../store/AuthProvider";
import { dashboardAdminApi } from "../api/dashboard-admin.api";
import Wrapper from "../../../components/wrappers/BoxWrapper";
import imageProfileReplacement from "../../../config/image-profile-replacement";
import AvatarCard from "../../../components/UI/avatar-card";

export default function LastFeedback() {
  const { socket } = useContext(AuthContext);

  const [feedbacks, setFeedbacks] = useState<StudentFeedback[]>([]);

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

  const reviewFeedback = (studentId: string, feedbackId: string) => {
    if (mySocket) {
      mySocket.emit("feedback-reviewed", {
        studentId,
        feedbackId,
      });
    }
  };

  const mySocket: Socket | null = useMemo(() => {
    return socket;
  }, [socket]);

  useEffect(() => {
    if (mySocket) {
      mySocket.on("new-feedback-received", (feedback: StudentFeedback) => {
        setFeedbacks((prevState) => [...prevState, feedback]);
      });
      mySocket.on("response-feedback-reviewed", (feedbackId: string) => {
        setFeedbacks((prevState) =>
          prevState.map((feedback) => {
            if (feedback._id === feedbackId) {
              return { ...feedback, hasBeenReviewed: true };
            }
            return feedback;
          }),
        );
      });
    }
  }, [mySocket]);

  return (
    <div className="flex flex-col gap-y-2 w-full">
      <h2 className="font-bold">Derniers feedbacks des apprenants</h2>
      {feedbacks.length > 0 ? (
        <ul className="flex flex-col gap-y-2">
          {feedbacks.map((item) => (
            <li key={item._id}>
              <Wrapper>
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
              </Wrapper>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-2">
          <Wrapper>
            <p>Aucun feedback récent.</p>
          </Wrapper>
        </div>
      )}
    </div>
  );
}
