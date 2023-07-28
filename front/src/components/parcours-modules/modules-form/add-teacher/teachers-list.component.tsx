import { FC } from "react";
import User from "../../../../utils/interfaces/user";
import TeacherItem from "./teacher-item.component";

const TeachersList: FC<{
  teachers: User[];
  onDelete: (_id: string) => void;
}> = ({ teachers, onDelete }) => {
  return (
    <div className="flex flex-col gap-y-2 mt-5">
      {teachers.map((teacher) => (
        <TeacherItem teacher={teacher} onDelete={onDelete} key={teacher._id} />
      ))}
    </div>
  );
};

export default TeachersList;
