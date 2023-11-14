import Lesson from "../../utils/interfaces/lesson";
import DocumentIcon from "../UI/svg/document-icon";
import EditIcon from "../UI/svg/edit-icon";
import Wrapper from "../UI/wrapper/wrapper.component";

interface PreviewLessonsProps {
  lessons: Lesson[];
  onEdit: (id: number) => void;
}

const PreviewLessons = (props: PreviewLessonsProps) => {
  const { lessons } = props;

  return (
    <Wrapper>
      <span className="w-full flex justify-between items-center">
        <h2 className="text-xl font-bold">Leçons du cours</h2>
        <div className="w-6 h-6 text-primary" onClick={() => props.onEdit(4)}>
          <EditIcon />
        </div>
      </span>
      <ul className="flex flex-col gap-y-2">
        {lessons.map((lesson) => (
          <li key={lesson.id}>
            <div className="w-full h-full flex items-center gap-x-4 p-5 rounded-lg bg-secondary/20">
              <div className="w-8 h-8 text-primary">
                <DocumentIcon />
              </div>
              <p className="flex-1">{lesson.title}</p>
            </div>
          </li>
        ))}
      </ul>
    </Wrapper>
  );
};

export default PreviewLessons;
