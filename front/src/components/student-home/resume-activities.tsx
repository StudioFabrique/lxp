import Course from "../../utils/interfaces/course";

type ResumeActivitiesProps = {
  courses: Course[];
};

const ResumeActivities = ({ lastCourses }: ResumeActivitiesProps) => {
  return (
    <div>
      <h2 className="font-bold">
        Reprendre mes activités là où je m'étais arrêté
      </h2>
      <div className="">
        {courses.map((course) => (
          <div>
            <p>{course.module.title}</p>
            <p>{course.title}</p>
            <p></p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResumeActivities;
