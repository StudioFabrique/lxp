import { useEffect } from "react";
import useUploadResources from "./useUploadResources";
import ResourceForm from "./resource-form";
import ResourcesAction from "./resource-actions";
import ResourcesList from "./resources-list";
import ElementNotFound from "../../../../../../../src.legacy/components/UI/element-not-found";
import Wrapper from "../../../../../../../src.legacy/components/UI/wrapper/wrapper.component";

type Props = {
  onCancel: (value: boolean) => void;
  onResetForm?: () => void;
  onSubmit?: () => void;
};

export default function ResourceUpload({ onCancel, onSubmit }: Props) {
  const {
    data,
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
  } = useUploadResources(onCancel, onSubmit);

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
        <Wrapper>
          <ResourceForm
            data={{
              ...data,
              errors: { name: data.errors.map((e) => e.message) },
            }}
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
        </Wrapper>
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
