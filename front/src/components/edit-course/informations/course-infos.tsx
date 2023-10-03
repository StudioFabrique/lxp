import { useSelector } from "react-redux";

import Wrapper from "../../UI/wrapper/wrapper.component";
import CourseInfosForm from "./course-infos-form";
import Contact from "../../../utils/interfaces/contact";
import InheritedContacts from "../../inherited-items/inherited-contacts";
import InheritedTags from "../../inherited-items/inherited-tags";
import Tag from "../../../utils/interfaces/tag";

const CourseInfos = () => {
  const title = useSelector(
    (state: any) => state.courseInfos.course.title
  ) as string;
  const description = useSelector(
    (state: any) => state.courseInfos.course.description
  ) as string;
  const contacts = useSelector(
    (state: any) => state.courseInfos.course.module.contacts
  ) as Contact[];
  const currentContacts = useSelector(
    (state: any) => state.courseInfos.course.contacts
  ) as Contact[];
  const tags = useSelector(
    (state: any) => state.courseInfos.course.module.parcours.tags
  ) as Tag[];
  const currentTags = useSelector(
    (state: any) => state.courseInfos.course.tags
  ) as Tag[];

  const handleSubmit = (data: { title: string; description: string }) => {};

  console.log({ tags });

  return (
    <div className="w-full">
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-8">
        <Wrapper>
          <h2 className="text-xl font-bold">Informations</h2>
          <div className="flex flex-col gap-y-8">
            <CourseInfosForm
              onSubmit={handleSubmit}
              courseTitle={title}
              courseDescription={description}
            />
          </div>
        </Wrapper>
        <div className="flex flex-col gap-y-8">
          <Wrapper>
            <InheritedContacts
              initialList={contacts}
              currentItems={currentContacts}
              property="name"
            />
          </Wrapper>
          <Wrapper>
            <InheritedTags
              initialList={tags}
              currentItems={currentTags}
              property="name"
            />
          </Wrapper>
        </div>
      </div>
    </div>
  );
};

export default CourseInfos;
