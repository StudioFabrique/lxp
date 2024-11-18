/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useEffect, useState } from "react";
import Wrapper from "../../../UI/wrapper/wrapper.component";
import useHttp from "../../../../hooks/use-http";
import Group from "../../../../utils/interfaces/group";
import Formation from "../../../../utils/interfaces/formation";
import Parcours from "../../../../utils/interfaces/parcours";
import SelecterWithId from "../../../UI/selecter/selecter-with-id";

// type de données pour les listes
type Item = {
  id?: number;
  value: string;
  formationId?: number;
};

const Details: FC<{
  group?: Group;
  onSelectParcours: (id: number) => void;
  selectedParcoursId?: number;
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
      const processData = (data: { data: Array<Parcours> }) => {
        const parcoursItems = data.data.map((item) => ({
          ...item,
          value: item.title,
        }));
        setParcoursList(parcoursItems);
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
    const processData = (data: Array<Formation>) => {
      const formationsItems = data.map((item) => ({
        ...item,
        value: item.title,
      }));
      setFormations(formationsItems);
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
          <SelecterWithId
            list={formations}
            title="Choisissez une formation"
            onSelectItem={handleFormation}
            id={formationId}
          />
          <SelecterWithId
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
