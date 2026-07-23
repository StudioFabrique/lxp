import { useCallback } from "react";
import { testParcoursStep } from "../helpers/parcours-steps-validation";
import { useParams } from "react-router";
import { useParcoursQuery } from "./useParcoursQuery";
import { useParcoursSkills } from "./useParcoursSkills";
import { useParcoursGroupsQuery } from "./useParcoursGroupsQuery";
import { useParcoursModules } from "./useParcoursModules";

const useValidateParcours = () => {
  const { id } = useParams();
  const { data: parcours } = useParcoursQuery(id ? Number(id) : undefined);
  const parcoursId = id ? Number(id) : 0;
  const { skills } = useParcoursSkills(parcoursId);
  const { modules } = useParcoursModules(parcoursId);
  const { data: groups = [] } = useParcoursGroupsQuery(parcoursId);

  const validateParcours = useCallback(() => {
    return testParcoursStep({
      infos: {
        title: parcours?.title ?? "",
        startDate: parcours?.startDate ?? "",
        endDate: parcours?.endDate ?? "",
      },
      tags: parcours?.tags ?? [],
      contacts: parcours?.contacts ?? [],
      objectives: parcours?.objectives ?? [],
      skills,
      modules,
      groups,
    });
  }, [groups, modules, parcours, skills]);

  return { validateParcours };
};

export default useValidateParcours;
