/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import Field from "../../../UI/forms/field";
import useForm from "../../../UI/forms/hooks/use-form";
import Wrapper from "../../../UI/wrapper/wrapper.component";
import SubWrapper from "../../../UI/sub-wrapper/sub-wrapper.component";
import { FileText, Loader, Trash2 } from "lucide-react";
import useHttp from "../../../../hooks/use-http";
import toast from "react-hot-toast";
import { regexGeneric } from "../../../../utils/constantes";
import { useParams } from "react-router-dom";

type Props = {
  onCancel: (value: boolean) => void;
  onResetForm: () => void;
};

type Resource = {
  name: string;
  file: File;
  hasError: boolean;
};

export default function ResourceUpload({ onCancel }: Props) {
  const ref = useRef<HTMLInputElement>(null);
  const [filesList, setFilesList] = useState<Resource[] | null>(null);
  const { errors, values, onChangeValue } = useForm();
  const data = { values, errors, onChangeValue };
  const { isLoading, sendRequest } = useHttp();
  const { lessonId } = useParams();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      console.log(event.target.files[0].type);

      const allowedMimeTypes = [
        "application/pdf",
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "text/plain",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];

      if (allowedMimeTypes.includes(event.target.files[0].type)) {
        const resource = [
          ...(filesList ?? []),
          {
            name: values.name,
            file: event.target.files[0],
            hasError: !regexGeneric.test(values.name),
          },
        ];
        setFilesList(resource);
        // reset la valeur du fichier sélectionné
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

  const handleRemoveResource = (index: number) => {
    setFilesList(filesList!.filter((_, i) => i !== index));
  };

  const resetFilesList = () => {
    setFilesList(null);
    onChangeValue("name", "");
  };

  // Retourne la taille du fichier en ko ou mo
  const displaySize = (size: number) => {
    const convertedSize = size / 1024;

    return convertedSize < 1024
      ? `${convertedSize.toFixed(2)} ko`
      : `${(convertedSize / 1024).toFixed(2)} mo`;
  };

  const handleSubmit = () => {
    const formData = new FormData();
    filesList?.forEach((file) => {
      if (regexGeneric.test(file.name)) {
        formData.append("files", file.file);
      } else {
        toast.error("Le nom de la ressource n'est pas valide");
        return;
      }
    });
    const applyData = (data: { success: boolean; message: string }) => {
      if (data.success) toast.success(data.message);
      onCancel(false);
    };
    let resources: { label: string; filename: string }[] = [];
    for (const item of filesList!) {
      resources = [
        ...resources,
        { label: item.name, filename: item.file.name },
      ];
    }
    formData.append("data", JSON.stringify(resources));
    sendRequest(
      {
        path: `/activity/resource/${lessonId}`,
        method: "post",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      },
      applyData
    );
  };

  useEffect(() => {
    // Fonction qui sera appelée avant que l'utilisateur ne quitte la page
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      // Annule la fermeture par défaut et affiche un message
      event.preventDefault();
      event.returnValue = "Êtes-vous sûr de vouloir quitter ?";
    };

    // Ajoute l'écouteur d'événement
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Nettoie l'écouteur quand le composant est démonté
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <section className="grid xl:grid-cols-2 gap-4">
      <article className="flex flex-col gap-y-4">
        <Wrapper>
          <span className="h-full flex flex-col gap-y-2">
            <h2 className="text-lg font-bold">Ressources</h2>
            <div
              className="flex flex-col justify-around h-full gap-y-4"
              onSubmit={() => {}}
            >
              <span className="flex flex-col gap-y-4">
                <Field name="name" label="Nom du lien *" data={data} />
              </span>
              <input
                className="file-input file-input-bordered file-input-primary w-full max-w-md"
                ref={ref}
                type="file"
                onChange={handleFileChange}
                disabled={!values.name || values.name.length === 0}
              />
            </div>
          </span>
        </Wrapper>
        <Wrapper>
          <div className="flex justify-between items-center">
            <button
              className="btn btn-primary btn-outline"
              onClick={() => onCancel(false)}
            >
              Annuler
            </button>
            <span className="flex justify-end items-center gap-x-4">
              <button className="btn btn-secondary" onClick={resetFilesList}>
                Réinitialiser
              </button>
              <button
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={!filesList || filesList?.length === 0 || isLoading}
              >
                Téléverser
              </button>
            </span>
          </div>
        </Wrapper>
      </article>
      <article>
        <ul className="pl-8 flex flex-col items-center gap-y-2">
          {filesList?.map((resource, index) => (
            <li className="w-full" key={index}>
              <SubWrapper hasError={resource.hasError}>
                <div className="w-full flex justify-between items-center text-xs">
                  <span className="w-full flex items-center">
                    <div className="w-1/6">
                      {isLoading ? <Loader /> : <FileText />}
                    </div>
                    <p className="w-2/6 truncate">{resource.name}</p>
                    <p className="w-2/6 truncate">{resource.file.name}</p>
                    <p className="w-1/6 truncate">
                      {displaySize(resource.file.size)}
                    </p>
                  </span>
                  <button onClick={() => handleRemoveResource(index)}>
                    <Trash2 className="w-4 h-4 text-error cursor-pointer" />
                  </button>
                </div>
              </SubWrapper>
            </li>
          ))}
        </ul>
      </article>
    </section>
  );
}
