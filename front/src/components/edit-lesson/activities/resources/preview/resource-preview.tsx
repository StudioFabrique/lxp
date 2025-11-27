// Import des dépendances nécessaires
import { PlusCircle } from "lucide-react";
import type { Activity } from "../../../../../utils/interfaces/activity";
import { DndWrapper } from "../../../../UI/DndWrapper";
import ResourceItem from "./resource-item";
import Modal from "../../../../UI/modal/modal";
import useUpdateResources from "./use-update-resources";
import ResourceUpdate from "./resource-update";
import CreateResource from "../CreateResource";
import ElementNotFound from "../../../../UI/element-not-found";

// Props du composant
type Props = {
  activity: Activity;
  onCancel: () => void;
};

/**
 * Composant permettant de prévisualiser et gérer les ressources d'une activité
 * @param activity - L'activité dont on veut gérer les ressources
 * @param onCancel - Fonction appelée lors de l'annulation
 */
function ResourcePreview({ activity, onCancel }: Props) {
  // Récupération des fonctions et états depuis le hook personnalisé
  const {
    data,
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
  } = useUpdateResources(activity, onCancel);

  return (
    <div className="flex flex-col gap-y-4">
      {/* Bouton d'ajout de ressource */}
      <div className="flex justify-between items-end">
        {/* Message d'aide pour modifier l'ordre des ressources */}
        <p className="text-xs italic">
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

      {/* Formulaire d'ajout de ressource */}
      {isAdding ? (
        <CreateResource
          data={data}
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

      {/* Liste des ressources existantes avec drag and drop */}
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

      {/* Modal de confirmation de suppression */}
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
