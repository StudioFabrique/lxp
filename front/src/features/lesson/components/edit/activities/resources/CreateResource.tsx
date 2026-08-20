import { Dispatch, SetStateAction } from "react";
import ResourcesAction from "./resource-actions";
import ResourceForm from "./resource-form";
import ResourcesList from "./resources-list";
import { Resource } from "./useUploadResources";

type Props = {
  resourceName: string;
  setResourceName: (name: string) => void;
  handleFileChange: (file: File) => void;
  handleCancel: () => void;
  handleAddResource: () => void;
  handleRemoveFromUploadList: (id: number) => void;
  isLoading: boolean;
  onReorder: (newList: Resource[]) => void;
  setUploadList: Dispatch<SetStateAction<Resource[]>>;
  uploadList: Resource[];
  uploadProgress: number | null;
};

function CreateResource({
  resourceName,
  setResourceName,
  handleFileChange,
  handleCancel,
  handleAddResource,
  handleRemoveFromUploadList,
  isLoading,
  onReorder,
  setUploadList,
  uploadList,
  uploadProgress,
}: Props) {
  return (
    <div className="grid grid-cols-1 gap-4">
      <span className="w-full flex flex-col gap-y-4">
        <ResourceForm
          value={resourceName}
          onChange={setResourceName}
          onFileChange={handleFileChange}
        />
        <ResourcesAction
          onCancel={handleCancel}
          resetFilesList={() => setUploadList([])}
          handleSubmit={handleAddResource}
          filesNumber={uploadList.length}
          isLoading={isLoading}
          hasError={false}
          cancelUpload={() => {}}
        />
      </span>
      {uploadList.length > 0 ? (
        <ResourcesList
          filesList={uploadList}
          handleRemoveResource={handleRemoveFromUploadList}
          isLoading={isLoading}
          onReorder={onReorder}
          uploadProgress={uploadProgress}
        />
      ) : (
        <span className="flex justify-center items-center">
          <p>Aucune ressource en attente de téléversement</p>
        </span>
      )}
    </div>
  );
}

export default CreateResource;
