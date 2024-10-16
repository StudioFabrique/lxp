/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useEffect, useState } from "react";
import Wrapper from "../../../UI/wrapper/wrapper.component";
import useHttp from "../../../../hooks/use-http";
import Group from "../../../../utils/interfaces/group";
import SelecterGroup from "../../../UI/selecter/selecter-group";

// type de données pour les listes
type Item = {
  id: number;
  title: string;
  formationId?: number;
};

const Details: FC<{
  group?: Group;
  onSelectParcours: (id: number) => void;
  selectedParcoursId: number | null;
}> = ({ group, onSelectParcours, selectedParcoursId }) => {
  const { sendRequest } = useHttp();

  const [formations, setFormations] = useState<Array<Item>>([]);
  const [formationId, setFormationId] = useState<number | undefined>(undefined);
  const [parcoursList, setParcoursList] = useState<Array<Item>>([]);

  /**
   * sélection d'un formation
   * @param id number
   */
  const handleFormation = (id: number) => {
    setFormationId(id);
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
    if (formationId !== undefined) {
      const processData = (data: any) => {
        setParcoursList(data.data);
      };
      sendRequest(
        {
          path: `/parcours/parcours-by-formation/${formationId}`,
          method: "get",
        },
        processData,
      );
    }
  }, [formationId, sendRequest]);

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
      processData,
    );
  }, [sendRequest]);

  useEffect(() => {
    if (group?.formationId) {
      setFormationId(group?.formationId);
    }
  }, [group?.formationId]);

  useEffect(() => {
    if (group?.parcoursId && parcoursList.length > 0) {
      onSelectParcours(group.parcoursId);
    }
  }, [group?.parcoursId, parcoursList.length, onSelectParcours]);

  return (
    <Wrapper>
      <div className="flex flex-col gap-5 max-w-[50vh]">
        <span className="flex justify-between">
          <h2 className="font-bold text-xl">Details</h2>
        </span>
        <div className="flex flex-col gap-y-8">
          <SelecterGroup
            list={formations}
            title="Choisissez une formation"
            onSelectItem={handleFormation}
            id={formationId}
          />
          <SelecterGroup
            list={parcoursList}
            title="Choisisez un parcours"
            onSelectItem={handleParcours}
            id={selectedParcoursId}
          />
        </div>
      </div>
    </Wrapper>
  );
};
export default Details;
