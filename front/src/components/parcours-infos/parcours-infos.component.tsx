import React, { ChangeEvent, FC, useEffect, useMemo, useState } from "react";
import useInput from "../../hooks/use-input";
import { regexGeneric } from "../../utils/constantes";
import { autoSubmitTimer } from "../../config/auto-submit-timer";

const ParcoursInfos: FC<{
  onSubmitInformations: (infos: any) => void;
}> = ({ onSubmitInformations }) => {
  console.log("infos is rendering");
  const { value: title } = useInput((value) => regexGeneric.test(value.trim()));
  const { value: description } = useInput((value) =>
    regexGeneric.test(value.trim())
  );
  const { value: degree } = useInput((value) =>
    regexGeneric.test(value.trim())
  );
  const [file, setFile] = useState<File | null>(null);

  const infos = useMemo(() => {
    return {
      title: title.value,
      description: description.value,
      degree: degree.value,
      file,
    };
  }, [title.value, description.value, degree.value, file]);

  useEffect(() => {
    const timer = setTimeout(() => {
      onSubmitInformations(infos);
    }, autoSubmitTimer);

    return () => {
      clearTimeout(timer);
    };
  }, [infos, onSubmitInformations]);

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
            className="file-input file-input-sm file-input-primary w-full bg-secondary/10 rounded-lg"
            onChange={handleFileChange}
          />
        </div>
      </form>
    </div>
  );
};

export default ParcoursInfos;
