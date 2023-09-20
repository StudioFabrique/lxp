/* eslint-disable @typescript-eslint/no-explicit-any */
import { regexGeneric /* regexUrl */ } from "../utils/constantes";
import Contact from "../utils/interfaces/contact";
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
  console.log(objectives);

  return objectives.length > 0;
};

const testSkills = (skills: Array<Skill>) => {
  return skills.length > 0;
};

const testModules = (modules: Array<Module>) => {
  return modules.length > 0;
};

export function testStep(id: number, data: any) {
  const validationErrors = Array<any>();
  switch (id) {
    case 1:
      if (!testTitle(data as string)) {
        validationErrors.push({
          title: "Titre du parcours non valide",
        });
      }
      break;
    case 2:
      if (!testObjectives(data as Objective[])) {
        validationErrors.push({
          objectives: "Le parcours doit avoir au moins un objectif",
        });
      }
      break;
    case 3:
      if (!testSkills(data as Skill[])) {
        validationErrors.push({
          skills: "Le parcours doit avoir au moins une compétence",
        });
      }
      break;
    case 4:
      if (!testModules(data as Module[])) {
        validationErrors.push({
          modules: "Le parcours doit avoir au moins un module",
        });
      }
      break;
    // TOTO METTRE LES N° DES CASES À JOUR QD LE CALENDRIER ET LA LISTE DES ÉTUDIANTS AURONT ÉTÉ MERGE
    case 5:
      break;
    case 6:
      console.log({ id });

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
      /*       if (!testVirtualClass(data.virtualClass)) {
        validationErrors.push({
          virtualClass:
            "Le parcours n'a pas de lien vers une salle de classe virtuelle",
        });
        return validationErrors;
      } */
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
      if (!testModules(data.modules)) {
        validationErrors.push({
          modules: "Le parcours doit avoir au moins un module",
        });
        return validationErrors;
      }
      return [];
    default:
      return [];
  }
  return validationErrors;
}

/*   if (Object.keys(validationErrors).length > 0) {
  } */
