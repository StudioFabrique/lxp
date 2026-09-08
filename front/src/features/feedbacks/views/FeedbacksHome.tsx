import { useQuery } from "@tanstack/react-query";
import { feedbacksApi } from "../api/feedbacks.api";
import FeedbacksList from "../components/FeedbacksList";
import BoxWrapper from "../../../../src/components/wrappers/BoxWrapper";

const FeedbacksHome = () => {
  const { data: feedbacks = [] } = useQuery({
    queryKey: ["last-feedbacks"],
    queryFn: feedbacksApi.queries.getLastFeedbacks,
  });

  return (
    <div className="flex flex-col gap-y-4">
      <h1 className="text-2xl font-bold">Feedbacks des apprenants</h1>
      <section className="w-full">
        {feedbacks.length > 0 ? (
          <FeedbacksList feedbacks={feedbacks} />
        ) : (
          <div className="w-full mt-2">
            <BoxWrapper>
              <p>
                Vous n'avez reçu aucun feedback de la part de vos apprenants.
              </p>
            </BoxWrapper>
          </div>
        )}
      </section>
    </div>
  );
};

export default FeedbacksHome;
