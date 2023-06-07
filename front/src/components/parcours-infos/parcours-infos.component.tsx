import { ChangeEvent, FC, useEffect, useState } from "react";
import useInput from "../../hooks/use-input";
import { regexGeneric } from "../../utils/constantes";

type Infos = {
  title: string | null;
  description: string | null;
  degree: string | null;
  file?: File;
};

const ParcoursInfos: FC<{
  onSubmitInformations: (infos: Infos) => void;
}> = ({ onSubmitInformations }) => {
  const { value: title } = useInput((value) => regexGeneric.test(value.trim()));
  const { value: description } = useInput((value) =>
    regexGeneric.test(value.trim())
  );
  const { value: degree } = useInput((value) =>
    regexGeneric.test(value.trim())
  );
  const [file, setFile] = useState<File>();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (title.isValid && description.isValid && degree.isValid) {
        const infos: Infos = {
          title: title.value,
          description: description.value,
          degree: degree.value,
          file,
        };
        onSubmitInformations(infos);
      }
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, [title, description, degree, file, onSubmitInformations]);

  const validateImageFile = (file: File) => {
    const allowedExtensions = /(\.jpeg|\.jpg|\.png|\.gif|\.webp)$/i;
    const maxSizeInBytes = 2 * 1024 * 1024; // 2 Mo

    if (!allowedExtensions.test(file.name)) {
      return false; // Extension de fichier non autorisée
    }

    if (file.size > maxSizeInBytes) {
      return false; // Fichier trop volumineux
    }

    return true; // Fichier valide
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFile = event.target.files[0];

      if (validateImageFile(selectedFile)) {
        setFile(selectedFile);
      } else {
        console.log("Fichier non autorisé pour une raison ou une autre.");
      }
    }
  };

  return (
    <div className="flex flex-col gap-y-4 p-4 rounded-lg bg-secondary/10">
      <h3 className="font-bold text-xl">Informations</h3>
      <form className="flex flex-col gap-y-4">
        <div className="flex flex-col gap-y-1">
          <label htmlFor="title">Titre</label>
          <input
            className="input input-sm w-full"
            name="title"
            type="text"
            value={title.value}
            onChange={title.valueChangeHandler}
            onBlur={title.valueBlurHandler}
          />
        </div>
        <div className="flex flex-col gap-y-1">
          <label htmlFor="description">Description</label>
          <textarea
            className="input w-full"
            name="description"
            rows={5}
            value={description.value}
            onChange={description.textAreaChangeHandler}
            onBlur={description.valueBlurHandler}
          />
        </div>
        <div className="flex flex-col gap-y-1">
          <label htmlFor="degree">Diplôme</label>
          <input
            className="input input-sm w-full"
            name="degree"
            type="text"
            value={degree.value}
            onChange={degree.valueChangeHandler}
            onBlur={degree.valueBlurHandler}
          />
        </div>
        <div className="flex flex-col gap-y-1">
          <label htmlFor="fileToUpload">Téléverser une image</label>
          <input
            type="file"
            className="file-input file-input-sm file-input-neutral w-full bg-secondary/10 rounded-lg"
            onChange={handleFileChange}
          />
        </div>
      </form>
    </div>
  );
};

export default ParcoursInfos;
