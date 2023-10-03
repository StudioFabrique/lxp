import { sortArray } from "../utils/sortArray";

/**
 * transforme un cours venant de la bdd en Objet Course pouvant être
 * utilisé dans le frontend
 * @param course any
 * @returns Course
 */
export default function formatCourseFromHttp(course: any) {
  let updatedData = {
    ...course,
    module: {
      ...course.module,
      contacts: course.module.contacts.map((item: any) => item.contact),
      parcours: {
        ...course.module.parcours[0].parcours,
        tags: sortArray(
          course.module.parcours[0].parcours.tags.map((item: any) => item.tag),
          "name"
        ),
        formation: course.module.parcours[0].parcours.formation,
      },
    },
  };

  if (updatedData.image) {
    updatedData = {
      ...updatedData,
      image: `data:image/jpeg;base64,${updatedData.image}`,
    };
  }

  if (updatedData.module.parcours.tags.length === 0) {
    const tmp = sortArray(
      course.module.parcours[0].parcours.formation.tags.map(
        (item: any) => item.tag
      ),
      "name"
    );
    updatedData = {
      ...updatedData,
      module: {
        ...updatedData.module,
        parcours: {
          ...updatedData.module.parcours,
          tags: tmp,
        },
      },
    };
  }

  if (!updatedData.tags) {
    updatedData = { ...updatedData, tags: [] };
  }

  if (!updatedData.contacts) {
    updatedData = { ...updatedData, contacts: [] };
  }

  return updatedData;
}
