import {
  Download,
  Edit2Icon,
  Files,
  FileText,
  GripVertical,
  PlusCircle,
  Trash2,
} from "lucide-react";
import Activity from "../../../../../utils/interfaces/activity";
import Wrapper from "../../../../UI/wrapper/wrapper.component";
import { ACTIVITIES } from "../../../../../config/urls";
import { useState } from "react";
import ResourceForm from "../post/resource-form";
import useForm from "../../../../UI/forms/hooks/use-form";
import { allowedMimeTypes, Resource } from "../post/useUploadResources";
import { regexGeneric } from "../../../../../utils/constantes";
import toast from "react-hot-toast";

type Props = {
  activity: Activity;
};

function ResourcePreview({ activity }: Props) {
  const [isAdding, setIsAdding] = useState(false);
  const { values, errors, onChangeValue } = useForm();
  const [uploadList, setUploadList] = useState<Resource[]>([]);

  const handleDownload = (url: string) => {
    window.open(ACTIVITIES + "/files/" + url, "_blank");
  };

  const data = { values, errors, onChangeValue };

  const displayIcon = (url: string) => {
    const extension = url.split(".").pop();
    switch (extension) {
      case "pdf":
        return <Files className="text-info" />;
      case "ppt":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="lucide lucide-images text-info"
          >
            <path d="M18 22H4a2 2 0 0 1-2-2V6" />
            <path d="m22 13-1.296-1.296a2.41 2.41 0 0 0-3.408 0L11 18" />
            <circle cx="12" cy="8" r="2" />
            <rect width="16" height="16" x="6" y="2" rx="2" />
          </svg>
        );
      default:
        return <FileText className="text-info" />;
    }
  };

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

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex justify-end">
        {isAdding ? null : (
          <button
            className="btn btn-primary flex items-center gap-x-2"
            onClick={() => setIsAdding((prevState) => !prevState)}
          >
            <>
              <PlusCircle /> <p>Ajouter une ressource</p>
            </>
          </button>
        )}
      </div>

      {isAdding ? (
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <ResourceForm
            data={{
              ...data,
              errors: { name: data.errors.map((e) => e.message) },
            }}
            onFileChange={() => {}}
          />
        </div>
      ) : null}

      <ul className="flex flex-col gap-y-2">
        {activity && activity.resourceActivities ? (
          activity.resourceActivities.map((resource) => (
            <li key={resource.id}>
              <Wrapper>
                <div className="grid grid-cols-4">
                  <span className="col-span-1 flex gap-x-4 items-center">
                    <GripVertical className="text-primary" />{" "}
                    {displayIcon(resource.url)}
                  </span>
                  <span className="col-span-2">{resource.label}</span>
                  <span className="col-span-1 flex gap-x-8 items-center justify-end">
                    <button onClick={() => handleDownload(resource.url)}>
                      <Download className="text-primary" />
                    </button>
                    <button>
                      <Edit2Icon className="text-primary" />
                    </button>
                    <button>
                      <Trash2 className="text-error" />
                    </button>
                  </span>
                </div>
              </Wrapper>
            </li>
          ))
        ) : (
          <p>Aucune ressource</p>
        )}
      </ul>
    </div>
  );
}

export default ResourcePreview;
