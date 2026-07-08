import { Dispatch, SetStateAction } from "react";
import CustomError from "../../../../../../../src/utils/interfaces/custom-error";
import ResourcesAction from "./resource-actions";
import ResourceForm from "./resource-form";
import ResourcesList from "./resources-list";
import { Resource } from "./useUploadResources";

type Props = {
  data: {
    values: Record<string, unknown>;
    errors: CustomError[];
    onChangeValue: (name: string, value: string) => void;
  };
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
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
  data,
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
          data={{
            ...data,
            errors: { name: data.errors.map((e) => e.message) },
          }}
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
