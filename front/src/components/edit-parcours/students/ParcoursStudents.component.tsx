import { useEffect } from "react";
import useHttp from "../../../hooks/use-http";

const ParcoursStudents = () => {
  const { sendRequest } = useHttp();

  useEffect(() => {
    const applyData = (data: any) => {
      console.log(data);
    };
    sendRequest(
      {
        path: "/group/student/name/asc?page=1&limit=10000",
      },
      applyData
    );
  }, [sendRequest]);

  return <div>Parcours Students section</div>;
};

export default ParcoursStudents;
