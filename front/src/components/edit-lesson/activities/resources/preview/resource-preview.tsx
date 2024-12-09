import { PlusCircle } from "lucide-react";
import Activity, {
  Resource as ActivityResource,
} from "../../../../../utils/interfaces/activity";
import { useCallback, useEffect, useState } from "react";
import ResourceForm from "../post/resource-form";
import useForm from "../../../../UI/forms/hooks/use-form";
import { allowedMimeTypes, Resource } from "../post/useUploadResources";
import { regexGeneric } from "../../../../../utils/constantes";
import toast from "react-hot-toast";
import useHttp from "../../../../../hooks/use-http";
import ResourcesAction from "../post/resource-actions";
import ResourcesList from "../post/resources-list";
import { DndWrapper } from "../../../../UI/DndWrapper";
import { useDragAndDrop } from "../../../../../hooks/useDragAndDrop";
import ResourceItem from "./resource-item";
import Modal from "../../../../UI/modal/modal";

type Props = {
  activity: Activity;
  onCancel: () => void;
};

let timer: NodeJS.Timeout | null = null;

function ResourcePreview({ activity, onCancel }: Props) {
  const [resources, setResources] = useState<ActivityResource[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const { values, errors, onChangeValue } = useForm();
  const [uploadList, setUploadList] = useState<Resource[]>([]);
  const { error, isLoading, sendRequest, uploadProgress } = useHttp();
  const { handleDragEnd, submit, setSubmit } = useDragAndDrop({
    items: resources,
    onReorder: setResources,
  });
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  const handleReorderResources = useCallback(() => {
    const applyData = (data: { success: boolean; message: string }) => {
      if (data.success) toast.success(data.message);
      if (timer) clearTimeout(timer);
    };
    timer = setTimeout(() => {
      sendRequest(
        {
          path: `/activity/reorder-resource/${activity.id}`,
          method: "put",
          body: resources.map((resource) => resource.id),
        },
        applyData
      );
    }, 1000);
  }, [sendRequest, resources, activity.id]);

  const getResources = useCallback(() => {
    const applyData = (data: {
      success: boolean;
      resources: ActivityResource[];
    }) => {
      if (data.success) setResources(data.resources);
    };
    sendRequest({ path: `/activity/resources/${activity.id}` }, applyData);
  }, [activity.id, sendRequest]);

  const data = { values, errors, onChangeValue };

  /**
   * Gère l'ajout d'un nouveau fichier à la liste
   * Vérifie le type MIME et ajoute le fichier si valide
   */
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      // Vérification du type de fichier
      let error = !regexGeneric.test(values.name);
      console.log("hello");

      if (allowedMimeTypes.includes(event.target.files[0].type)) {
        uploadList?.forEach((file) => {
          if (file.file.name === event.target.files![0].name) {
            error = true;
            toast.error("Ce fichier se trouve déjà dans la liste");
          }
        });
        if (
          activity.resourceActivities &&
          activity.resourceActivities.length > 0
        ) {
          activity.resourceActivities.forEach((resource) => {
            if (resource.label === values.name) {
              error = true;
              toast.error("Une ressource avec ce nom existe déjà");
            }
          });
        }
        const resource = [
          ...(uploadList ?? []),
          {
            name: values.name,
            file: event.target.files[0],
            hasError: error,
          },
        ];
        setUploadList(resource);
        // Réinitialisation du champ de fichier
        event.target.value = "";
        onChangeValue("name", "");
      } else {
        toast.error(
          "Type de fichier non autorisé. Formats acceptés : PDF, PPT, PPTX, TXT, DOC, DOCX"
        );
        return;
      }
    }
  };

  const handleAddResource = () => {
    const formData = new FormData();

    // Ajout des fichiers au FormData avec validation du nom
    uploadList?.forEach((file) => {
      if (regexGeneric.test(file.name)) {
        formData.append("files", file.file);
      } else {
        toast.error("Le nom de la ressource n'est pas valide");
        return;
      }
    });

    // Callback après la requête réussie
    const applyData = (data: { success: boolean; message: string }) => {
      if (data.success) toast.success(data.message);
      setUploadList([]);
      toast.success(data.message);
      handleCancel();
      getResources();
    };

    // Préparation des métadonnées des ressources
    let resources: { label: string; filename: string }[] = [];
    for (const item of uploadList!) {
      resources = [
        ...resources,
        { label: item.name, filename: item.file.name },
      ];
    }

    // Ajout des métadonnées au FormData
    formData.append("data", JSON.stringify(resources));

    // Envoi de la requête POST au serveur
    sendRequest(
      {
        path: `/activity/add-resource/${activity.id}`,
        method: "put",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      },
      applyData
    );
  };

  const handleCancel = () => {
    setIsAdding(false);
    onCancel();
  };

  const handleRemoveFromUploadList = (indexToRemove: number) => {
    setUploadList((prevState) =>
      prevState.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleSetResourceToDelete = (id: number) => {
    setIsDeleting(id);
  };

  const handleCancelDelete = () => {
    setIsDeleting(null);
  };

  const handleDeleteResource = () => {
    if (isDeleting) {
      const applyData = (data: { success: boolean; message: string }) => {
        if (data.success) toast.success(data.message);
        setIsDeleting(null);
        setResources((prevState) =>
          prevState.filter((resource) => resource.id !== isDeleting)
        );
      };
      sendRequest(
        { path: `/activity/resource/${isDeleting}`, method: "delete" },
        applyData
      );
    }
  };

  useEffect(() => {
    getResources();
  }, [getResources]);

  useEffect(() => {
    if (submit) {
      handleReorderResources();
      setSubmit(false);
    }
  }, [submit, handleReorderResources, setSubmit]);

  useEffect(() => {
    if (error.length > 0) toast.error(error);
    setSubmit(false);
    if (timer) clearTimeout(timer);
  }, [error, setSubmit]);

  return (
    <div className="flex flex-col gap-y-4">
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
