/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * pour la mise à jour de l'image en bdd, ne pas provoquer de rerender durant la requête,
 * en utilisant un loader par exemple. Sinon la requête sera bien effectuée (sauf problème coté réseau
 * ou serveur) mais l'image ne sera pas mise à jour dans la vue
 */

import React, { FC, useEffect, useState } from "react";

import ImageFileUpload from "./image-file-upload";
import { useSelector } from "react-redux";
import ParcoursHeaderIcon from "../UI/svg/parcours-header-icon";
import { compressImage } from "../../helpers/compress-image";

type Props = {
  image?: string;
  defaultImage: string;
  onUpdateImage: (image: File) => void;
};

const ImageHeader: FC<Props> = ({ defaultImage, image, onUpdateImage }) => {
  const [bgImage, setBgImage] = useState<any | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const parcours = useSelector((state: any) => state.parcours);
  const parcoursInformations = useSelector(
    (state: any) => state.parcoursInformations
  );

  // en l'absence de props affiche une image par défaut
  useEffect(() => {
    if (!image) {
      setBgImage(defaultImage);
    } else {
      setBgImage(image);
    }
  }, [defaultImage, image]);

  const classImage: React.CSSProperties = {
    backgroundImage: `url('${bgImage}')`,
    width: "100%",
    height: "20rem",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    borderRadius: "0.75rem",
  };

  // récupération du fichier image choisit par l'utilisateur
  const setNewFile = async (newFile: File) => {
    const compressedFile = await compressImage(newFile, 1920);
    if (compressedFile) {
      setFile(compressedFile);
    }
  };

  // affichage de la nouvelle image
  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageString = reader.result as string;
        setBgImage(imageString);
      };
      reader.readAsDataURL(file);
      onUpdateImage(file);
    }
  }, [file, onUpdateImage]);

  return (
    <>
      {bgImage && parcours && parcoursInformations ? (
        <div style={classImage}>
          <div className="rounded-xl w-full h-full bg-neutral/50 flex flex-col justify-end items-start">
            <div className="w-full flex gap-x-2 px-4 py-2 items-end justify-between font-bold">
              <span className="flex gap-x-2 items-center">
                <ParcoursHeaderIcon size="lg" />
                <div>
                  <h1 className="text-xl">{parcours.formation.title}</h1>
                  <h3 className="capitalise">
                    {parcoursInformations.infos.title}
                  </h3>
                </div>
              </span>
              <span className="flex items-end">
                <ImageFileUpload
                  onSetFile={setNewFile}
                  maxSize={2 * 1024 * 1024}
                />
              </span>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default ImageHeader;
