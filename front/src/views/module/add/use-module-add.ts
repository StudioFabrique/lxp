import { useCallback, useEffect, useState } from "react";
import useHttp from "../../../hooks/use-http";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Contact from "../../../utils/interfaces/contact";
import Skill from "../../../utils/interfaces/skill";
import { moduleCreateSchema } from "../../../lib/validation/module-create-schema";
import { ZodError } from "zod";
import useForm from "../../../components/UI/forms/hooks/use-form";
import { validationErrors } from "../../../helpers/validate";

// type de données pour les listes
export type Item = {
  id: number;
  title: string;
  formationId?: number;
};

/**
 * Hook qui gère la logique de création d'un module
 * @returns un objet avec les propriétés suivantes :
 * - file : le fichier selectionné
 * - setFile : fonction pour mettre à jour le fichier selectionné
 * - formationsList : la liste des formations
 * - parcoursList : la liste des parcours liés à la formation selectionnée
 * - formation : l'id de la formation selectionnée
 * - parcours : l'id du parcours selectionné
 * - handleFormation : fonction pour mettre à jour la formation selectionnée
 * - handleParcours : fonction pour mettre à jour le parcours selectionné
 * - contacts : la liste des contacts du parcours selectionné
 * - skills : la liste des compétences du parcours selectionné
 * - isLoading : un booléen qui indique si une requête est en cours
 * - currentContacts : la liste des contacts actuellement selectionnés
 * - setCurrentContacts : fonction pour mettre à jour la liste des contacts actuellement selectionnés
 * - currentSkills : la liste des compétences actuellement selectionnées
 * - setCurrentSkills : fonction pour mettre à jour la liste des compétences actuellement selectionnées
 */
const useModuleAdd = () => {
  const { isLoading, error, sendRequest } = useHttp();
  const nav = useNavigate();
  const [formationsList, setFormationsList] = useState<Item[]>([]);
  const [formation, setFormation] = useState<number | undefined>(undefined);
  const [parcoursList, setParcoursList] = useState<Item[]>([]);
  const [parcours, setParcours] = useState<number | undefined>(undefined);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [currentContacts, setCurrentContacts] = useState<Contact[]>([]);
  const [currentSkills, setCurrentSkills] = useState<Skill[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const { errors, values, onChangeValue, onValidationErrors } = useForm();

  const data = { values, errors, onChangeValue };

  const handleValidateModule = (values: any) => {
    try {
      moduleCreateSchema.parse(values);
      return true;
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        onValidationErrors(validationErrors(error));
        return false;
      }
    }
  };

  const handleSubmit = () => {
    if (!handleValidateModule(data.values)) return;
    const formData = new FormData();
    const module = {
      ...data.values,
      formationId: formation,
      duration: +data.values.duration,
    };
    if (parcours) {
      const updatedModule = {
        ...module,
        parcoursId: parcours,
        contactsIds: currentContacts.map((item) => item.id),
        bonusSkillsIds: currentSkills.map((item) => item.id),
      };
      formData.append("module", JSON.stringify(updatedModule));
    } else formData.append("module", JSON.stringify(module));
    if (file) formData.append("image", file);
    const applyData = (data: any) => {
      if (data.success) {
        toast.success(data.message);
        nav("/admin/module");
      }
    };
    sendRequest(
      {
        path: "/modules/new-module",
        method: "post",
        body: formData,
      },
      applyData
    );
  };

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
   * fonction pour récupérer la liste des compétences et des contacts liés au parcours selectionné
   */
  const fetchParcoursSkillsContacts = useCallback(() => {
    const applyData = (data: any) => {
      setContacts(data.contacts);
      setSkills(data.skills);
    };
    sendRequest(
      {
        path: `/parcours/skills-contacts/${parcours}`,
      },
      applyData
    );
  }, [parcours, sendRequest]);

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

  useEffect(() => {
    if (parcours !== undefined) {
      fetchParcoursSkillsContacts();
    }
  }, [fetchParcoursSkillsContacts, parcours]);

  useEffect(() => {
    if (error.length > 0) {
      toast.error(error);
    }
  }, [error]);

  return {
    data,
    file,
    setFile,
    formationsList,
    parcoursList,
    formation,
    parcours,
    handleFormation,
    handleValidateModule,
    handleParcours,
    handleSubmit,
    contacts,
    skills,
    isLoading,
    currentContacts,
    setCurrentContacts,
    currentSkills,
    setCurrentSkills,
  };
};

export default useModuleAdd;
