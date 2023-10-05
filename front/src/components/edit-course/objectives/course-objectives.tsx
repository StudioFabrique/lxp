import { useEffect } from "react";
import Wrapper from "../../UI/wrapper/wrapper.component";
import useHttp from "../../../hooks/use-http";
import { useParams } from "react-router-dom";

const CourseObjectives = () => {
  const { courseId } = useParams();
  const { sendRequest } = useHttp();

  useEffect(() => {
    const applyData = (data: any) => {
      console.log({ data });
    };
    sendRequest(
      {
        path: `/course/objectives/${courseId}`,
      },
      applyData
    );
  }, [courseId, sendRequest]);

  return (
    <div className="w-full flex flex-col gap-y-8">
      <div className="w-full">
        <Wrapper>
          <h2 className="text-xl font-bold">Objectifs</h2>
        </Wrapper>
      </div>
    </div>
  );
};

export default CourseObjectives;
