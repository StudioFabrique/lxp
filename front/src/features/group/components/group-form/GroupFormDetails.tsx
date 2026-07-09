/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useEffect, useState } from "react";
import Wrapper from "../../../../../src/components/wrappers/BoxWrapper";
import apiClient from "../../../../lib/axios";
import Group from "../../../../../src/utils/interfaces/group";
import Formation from "../../../../../src/utils/interfaces/formation";
import Parcours from "../../../../../src/utils/interfaces/parcours";
import SelecterWithId from "../../../../components/UI/selecter/selecter-with-id";

type Item = {
  id?: number;
  value: string;
  formationId?: number;
};

const GroupFormDetails: FC<{
  group?: Group;
  onSelectParcours: (id: number) => void;
  selectedParcoursId?: number | null;
}> = ({ group, onSelectParcours, selectedParcoursId }) => {
  const [formations, setFormations] = useState<Array<Item>>([]);
  const [formationId, setFormationId] = useState<number | undefined>(undefined);
  const [parcoursList, setParcoursList] = useState<Array<Item>>([]);

  const handleFormation = (id: number) => {
    setFormationId(id);
  };

  const handleParcours = (id: number) => {
    onSelectParcours(id);
  };

  useEffect(() => {
    if (formationId !== undefined) {
      (async () => {
        try {
          const response = await apiClient.get(
            `/parcours/parcours-by-formation/${formationId}`,
          );
          const data = response.data as { data: Array<Parcours> };
          const parcoursItems = data.data.map((item) => ({
            ...item,
            value: item.title,
          }));
          setParcoursList(parcoursItems);
        } catch {
          // silently fail
        }
      })();
    }
  }, [formationId]);

  useEffect(() => {
    (async () => {
      try {
        const response = await apiClient.get("/formation");
        const data = response.data as Array<Formation>;
        const formationsItems = data.map((item) => ({
          ...item,
          value: item.title,
        }));
        setFormations(formationsItems);
      } catch {
        // silently fail
      }
    })();
  }, []);

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
          <h2 className="font-bold text-xl">Détails</h2>
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
export default GroupFormDetails;
