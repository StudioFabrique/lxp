import { useEffect, useState } from "react";
import useHttp from "../../../../hooks/use-http";
import Loader from "../../../UI/loader";
import Item from "./item";
import User from "../../../../utils/interfaces/user";

export interface Accomplishment {
  description: string;
  id: number;
  name: string;
  student: User;
}

const StudentAccomplishments = () => {
  const { sendRequest, isLoading } = useHttp();
  const [accomplishments, setAccomplishments] = useState<Accomplishment[]>();

  useEffect(() => {
    const applyData = (data: { data: any }) => {
      setAccomplishments(data.data);
    };

    sendRequest({ path: "/user/accomplishment" }, applyData);
  }, [sendRequest]);

  return (
    <div className="flex flex-col items-center bg-secondary text-secondary-content rounded-lg p-5 gap-5 h-[350px]">
      <p className="font-bold self-start">Derniers feedback des apprenants</p>
      <div className="flex flex-col w-full gap-5 carousel carousel-vertical">
        {isLoading ? (
          <Loader />
        ) : accomplishments && accomplishments?.length > 0 ? (
          accomplishments.map((item) => <Item accomplishment={item} />)
        ) : (
          <p>Aucun feedback</p>
        )}
      </div>
    </div>
  );
};

export default StudentAccomplishments;
