import { useEffect } from "react";
import useUploadResources from "./useUploadResources";
import ResourceForm from "./resource-form";
import ResourcesAction from "./resource-actions";
import ResourcesList from "./resources-list";
import ElementNotFound from "../../../../../../components/UI/element-not-found";

type Props = {
  onCancel: (value: boolean) => void;
  onResetForm?: () => void;
  onSubmit?: () => void;
  parentId?: number;
  parent?: "lesson" | "resource";
  title?: string;
  onSaved?: () => void | Promise<void>;
};

export default function ResourceUpload({
  onCancel,
  onSubmit,
  parentId,
  parent = "lesson",
  title,
  onSaved,
}: Props) {
  const {
    resourceName,
    setResourceName,
    filesList,
    filesNumber,
    handleFileChange,
    handleRemoveResource,
    handleReorder,
    handleSubmit,
    isLoading,
    resetFilesList,
    uploadProgress,
    cancelUpload,
    hasError,
  } = useUploadResources(onCancel, onSubmit, parentId, parent, onSaved, title);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      return "Êtes-vous sûr de vouloir quitter ?";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <section className="grid grid-cols-1 gap-4">
      <article className="flex flex-col gap-y-4">
        <ResourceForm
          value={resourceName}
          onChange={setResourceName}
          onFileChange={handleFileChange}
        />
        <ResourcesAction
          onCancel={onCancel}
          resetFilesList={resetFilesList}
          filesNumber={filesNumber}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
          cancelUpload={cancelUpload}
          hasError={hasError}
        />
      </article>
      <article>
        {filesList && filesList.length !== 0 ? (
          <ResourcesList
            filesList={filesList}
            handleRemoveResource={handleRemoveResource}
            isLoading={isLoading}
            onReorder={handleReorder}
            uploadProgress={uploadProgress}
          />
        ) : (
          <div className="flex justify-center items-center h-full">
            <ElementNotFound message="Aucune ressource en attente de téléversement." />
          </div>
        )}
      </article>
    </section>
  );
}
