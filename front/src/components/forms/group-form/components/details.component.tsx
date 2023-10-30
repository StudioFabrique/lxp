import { FC, useEffect, useState } from "react";
import Wrapper from "../../../UI/wrapper/wrapper.component";
import Selecter from "../../../UI/selecter/selecter.component";
import useHttp from "../../../../hooks/use-http";

// type de données pour les listes
type Item = {
  id: number;
  title: string;
  formationId?: number;
};

const Details: FC<{
  onSelectParcours: (id: number) => void;
}> = ({ onSelectParcours }) => {
  const { sendRequest } = useHttp();

  const [formations, setFormations] = useState<Array<Item>>([]);
  const [formation, setFormation] = useState<number | undefined>(undefined);
  const [parcoursList, setParcoursList] = useState<Array<Item>>([]);
  const [parcours, setParcours] = useState<number | undefined>(undefined);

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
    setParcours(id);
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
      <h2 className="font-bold text-xl">Details</h2>
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
    </Wrapper>
  );
};
export default Details;
