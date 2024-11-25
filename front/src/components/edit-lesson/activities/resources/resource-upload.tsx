import { useEffect, useRef, useState } from "react";
import Field from "../../../UI/forms/field";
import useForm from "../../../UI/forms/hooks/use-form";
import SubmitButton from "../../../UI/submit-button";
import Wrapper from "../../../UI/wrapper/wrapper.component";
import SubWrapper from "../../../UI/sub-wrapper/sub-wrapper.component";
import { FileText, Loader, Trash2 } from "lucide-react";

type Props = {
  onCancel: (value: boolean) => void;
  onResetForm: () => void;
};

type Resource = {
  name: string;
  file: File;
};

export default function ResourceUpload({ onCancel }: Props) {
  const ref = useRef<HTMLInputElement>(null);
  const [filesList, setFilesList] = useState<Resource[] | null>(null);
  const { errors, values, onChangeValue, onResetForm } = useForm();
  const data = { values, errors, onChangeValue };
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      console.log(event.target.files[0].type);
      const resource = [
        ...(filesList ?? []),
        { name: values.name, file: event.target.files[0] },
      ];
      setFilesList(resource);
    }
    // reset la valeur du fichier sélectionné
    event.target.value = "";
    onChangeValue("name", "");
  };

  // Retourne la taille du fichier en ko ou mo
  const displaySize = (size: number) => {
    const convertedSize = size / 1024;

    return convertedSize < 1024
      ? `${convertedSize.toFixed(2)} ko`
      : `${(convertedSize / 1024).toFixed(2)} mo`;
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
              <button className="btn btn-secondary" onClick={onResetForm}>
                Réinitialiser
              </button>
              <SubmitButton
                label="Sauvegarder"
                isLoading={false}
                loadingLabel="En cours..."
              />
            </span>
          </div>
        </Wrapper>
      </article>
      <article>
        <ul className="pl-8 flex flex-col items-center gap-y-2">
          {filesList?.map((resource, index) => (
            <li className="w-full" key={index}>
              <SubWrapper>
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
                  <Trash2 className="w-4 h-4 text-error cursor-pointer" />
                </div>
              </SubWrapper>
            </li>
          ))}
        </ul>
      </article>
    </section>
  );
}
