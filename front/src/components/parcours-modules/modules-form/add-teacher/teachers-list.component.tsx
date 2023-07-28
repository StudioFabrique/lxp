import { FC } from "react";
import User from "../../../../utils/interfaces/user";

const TeachersList: FC<{ teachers: User[] }> = ({ teachers }) => {
  return (
    <div className="flex flex-col gap-y-2 mt-5">
      {teachers.map((teacher) => (
        <p className="bg-secondary-content p-2 rounded-lg" key={teacher._id}>
          {teacher.firstname} {teacher.lastname}
        </p>
      ))}
    </div>
  );
};

export default TeachersList;
