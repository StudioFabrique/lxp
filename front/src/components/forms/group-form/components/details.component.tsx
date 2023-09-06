import { FC, useEffect, useState } from "react";
import Wrapper from "../../../UI/wrapper/wrapper.component";
import Selecter from "../../../UI/selecter/selecter.component";
import useHttp from "../../../../hooks/use-http";
import { sortArray } from "../../../../utils/sortArray";

// type de données pour les listes
type Item = {
  id: number;
  title: string;
  formationId?: number;
};

const Details: FC<{
  onSelectParcours: (id: number) => void;
  onSelectFormation: (id: number) => void;
}> = ({ onSelectParcours, onSelectFormation }) => {
  const { sendRequest } = useHttp();

  const [parcoursList, setParcoursList] = useState<Array<Item>>([]);
  const [formationsList, setFormationsList] = useState<Array<Item>>([]);

  useEffect(() => {
    const applyData = (data: any) => {
      setParcoursList(sortArray(data, "id"));
    };
    sendRequest(
      {
        path: "/parcours",
      },
      applyData
    );
  }, [sendRequest]);

  useEffect(() => {
    const applyData = (data: any) => {
      setFormationsList(sortArray(data, "id"));
    };
    sendRequest(
      {
        path: "/formation",
      },
      applyData
    );
  }, [sendRequest]);

  return (
    <Wrapper>
      <h2 className="font-bold text-xl">Details</h2>
      <span className="flex flex-col gap-y-2">
        <label>Formation visée</label>
        <Selecter
          list={formationsList}
          onSelectItem={onSelectFormation}
          title=""
        />
      </span>
      <span className="flex flex-col gap-y-2">
        <label>Parcours visé</label>
        <Selecter
          list={parcoursList}
          onSelectItem={onSelectParcours}
          title=""
        />
      </span>
    </Wrapper>
  );
};
export default Details;
