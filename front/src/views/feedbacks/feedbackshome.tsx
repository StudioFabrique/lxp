import { useCallback, useEffect, useState } from "react";
import StudentFeedback from "../../utils/interfaces/student-feedback";
import useHttp from "../../hooks/use-http";
import FeedbacksList from "../../components/feedbacks-home/feedbacks-list";

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
        path: "/user/last-feedbacks/false",
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
        {feedbacks.length > 0 ? <FeedbacksList feedbacks={feedbacks} /> : null}
      </section>
    </div>
  );
}
