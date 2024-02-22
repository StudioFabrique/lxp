/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import AvatarCard from "../UI/avatar-card";
import { Context } from "../../store/context.store";
import StudentFeedback from "../../utils/interfaces/student-feedback";
import imageProfileReplacement from "../../config/image-profile-replacement";
import { Socket } from "socket.io-client";
import useHttp from "../../hooks/use-http";

export default function LastFeedback() {
  const { socket } = useContext(Context);
  const { sendRequest } = useHttp();

  const [feedbacks, setFeedbacks] = useState<StudentFeedback[]>([]);

  const getLastFeedback = useCallback(() => {
    const applyData = (data: any) => {
      if (data.success) {
        setFeedbacks(data.response);
      }
    };
    sendRequest(
      {
        path: "/user/last-feedbacks",
      },
      applyData
    );
  }, [sendRequest]);

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
        console.log("notif received");
        setFeedbacks((prevState) =>
          prevState.map((feedback) => {
            if (feedback._id === feedbackId) {
              return { ...feedback, hasBeenReviewed: true };
            }
            return feedback;
          })
        );
      });
    }
  }, [mySocket]);

  useEffect(() => {
    getLastFeedback();
  }, [getLastFeedback]);

  console.log({ feedbacks });

  return (
    <div className="flex flex-col gap-y-2">
      <h2 className="font-bold">Derniers feedbacks des apprenants</h2>
      <ul className="flex flex-col gap-y-2">
        {feedbacks.map((item) => (
          <li key={item._id}>
            <AvatarCard
              _id={item._id}
              avatarSrc={`data:image/jpeg;base64,${
                item.avatar ?? imageProfileReplacement
              }`}
              username={item.name}
              message={item.comment ?? "Aucun commentaire."}
              feelingLevel={+item.feelingLevel}
              feedbackAt={item.feedbackAt}
              hasBeenReviewed={item.hasBeenReviewed}
              studentId={item.studentId}
              onReview={reviewFeedback}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
