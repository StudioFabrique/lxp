import { normalizeImageSource } from "../../../utils/images/image-source";
import { sortArray } from "../../../utils/helpers/sort-array";

 
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function courseInfosFromHttp(course: any) {
  let updatedData = {
    ...course,
    virtualClass: course.virtualClass
      ? course.virtualClass
      : course.module.parcours.virtualClass ?? "",
    module: {
      ...course.module,
      contacts: course.module.contacts.map((item: any) => item.contact),
      parcours: {
        ...course.module.parcours,
        tags: sortArray(
          course.module.parcours.tags.map((item: any) => item.tag),
          "name",
        ),
        formation: course.module.parcours.formation,
      },
    },
  };

  if (updatedData.module.image) {
    updatedData = {
      ...updatedData,
      module: {
        ...updatedData.module,
        image: normalizeImageSource(updatedData.module.image) ?? "",
      },
    };
  }

  if (updatedData.module.parcours.tags.length === 0) {
    const tmp = sortArray(
      course.module.parcours.formation.tags.map((item: any) => item.tag),
      "name",
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
  } else {
    updatedData = {
      ...updatedData,
      tags: updatedData.tags.map((tag: any) => tag.tag),
    };
  }

  if (!updatedData.contacts) {
    updatedData = { ...updatedData, contacts: [] };
  } else {
    updatedData = {
      ...updatedData,
      contacts: updatedData.contacts.map((contact: any) => contact.contact),
    };
  }

  return updatedData;
}
