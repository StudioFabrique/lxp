/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import Item from "./item";
import useHttp from "../../../../../../../src.legacy/hooks/use-http";
import { Accomplishment } from "../../../../../../utils/interfaces/accomplishment";
import Loader from "../../../../../../components/loaders/Loader";

const StudentAccomplishments = () => {
  const { sendRequest, isLoading } = useHttp();
  const [accomplishments, setAccomplishments] = useState<Accomplishment[]>();

  const handleRemoveItem = (idToRemove: number) => {
    setAccomplishments((prev) =>
      prev?.filter((item) => item.id !== idToRemove),
    );
  };

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
          accomplishments.map((item) => (
            <Item
              key={item.id}
              accomplishment={item}
              onRemove={handleRemoveItem}
            />
          ))
        ) : (
          <p>Aucun feedback</p>
        )}
      </div>
    </div>
  );
};

export default StudentAccomplishments;
