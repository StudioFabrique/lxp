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
      parcours: {
        ...course.module.parcours[0].parcours,
        tags: course.module.parcours[0].parcours.tags.map(
          (item: any) => item.tag
        ),
        contacts: course.module.parcours[0].parcours.contacts.map(
          (item: any) => item.contact
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
    const tmp = course.module.parcours[0].parcours.formation.tags.map(
      (item: any) => item.tag
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

  return updatedData;
}
