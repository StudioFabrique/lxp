// Import des dépendances nécessaires
import { PlusCircle } from "lucide-react";
import Activity from "../../../../../utils/interfaces/activity";
import ResourceForm from "../post/resource-form";
import ResourcesAction from "../post/resource-actions";
import ResourcesList from "../post/resources-list";
import { DndWrapper } from "../../../../UI/DndWrapper";
import ResourceItem from "./resource-item";
import Modal from "../../../../UI/modal/modal";
import useUpdateResources from "./use-update-resources";

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
    handleSetResourceToDelete,
    isAdding,
    isDeleting,
    isLoading,
    resources,
    setIsAdding,
    setUploadList,
    uploadList,
    uploadProgress,
  } = useUpdateResources(activity, onCancel);

  return (
    <div className="flex flex-col gap-y-4">
      {/* Bouton d'ajout de ressource */}
      <div className="flex justify-end">
        {isAdding ? null : (
          <button
            className="btn btn-primary flex items-center gap-x-2"
            onClick={() => setIsAdding((prevState) => !prevState)}
          >
            <>
              <PlusCircle className="w-4 h-4" /> <p>Ajouter une ressource</p>
            </>
          </button>
        )}
      </div>

      {/* Formulaire d'ajout de ressource */}
      {isAdding ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
          <ResourcesList
            filesList={uploadList}
            handleRemoveResource={handleRemoveFromUploadList}
            isLoading={isLoading}
            onReorder={() => {}}
            uploadProgress={uploadProgress}
          />
        </div>
      ) : null}

      {/* Liste des ressources existantes avec drag and drop */}
      <ul className="flex flex-col gap-y-2">
        {activity && resources ? (
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
                />
              </li>
            )}
          />
        ) : (
          <p>Aucune ressource</p>
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
    </div>
  );
}

export default ResourcePreview;
