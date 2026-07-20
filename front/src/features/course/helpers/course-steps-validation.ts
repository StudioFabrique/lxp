import { regexGeneric } from "../../../config/constantes";
import type Contact from "../../../utils/interfaces/contact";
import type Lesson from "../../../utils/interfaces/lesson";
import type Tag from "../../../utils/interfaces/tag";

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

const testLessons = (lessons: Lesson[]) => {
  return lessons && lessons.length > 0;
};

export function testCourseStep(data: Record<string, unknown>) {
  const validationErrors = Array<Record<string, string>>();

  if (!testTitle(data.title as string)) {
    validationErrors.push({
      title: "Titre du cours non valide",
    });
    return validationErrors;
  }
  if (!testDescription(data.description as string)) {
    validationErrors.push({
      description: "Description du cours non valide",
    });
    return validationErrors;
  }
  if (!testTags(data.tags as Array<Tag>)) {
    validationErrors.push({
      tags: "Le cours doit avoir au moins un tag",
    });
    return validationErrors;
  }
  if (!testContacts(data.contacts as Array<Contact>)) {
    validationErrors.push({
      contacts: "Le cours doit avoir au moins un contact",
    });
    return validationErrors;
  }

  if (!testLessons(data.lessons as Lesson[])) {
    validationErrors.push({
      lessons: "Le cours doit avoir au moins une leçon",
    });
  }

  return validationErrors;
}
