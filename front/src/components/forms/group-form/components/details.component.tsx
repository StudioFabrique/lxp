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

const Details: FC<{}> = () => {
  const { sendRequest } = useHttp();

  const [parcoursList, setParcoursList] = useState<Array<Item>>([]);

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

  return (
    <Wrapper>
      <h2 className="font-bold text-xl">Details</h2>
      <span>
        <label>Formation visée</label>
        <Selecter list={[]} onSelectItem={() => {}} title="" />
      </span>
      <span>
        <label>Parcours visé</label>
        <Selecter list={parcoursList} onSelectItem={() => {}} title="" />
      </span>
    </Wrapper>
  );
};
export default Details;
