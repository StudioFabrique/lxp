import { regexGeneric } from "../../../config/constantes";
import type Contact from "../../../utils/interfaces/contact";
import type Group from "../../../utils/interfaces/group";
import type Module from "../../../utils/interfaces/module";
import type Objective from "../../../utils/interfaces/objective";
import type Skill from "../../../utils/interfaces/skill";
import type Tag from "../../../utils/interfaces/tag";

const testTitle = (title: string) => {
  return regexGeneric.test(title);
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function testParcoursStep(data: any) {
  const validationErrors = Array<any>();

  if (!testTitle(data.infos.title)) {
    validationErrors.push({
      title: "Titre du parcours non valide",
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
  if (!testObjectives(data.objectives)) {
    validationErrors.push({
      objectives: "Le parcours doit avoir au moins un objectif",
    });
    return validationErrors;
  }
  if (!testSkills(data.skills)) {
    validationErrors.push({
      skills: "Le parcours doit avoir au moins une compétence",
    });
    return validationErrors;
  }

  if (!data.modules || data.modules.length === 0) {
    validationErrors.push({
      modules: "Aucun module n'est attaché au parcours",
    });
    return validationErrors;
  }

  if (data.modules.length > 0 && !testModules(data.modules)) {
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
