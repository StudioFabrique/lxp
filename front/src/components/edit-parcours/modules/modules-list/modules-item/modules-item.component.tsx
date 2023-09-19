import { FC, useEffect } from "react";
import Module from "../../../../../utils/interfaces/module";
import EditButton from "./buttons/edit-button.component";
import ViewButton from "./buttons/view-button.component";
import DeleteButton from "./buttons/delete-button.component";
import { useDispatch } from "react-redux";
import { parcoursModulesSliceActions } from "../../../../../store/redux-toolkit/parcours/parcours-modules";
import { toast } from "react-hot-toast";
import useHttp from "../../../../../hooks/use-http";

const ModulesItem: FC<{
  module: Module;
  /* onUpdate?: (title: string, description: string, imageFile: File) => void; */
}> = ({ module }) => {
  const dispatch = useDispatch();
  const { sendRequest } = useHttp();

  const image = URL.createObjectURL(
    new Blob([new Uint8Array(module.image.data)], {
      type: "application/octet-stream",
    })
  );

  const handleDelete = () => {
    const applyData = (data: any) => {
      dispatch(parcoursModulesSliceActions.deleteParcoursModule(data.moduleId));
      toast.success("Module supprimé avec success");
    };
    console.log(module);

    sendRequest(
      {
        path: `/module/${module.id}`,
        method: "delete",
      },
      applyData
    );
  };

  const handleBeginEdit = () => {
    dispatch(
      parcoursModulesSliceActions.updateCurrentParcoursModule(module.id)
    );
  };

  return (
    <div className="flex justify-between">
      <div className="pl-4 flex items-center p-3 bg-primary-content w-full rounded-lg">
        <span className="w-[25%]">
          <img
            className="object-fill h-20 w-20 rounded-md"
            src={image}
            alt="module preview"
          />
        </span>
        <span className="w-[75%]">
          <p>{module.title}</p>
        </span>
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
