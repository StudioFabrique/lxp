import { FC } from "react";
import DeleteButton from "../../buttons/delete-button.component";
import User from "../../../../utils/interfaces/user";

const TeacherItem: FC<{ teacher: User; onDelete: (_id: string) => void }> = ({
  teacher,
  onDelete,
}) => {
  const handleDelete = () => {
    onDelete(teacher._id!);
  };
  return (
    <div className="flex justify-between bg-secondary-content p-2 rounded-lg w-full items-center">
      <p className="">
        {teacher.firstname} {teacher.lastname}
      </p>
      <DeleteButton onDelete={handleDelete} color="red" />
    </div>
  );
};

export default TeacherItem;
