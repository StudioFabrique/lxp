import { useEffect, useState } from "react";
import useHttp from "../../../../hooks/use-http";
import Loader from "../../../UI/loader";

const FeedbackApprenant = () => {
  const { sendRequest, isLoading } = useHttp();
  const [feedbacks, setFeedbacks] = useState();

  useEffect(() => {
    const applyData = (data: { data: any }) => {
      console.log({ data });
    };

    sendRequest({ path: "/user/accomplishment" }, applyData);
  }, [sendRequest]);

  return (
    <div className="flex flex-col items-center bg-secondary text-secondary-content rounded-lg p-5 gap-5 h-[350px]">
      <p className="font-bold self-start">Derniers feedback des apprenants</p>
      <div className="flex flex-col w-full gap-5 carousel carousel-vertical">
        {/* map item */}
        {isLoading ? <Loader /> : <></>}
        <p>Aucun feedback</p>
      </div>
    </div>
  );
};

export default FeedbackApprenant;
