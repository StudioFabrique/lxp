import { regexGeneric, regexUrl } from "../utils/constantes";
import Contact from "../utils/interfaces/contact";
import Module from "../utils/interfaces/module";
import Objective from "../utils/interfaces/objective";
import Skill from "../utils/interfaces/skill";
import Tag from "../utils/interfaces/tag";

const testTitle = (title: string) => {
  return regexGeneric.test(title);
};

const testDescription = (description: string) => {
  return regexGeneric.test(description);
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

const testVirtualClass = (virtualClass: string) => {
  return regexUrl.test(virtualClass);
};

const testObjectives = (objectives: Array<Objective>) => {
  return objectives.length > 0;
};

const testSkills = (skills: Array<Skill>) => {
  return skills.length > 0;
};

const testModules = (modules: Array<Module>) => {
  return modules.length > 0;
};

export const validateInfos = (infos: any) => {
  const validationErrors = Array<any>();
  if (!testTitle(infos.title)) {
    validationErrors.push({
      title:
        "Titre du parcours manquant ou comportant des caractères non autorisés",
    });
  }
  if (!testDescription(infos.description)) {
    validationErrors.push({
      description:
        "Description du parcours manquante ou comportant des caractères non autorisés",
    });
  }
  if (!testDates(infos.startDate, infos.endDate)) {
    validationErrors.push({
      dates:
        "La date de fin du parcours ne doit pas être antérieure à la date du début du parcours",
    });
  }
  if (!testTags(infos.tags)) {
    validationErrors.push({ tags: "Le parcours doit avoir au moins un tag" });
  }
  if (!testContacts(infos.contacts)) {
    validationErrors.push({
      contacts: "Le parcours doit avoir au moins un contact",
    });
  }
  if (!testVirtualClass(infos.virtualClass)) {
    validationErrors.push({
      virtualClass:
        "Le parcours n'a pas de lien vers une salle de classe virtuelle",
    });
  }
  if (!testObjectives(infos.objectives)) {
    validationErrors.push({
      objectives: "Le parcours doit avoir au moins un objectif",
    });
  }
  if (!testSkills(infos.skills)) {
    validationErrors.push({
      skills: "Le parcours doit avoir au moins une compétence",
    });
  }
  if (!testModules(infos.modules)) {
    validationErrors.push({
      modules: "Le parcours doit avoir au moins un module",
    });
  }

  if (Object.keys(validationErrors).length > 0) {
    throw validationErrors;
  }
};
