import { FC, MouseEvent, MouseEventHandler } from "react";
import Module from "../../../utils/interfaces/module";
import EditButton from "../buttons/edit-button.component";
import ViewButton from "../buttons/view-button.component";
import DeleteButton from "../buttons/delete-button.component";

const ModulesItem: FC<{
  module: Module;
  onUpdate?: (title: string, description: string, imageFile: File) => void;
  onDelete: (_id: string) => void;
}> = ({ module, onDelete }) => {
  const handleDelete = () => {
    onDelete(module._id!);
  };

  return (
    <div className="flex justify-between">
      <div className="flex items-center p-3 bg-primary-content w-full rounded-lg">
        <span>
          <img
            className="object-cover h-14 w-14 rounded-lg"
            src={module.imageUrl}
            alt="module preview"
          />
        </span>
        <p className="ml-5">{module.title}</p>
      </div>
      <div className="flex flex-col gap-y-1 justify-between ml-2">
        <ViewButton background />
        <EditButton background />
        <DeleteButton onDelete={handleDelete} background color="red" />
      </div>
    </div>
  );
};

export default ModulesItem;
