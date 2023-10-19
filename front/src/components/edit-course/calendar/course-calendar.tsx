import Module from "module";
import { useSelector } from "react-redux";
import Wrapper from "../../UI/wrapper/wrapper.component";
import DatePicker from "../../edit-parcours/calendrier/date-picker";

const CourseCalendar = () => {
  const module = useSelector(
    (state: any) => state.courseInfos.course.module
  ) as Module;

  return (
    <div className="w-full flex flex-col gap-y-8">
      <h2 className="text-3xl font-extrabold">Calendrier</h2>
      <Wrapper>
        <DatePicker />
      </Wrapper>
    </div>
  );
};

export default CourseCalendar;
