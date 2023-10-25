/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * pour la mise à jour de l'image en bdd, ne pas provoquer de rerender durant la requête,
 * en utilisant un loader par exemple. Sinon la requête sera bien effectuée (sauf problème coté réseau
 * ou serveur) mais l'image ne sera pas mise à jour dans la vue
 */

import React, { FC, useEffect, useRef, useState } from "react";

import ImageFileUpload from "./image-file-upload";
import ParcoursHeaderIcon from "../UI/svg/parcours-header-icon";
import { compressImage } from "../../helpers/compress-image";
import { headerImageMaxSize } from "../../config/images-sizes";

type Props = {
  image?: string;
  defaultImage: string;
  onUpdateImage: (image: File) => void;
  title: string;
  parentTitle: string;
  isPublished?: boolean;
};

const ImageHeader: FC<Props> = ({
  defaultImage,
  image,
  title,
  parentTitle,
  onUpdateImage,
  isPublished = false,
}) => {
  const [bgImage, setBgImage] = useState<any | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const isInitialRender = useRef(true);

  // en l'absence de props affiche une image par défaut
  useEffect(() => {
    if (isInitialRender.current) {
      if (!image) {
        setBgImage(defaultImage);
      } else {
        setBgImage(image);
      }
    } else {
      isInitialRender.current = false;
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
      {bgImage && parentTitle && title ? (
        <div style={classImage}>
          <div className="rounded-xl w-full h-full bg-neutral/50 flex flex-col justify-end items-start">
            <div className="w-full flex gap-x-2 px-4 py-2 items-end justify-between font-bold">
              <span className="flex gap-x-2 items-center">
                <ParcoursHeaderIcon size="lg" />
                <div>
                  <h1 className="text-xl">
                    {parentTitle} - {isPublished ? "(Publié)" : "(Brouillon)"}
                  </h1>
                  <h3 className="capitalise">{title}</h3>
                </div>
              </span>
              <span className="flex items-end">
                <ImageFileUpload
                  onSetFile={setNewFile}
                  maxSize={headerImageMaxSize}
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
