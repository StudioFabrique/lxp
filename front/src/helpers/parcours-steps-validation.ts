/* eslint-disable @typescript-eslint/no-explicit-any */
import { regexGeneric /* regexUrl */ } from "../utils/constantes";
import Contact from "../utils/interfaces/contact";
import Group from "../utils/interfaces/group";
import Module from "../utils/interfaces/module";
import Objective from "../utils/interfaces/objective";
import Skill from "../utils/interfaces/skill";
import Tag from "../utils/interfaces/tag";

const testTitle = (title: string) => {
  return regexGeneric.test(title);
};

const testDescription = (description: string) => {
  return description && regexGeneric.test(description);
};

const testDates = (startDate: string, endDate: string) => {
  const sDate = new Date(startDate).getTime();
  const eDate = new Date(endDate).getTime();
  return eDate > sDate;
};

const testTags = (tags: Array<Tag>) => {
  return tags.length > 0;
};

const testContacts = (contacts: Array<Contact>) => {
  return contacts.length > 0;
};

/* const testVirtualClass = (virtualClass: string) => {
  return regexUrl.test(virtualClass);
}; */

const testObjectives = (objectives: Array<Objective>) => {
  return objectives.length > 0;
};

const testSkills = (skills: Array<Skill>) => {
  return skills.length > 0;
};

export const testModules = (modules: Array<Module>) => {
  let result = modules.length > 0;
  modules.forEach((module) => {
    if (module.contacts !== undefined && module.bonusSkills !== undefined) {
      if (
        module.duration === undefined ||
        module.contacts.length === 0 ||
        module.bonusSkills.length === 0
      ) {
        result = false;
      }
    } else {
      result = false;
    }
  });
  return result;
};

const testGroups = (groups: Array<Group>) => {
  return groups.length > 0;
};

export function testStep(data: any) {
  const validationErrors = Array<any>();
  /*       if (!testTitle(data.title as string)) {
        validationErrors.push({
          title: "Titre du parcours non valide",
        });
      }
      if (!testDates(data.startDate, data.endDate)) {
        validationErrors.push({
          dates: "Dates du parcours non valides",
        });
      }
      if (!testObjectives(data as Objective[])) {
        validationErrors.push({
          objectives: "Le parcours doit avoir au moins un objectif",
        });
      }
      if (!testSkills(data as Skill[])) {
        validationErrors.push({
          skills: "Le parcours doit avoir au moins une compétence",
        });
      }
      if (data === undefined || data.length === 0) {
        validationErrors.push({
          modules: "Le parcours doit avoir au moins un module",
        });
      }
      return [];
      if (!testGroups(data as Group[])) {
        validationErrors.push({
          groups: "Le parcours doit avoir au moins un groupe d'apprenants",
        });
      } */
  if (!testTitle(data.infos.title)) {
    validationErrors.push({
      title: "Titre du parcours non valide",
    });
    return validationErrors;
  }
  if (!testDescription(data.infos.description)) {
    validationErrors.push({
      description: "Description du parcours non valide",
    });
    return validationErrors;
  }
  if (!testDates(data.infos.startDate, data.infos.endDate)) {
    validationErrors.push({
      dates: "Dates du parcours non valides",
    });
    return validationErrors;
  }
  if (!testTags(data.tags)) {
    validationErrors.push({
      tags: "Le parcours doit avoir au moins un tag",
    });
    return validationErrors;
  }
  if (!testContacts(data.contacts)) {
    validationErrors.push({
      contacts: "Le parcours doit avoir au moins un contact",
    });
    return validationErrors;
  }
  if (!testObjectives(data.objectives as Objective[])) {
    validationErrors.push({
      objectives: "Le parcours doit avoir au moins un objectif",
    });
    return validationErrors;
  }
  if (!testSkills(data.skills as Skill[])) {
    validationErrors.push({
      skills: "Le parcours doit avoir au moins une compétence",
    });
    return validationErrors;
  }

  if (!data.modules || data.modules.length === 0) {
    console.log("coucou modules");
    validationErrors.push({
      modules: "Aucun module n'est attaché au parcours",
    });
    return validationErrors;
  }

  if (data.modules.length > 0 && !testModules(data.modules)) {
    console.log("coucou");
    validationErrors.push({
      modules: "Un ou plusieurs modules sont incomplets",
    });
    return validationErrors;
  }
  if (!testGroups(data.groups)) {
    validationErrors.push({
      groups:
        "Le parcours doit avoir au moins un groupe d'apprenants rattachés",
    });
  }
  return [];
}
