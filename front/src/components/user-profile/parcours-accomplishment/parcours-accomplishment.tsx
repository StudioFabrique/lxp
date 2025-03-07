import { useEffect, useState } from "react";
import Wrapper from "../../UI/wrapper/wrapper.component";
import useHttp from "../../../hooks/use-http";
import Loader from "../../UI/loader";
import Parcours from "../../../utils/interfaces/parcours";
import ParcoursAccomplishmentItem from "./parcours-accomplishment-item";

const ParcoursAccomplishment = () => {
  const { sendRequest, isLoading } = useHttp();

  const [parcours, setParcours] = useState<Parcours[]>([]);

  useEffect(() => {
    const applyData = (data: { data: Parcours[] }) => {
      setParcours(data.data ?? []);
    };

    sendRequest({ path: "/user/my-accomplishment" }, applyData);
  }, [sendRequest]);

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-xl font-bold text-primary">Mon parcours</h3>
      <Wrapper>
        {isLoading ? (
          <Loader />
        ) : parcours.length > 0 ? (
          parcours.map((parcoursItem) => (
            <ParcoursAccomplishmentItem
              key={parcoursItem.id}
              parcours={parcoursItem}
            />
          ))
        ) : (
          <p className="p-4">Aucun feedback</p>
        )}
      </Wrapper>
    </div>
  );
};

export default ParcoursAccomplishment;
