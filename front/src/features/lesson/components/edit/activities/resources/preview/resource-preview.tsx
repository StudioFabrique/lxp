import { PlusCircle } from "lucide-react";
import type { Activity } from "../../../../../../../../src/utils/interfaces/activity";
import { DndWrapper } from "../../../../../../../../src/components/UI/DndWrapper";
import ResourceItem from "./resource-item";
import Modal from "../../../../../../../components/UI/modal/modal";
import useUpdateResources from "./use-update-resources";
import ResourceUpdate from "./resource-update";
import CreateResource from "../CreateResource";
import ElementNotFound from "../../../../../../../components/UI/element-not-found";

type Props = {
  activity: Activity;
  onCancel: () => void;
  parent?: "lesson" | "resource";
  onSubmit?: () => void;
};

function ResourcePreview({
  activity,
  onCancel,
  parent = "lesson",
  onSubmit,
}: Props) {
  const {
    resourceName,
    setResourceName,
    handleAddResource,
    handleCancel,
    handleCancelDelete,
    handleDeleteResource,
    handleDragEnd,
    handleFileChange,
    handleRemoveFromUploadList,
    handleReorder,
    handleSetResourceToDelete,
    handleUpdateResource,
    isAdding,
    isDeleting,
    isLoading,
    isUpdating,
    resources,
    setIsAdding,
    setIsUpdating,
    setUploadList,
    uploadList,
    uploadProgress,
  } = useUpdateResources(activity, onCancel, parent, onSubmit);

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex justify-between items-center">
        <p className="text-xs italic mr-8">
          {isAdding
            ? ""
            : resources && resources.length > 1
              ? "( Modifier l'ordre des ressources en déplaçant une ressource vers l'endroit souhaité grâce à un glisser/déposer )"
              : ""}
        </p>
        {isAdding ? null : (
          <button
            className="btn btn-primary flex items-center gap-x-2"
            onClick={() => setIsAdding((prevState) => !prevState)}
          >
            <>
              <PlusCircle className="w-4 h-4" />
              <p>Ajouter des ressource</p>
            </>
          </button>
        )}
      </div>

      {isAdding ? (
        <CreateResource
          resourceName={resourceName}
          setResourceName={setResourceName}
          handleFileChange={handleFileChange}
          handleCancel={handleCancel}
          handleAddResource={handleAddResource}
          handleRemoveFromUploadList={handleRemoveFromUploadList}
          onReorder={handleReorder}
          uploadList={uploadList}
          isLoading={isLoading}
          uploadProgress={uploadProgress}
          setUploadList={setUploadList}
        />
      ) : null}

      <ul className="flex flex-col gap-y-2">
        {activity && resources && resources.length > 0 ? (
          <DndWrapper
            droppableId="resources"
            items={resources}
            isLoading={isLoading}
            onDragEnd={handleDragEnd}
            renderItem={(resource) => (
              <li key={resource.id}>
                <ResourceItem
                  resource={resource}
                  onDeleteResource={handleSetResourceToDelete}
                  onUpdateResource={setIsUpdating}
                />
              </li>
            )}
          />
        ) : (
          <ElementNotFound message="Aucune ressource." />
        )}
      </ul>

      {isDeleting ? (
        <Modal
          onLeftClick={handleCancelDelete}
          onRightClick={handleDeleteResource}
          title="Supprimer une ressource"
          isSubmitting={isLoading}
          leftLabel="Annuler"
          rightLabel="Confirmer"
        >
          Votre ressource sera supprimée de manière définitive, confirmer ?
        </Modal>
      ) : null}

      {isUpdating ? (
        <ResourceUpdate
          resource={isUpdating}
          onCancel={() => setIsUpdating(null)}
          onSubmit={handleUpdateResource}
        />
      ) : null}
    </div>
  );
}

export default ResourcePreview;
