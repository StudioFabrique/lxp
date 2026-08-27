import { normalizeImageSource } from "../../../utils/images/image-source";
import { sortArray } from "../../../utils/helpers/sort-array";
import type Contact from "../../../utils/interfaces/contact";
import type Course from "../../../utils/interfaces/course";
import type Tag from "../../../utils/interfaces/tag";

type ContactRelation = Contact | { contact: Contact };
type TagRelation = Tag | { tag: Tag };

type CourseInfosHttpData = {
  virtualClass?: string | null;
  module: {
    image?: string | null;
    contacts: ContactRelation[];
    parcours: {
      virtualClass?: string | null;
      tags: TagRelation[];
      formation: {
        tags: TagRelation[];
      };
    };
  };
  tags?: TagRelation[] | null;
  contacts?: ContactRelation[] | null;
};

const getContact = (relation: ContactRelation): Contact =>
  "contact" in relation ? relation.contact : relation;

const getTag = (relation: TagRelation): Tag =>
  "tag" in relation ? relation.tag : relation;

export default function courseInfosFromHttp(
  course: CourseInfosHttpData,
): Course {
  let updatedData = {
    ...course,
    virtualClass: course.virtualClass
      ? course.virtualClass
      : course.module.parcours.virtualClass ?? "",
    module: {
      ...course.module,
      contacts: course.module.contacts.map(getContact),
      parcours: {
        ...course.module.parcours,
        tags: sortArray(
          course.module.parcours.tags.map(getTag),
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
      course.module.parcours.formation.tags.map(getTag),
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
      tags: updatedData.tags.map(getTag),
    };
  }

  if (!updatedData.contacts) {
    updatedData = { ...updatedData, contacts: [] };
  } else {
    updatedData = {
      ...updatedData,
      contacts: updatedData.contacts.map(getContact),
    };
  }

  return updatedData as unknown as Course;
}
