import { useCallback, useEffect, useState } from "react";
import StudentFeedback from "../../utils/interfaces/student-feedback";
import useHttp from "../../hooks/use-http";
import useEagerLoadingList from "../../hooks/use-eager-loading-list";
import FeedbacksList from "../../components/feedbacks-home/feedbacks-list";

export default function FeedbacksHome() {
  const [feedbacks, setFeedbacks] = useState<StudentFeedback[]>([]);
  const { sendRequest, isLoading, error } = useHttp();
  const {
    allChecked,
    list,
    fieldSort,
    direction,
    setAllChecked,
    handleRowCheck,
    sortData,
  } = useEagerLoadingList(feedbacks, "name");

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
    getLastFeedback;
  }, [getLastFeedback]);

  return (
    <div>
      <h1 className="text-2xl font-bold">Feedbacks des apprenants</h1>
      <section>
        <FeedbacksList
          allChecked={allChecked}
          list={list!}
          fieldSort={fieldSort}
          direction={direction}
          setAllChecked={setAllChecked}
          handleRowCheck={handleRowCheck}
          sortData={sortData}
        />
      </section>
    </div>
  );
}
