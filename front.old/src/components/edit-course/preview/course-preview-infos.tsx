import { useSelector } from "react-redux";
import SubWrapper from "../../UI/sub-wrapper/sub-wrapper.component";
import EditIcon from "../../UI/svg/edit-icon";
import Wrapper from "../../UI/wrapper/wrapper.component";
import Course from "../../../utils/interfaces/course";
import ContactsList from "../../edit-parcours/preview/contacts-list.component";
import TagsList from "../../edit-parcours/preview/tags-list.component";

interface CoursePreviewInfosProps {
  onEdit: (id: number) => void;
}

const CoursePreviewInfos = (props: CoursePreviewInfosProps) => {
  const course = useSelector(
    (state: any) => state.courseInfos.course
  ) as Course;

  return (
    <Wrapper>
      <div className="flex flex-col gap-y-8">
        <span className="w-full flex justify-between items-center">
          <h2 className="text-xl font-bold">Informations</h2>
          <div
            className="w-6 h-6 text-primary cursor-pointer"
            onClick={() => props.onEdit(1)}
          >
            <EditIcon />
          </div>
        </span>
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Colonne #1 */}
          <article className="flex flex-col gap-y-4">
            <Wrapper>
              <h2 className="text-xl font-bold">Module</h2>
              <SubWrapper>{course.module.title}</SubWrapper>
              <h2 className="text-xl font-bold">Titre du cours</h2>
              <SubWrapper>{course.title}</SubWrapper>
              <h2 className="text-xl font-bold">Description du cours</h2>
              <div className="text-xs max-h-[35vh] overflow-auto scrollbar scrollbar-thumb-secondary scrollbar-track-primary">
                <SubWrapper>
                  <div className="p-4">{course.description}</div>
                </SubWrapper>
              </div>
              <h2 className="text-xl font-bold">Classe virtuelle</h2>
              <SubWrapper>
                <p>{course.virtualClass || "Non renseigné"}</p>
              </SubWrapper>
            </Wrapper>
          </article>
          {/* Colonne #2 */}
          <article className="flex flex-col gap-y-8">
            <Wrapper>
              <h2 className="text-xl font-bold">Ressources et contacts</h2>
              <ContactsList contactsList={course.contacts} />
            </Wrapper>
            <Wrapper>
              <h2 className="text-xl font-bold">Tags</h2>
              <TagsList tagsList={course.tags} />
            </Wrapper>
          </article>
        </div>
      </div>
    </Wrapper>
  );
};

export default CoursePreviewInfos;
