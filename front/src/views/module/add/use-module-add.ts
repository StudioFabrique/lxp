import { useCallback, useEffect, useState } from "react";
import useHttp from "../../../hooks/use-http";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Contact from "../../../utils/interfaces/contact";
import Skill from "../../../utils/interfaces/skill";

// type de données pour les listes
export type Item = {
  id: number;
  title: string;
  formationId?: number;
};

const useModuleAdd = () => {
  const { isLoading, error, sendRequest } = useHttp();
  const nav = useNavigate();
  const [formationsList, setFormationsList] = useState<Item[]>([]);
  const [formation, setFormation] = useState<number | undefined>(undefined);
  const [parcoursList, setParcoursList] = useState<Item[]>([]);
  const [parcours, setParcours] = useState<number | undefined>(undefined);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);

  useEffect(() => {
    if (error.length > 0) {
      toast.error(error);
    }
  }, [error]);

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

  const fetchParcoursSkillsContacts = useCallback(() => {}, []);

  /**
   * requête pour récupérer la liste des formations dans la bdd
   */
  useEffect(() => {
    const processData = (data: Array<Item>) => {
      setFormationsList(data);
    };
    sendRequest(
      {
        path: "/formation",
      },
      processData
    );
  }, [sendRequest]);

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
        },
        processData
      );
    }
  }, [formation, sendRequest]);

  return {
    formationsList,
    parcoursList,
    formation,
    parcours,
    handleFormation,
    handleParcours,
  };
};

export default useModuleAdd;
