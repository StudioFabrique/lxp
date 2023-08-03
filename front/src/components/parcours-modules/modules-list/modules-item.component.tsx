import { FC } from "react";
import Module from "../../../utils/interfaces/module";
import EditButton from "../buttons/edit-button.component";
import ViewButton from "../buttons/view-button.component";
import DeleteButton from "../buttons/delete-button.component";
import { useDispatch } from "react-redux";
import {
  deleteParcoursModule,
  updateCurrentParcoursModule,
} from "../../../store/redux-toolkit/parcours/parcours-modules";

const ModulesItem: FC<{
  module: Module;
  /* onUpdate?: (title: string, description: string, imageFile: File) => void; */
}> = ({ module }) => {
  const dispatch = useDispatch();

  const handleDelete = () => {
    dispatch(deleteParcoursModule(module._id));
  };

  const handleBeginEdit = () => {
    console.log("test");

    dispatch(updateCurrentParcoursModule(module._id));
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
        <EditButton background onBeginEdit={handleBeginEdit} />
        <DeleteButton background color="red" onDelete={handleDelete} />
      </div>
    </div>
  );
};

export default ModulesItem;
