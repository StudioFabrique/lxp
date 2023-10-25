import { regexGeneric } from "../utils/constantes";
import Contact from "../utils/interfaces/contact";
import CourseDates from "../utils/interfaces/course-dates";
import Lesson from "../utils/interfaces/lesson";
import Objective from "../utils/interfaces/objective";
import Skill from "../utils/interfaces/skill";
import Tag from "../utils/interfaces/tag";

const testTitle = (title: string) => {
  return regexGeneric.test(title);
};

const testDescription = (description: string) => {
  return description && regexGeneric.test(description);
};

const testTags = (tags: Array<Tag>) => {
  return tags && tags.length > 0;
};

const testContacts = (contacts: Array<Contact>) => {
  return contacts && contacts.length > 0;
};

const testObjectives = (objectives: Array<Objective>) => {
  return objectives && objectives.length > 0;
};

const testSkills = (skills: Array<Skill>) => {
  return skills && skills.length > 0;
};

const testLessons = (lessons: Lesson[]) => {
  return lessons && lessons.length > 0;
};

const testDates = (dates: CourseDates[]) => {
  return dates && dates.length > 0;
};

export function testStep(data: any) {
  const validationErrors = Array<any>();

  if (!testTitle(data.title)) {
    validationErrors.push({
      title: "Titre du cours non valide",
    });
    return validationErrors;
  }
  if (!testDescription(data.description)) {
    validationErrors.push({
      description: "Description du cours non valide",
    });
    return validationErrors;
  }
  if (!testTags(data.tags)) {
    validationErrors.push({
      tags: "Le cours doit avoir au moins un tag",
    });
    return validationErrors;
  }
  if (!testContacts(data.contacts)) {
    validationErrors.push({
      contacts: "Le cours doit avoir au moins un contact",
    });
    return validationErrors;
  }

  if (!testObjectives(data.objectives as Objective[])) {
    validationErrors.push({
      objectives: "Le cours doit avoir au moins un objectif",
    });
    return validationErrors;
  }
  if (!testSkills(data.skills as Skill[])) {
    validationErrors.push({
      skills: "Le cours doit avoir au moins une compétence",
    });
    return validationErrors;
  }
  if (!testLessons(data.lessons as Lesson[])) {
    validationErrors.push({
      lessons: "Le cours doit avoir au moins une leçon",
    });
  }
  if (!testDates(data.dates as CourseDates[])) {
    validationErrors.push({
      dates: "Le cours doit avoir au moins une plage de dates",
    });
  }
  return validationErrors;
}
