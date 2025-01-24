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
import SuccessWithMessage from "../../../utils/interfaces/success-with-message";

// type de données pour les listes
export type Item = {
  id: number;
  title: string;
  formationId?: number;
};

type ModuleForm = {
  title: string;
  description?: string;
  duration: number;
};

type SkillsContacts = {
  success: boolean;
  message: string;
  contacts: [{ id: number; idMdb: string; name: string; role: string }];
  skills: [{ id: number; description: string }];
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

  /**
   * fonction pour valider le formulaire de création d'un module
   * @param values les valeurs du formulaire
   * @returns true si le formulaire est valide, false sinon
   */
  const handleValidateModule = (values: ModuleForm) => {
    try {
      moduleCreateSchema.parse(values);
      return true;
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        onValidationErrors(validationErrors(error));
        console.log({ error });

        return false;
      }
    }
  };

  /**
   * fonction pour envoyer la requête de création d'un module
   */
  const handleSubmit = () => {
    const values = {
      ...data.values,
      // conversion de la chaîne de caractères "duration" en nombre pour respecter le schéma de validation
      duration: +data.values.duration,
    } as ModuleForm;
    if (!handleValidateModule(values)) return;
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
      console.log(JSON.stringify(updatedModule));

      formData.append("module", JSON.stringify(updatedModule));
    } else formData.append("module", JSON.stringify(module));
    if (file) formData.append("image", file);
    const applyData = (data: SuccessWithMessage) => {
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
   * fonction pour mettre à jour la formation selectionnée
   * @param id number
   */
  const handleFormation = (id: number) => {
    setFormation(id);
  };

  /**
   * fonction pour mettre à jour le parcours selectionné
   * @param id number
   */
  const handleParcours = (id: number) => {
    setParcours(id);
  };

  /**
   * fonction pour récupérer la liste des compétences et des contacts liés au parcours selectionné
   */
  const fetchParcoursSkillsContacts = useCallback(() => {
    const applyData = (data: SkillsContacts) => {
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
      const processData = (data: Item[]) => {
        setParcoursList(data);
      };
      sendRequest(
        {
          path: `/parcours/parcours-from-formation/${formation}`,
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
