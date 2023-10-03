import { useSelector } from "react-redux";

import Tags from "../../UI/tags/tags.component";
import Wrapper from "../../UI/wrapper/wrapper.component";
import Contacts from "../../edit-parcours/informations/contacts";
import CourseInfosForm from "./course-infos-form";

const CourseInfos = () => {
  const title = useSelector(
    (state: any) => state.courseInfos.course.title
  ) as string;
  const description = useSelector(
    (state: any) => state.courseInfos.course.description
  ) as string;

  const handleSubmit = (data: { title: string; description: string }) => {};

  console.log({ title });

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
            <Contacts contacts={[]} notSelectedContacts={[]} />
          </Wrapper>
          <Wrapper>
            <Tags onSubmitTags={() => {}} />
          </Wrapper>
        </div>
      </div>
    </div>
  );
};

export default CourseInfos;
