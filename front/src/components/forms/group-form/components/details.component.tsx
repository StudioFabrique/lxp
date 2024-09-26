/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useEffect, useState } from "react";
import Wrapper from "../../../UI/wrapper/wrapper.component";
import Selecter from "../../../UI/selecter/selecter.component";
import useHttp from "../../../../hooks/use-http";
import Group from "../../../../utils/interfaces/group";
import toTitleCase from "../../../../utils/toTitleCase";

// type de données pour les listes
type Item = {
  id: number;
  title: string;
  formationId?: number;
};

const Details: FC<{
  group?: Group;
  onSelectParcours: (id: number) => void;
}> = ({ group, onSelectParcours }) => {
  const { sendRequest } = useHttp();

  const [formations, setFormations] = useState<Array<Item>>([]);
  const [formation, setFormation] = useState<number | undefined>(undefined);
  const [parcoursList, setParcoursList] = useState<Array<Item>>([]);

  /**
   * requête pour récupérer la liste des formations dans la bdd
   */
  useEffect(() => {
    const processData = (data: Array<Item>) => {
      setFormations(data);
    };
    sendRequest(
      {
        path: "/formation",
      },
      processData
    );
  }, [sendRequest]);

  /**
   * sélection d'un formation
   * @param id number
   */
  const handleFormation = (id: number) => {
    setFormation(id);
  };

  /**
   * sélection d'un parcours lié à la formation sélectionnée
   * @param id number
   */
  const handleParcours = (id: number) => {
    onSelectParcours(id);
  };

  /**
   * requête qui retourne la liste des parcours liés à la formation sélectionnée
   */
  useEffect(() => {
    if (formation !== undefined) {
      const processData = (data: any) => {
        setParcoursList(data.data);
      };
      sendRequest(
        {
          path: `/parcours/parcours-by-formation/${formation}`,
          method: "get",
        },
        processData
      );
    }
  }, [formation, sendRequest]);

  return (
    <Wrapper>
      <div className="flex flex-col gap-5 max-w-[50vh]">
        <span className="flex justify-between">
          <h2 className="font-bold text-xl">Details</h2>
          <p>{group?.formation && toTitleCase(group.formation)}</p>
        </span>
        <div className="flex flex-col gap-y-8">
          <Selecter
            list={formations}
            title="Choisissez une formation"
            onSelectItem={handleFormation}
          />
          <Selecter
            list={parcoursList}
            title="Choisisez un parcours"
            onSelectItem={handleParcours}
          />
        </div>
      </div>
    </Wrapper>
  );
};
export default Details;
