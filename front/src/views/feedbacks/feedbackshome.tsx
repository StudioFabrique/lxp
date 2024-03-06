import { useCallback, useEffect, useState } from "react";
import StudentFeedback from "../../utils/interfaces/student-feedback";
import useHttp from "../../hooks/use-http";
import FeedbacksList from "../../components/feedbacks-home/feedbacks-list";
import Wrapper from "../../components/UI/wrapper/wrapper.component";

export default function FeedbacksHome() {
  const [feedbacks, setFeedbacks] = useState<StudentFeedback[]>([]);
  const { sendRequest } = useHttp();

  const getLastFeedback = useCallback(() => {
    const applyData = (data: {
      success: boolean;
      message: string;
      response: StudentFeedback[];
    }) => {
      if (data.success) {
        setFeedbacks(data.response);
      }
    };
    sendRequest(
      {
        path: "/user/last-feedbacks/true",
      },
      applyData
    );
  }, [sendRequest]);

  useEffect(() => {
    getLastFeedback();
  }, [getLastFeedback]);

  return (
    <div>
      <h1 className="text-2xl font-bold">Feedbacks des apprenants</h1>
      <section>
        {feedbacks.length > 0 ? (
          <FeedbacksList feedbacks={feedbacks} />
        ) : (
          <div className="w-fit mt-2">
            <Wrapper>
              <p>
                Vous n'avez reçu aucun feedback de la part de vos apprenants.
              </p>
            </Wrapper>
          </div>
        )}
      </section>
    </div>
  );
}
