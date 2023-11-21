/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSelector } from "react-redux";
import Objective from "../../../../utils/interfaces/objective";
import Skill from "../../../../utils/interfaces/skill";
import Module from "../../../../utils/interfaces/module";
import Group from "../../../../utils/interfaces/group";
import Tag from "../../../../utils/interfaces/tag";
import Contact from "../../../../utils/interfaces/contact";
import { useCallback } from "react";
import { testStep } from "../../../../helpers/parcours-steps-validation";

const useValidateParcours = () => {
  const infos = useSelector((state: any) => state.parcoursInformations.infos);
  const tags = useSelector((state: any) => state.tags.currentTags) as Tag[];
  const contacts = useSelector(
    (state: any) => state.parcoursContacts.currentContacts
  ) as Contact[];
  const objectives = useSelector(
    (state: any) => state.parcoursObjectives.objectives
  ) as Objective[];
  const skills = useSelector(
    (state: any) => state.parcoursSkills.skills
  ) as Skill[];
  const modules = useSelector(
    (state: any) => state.parcoursModules.modules
  ) as Module[];
  const groups = useSelector(
    (state: any) => state.parcoursGroups.groups
  ) as Group[];

  const validateParcours = useCallback(() => {
    return testStep({
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
