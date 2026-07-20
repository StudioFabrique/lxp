import { useParcoursSelector } from "../store/ParcoursContext";
import { useCallback } from "react";
import { testParcoursStep } from "../../../utils/helpers/parcours-steps-validation";

const useValidateParcours = () => {
  const infos = useParcoursSelector((state) => state.parcoursInformations.infos);
  const tags = useParcoursSelector((state) => state.tags.currentTags);
  const contacts = useParcoursSelector((state) => state.parcoursContacts.currentContacts);
  const objectives = useParcoursSelector((state) => state.parcoursObjectives.objectives);
  const skills = useParcoursSelector((state) => state.parcoursSkills.skills);
  const modules = useParcoursSelector((state) => state.parcoursModules.modules);
  const groups = useParcoursSelector((state) => state.parcoursGroups.groups);

  const validateParcours = useCallback(() => {
    return testParcoursStep({
      infos,
      tags,
      contacts,
      objectives,
      skills,
      modules,
      groups,
    });
  }, [contacts, groups, infos, modules, objectives, skills, tags]);

  return { validateParcours };
};

export default useValidateParcours;
