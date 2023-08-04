/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC, useCallback, useEffect, useState } from "react";

import { useSelector } from "react-redux";
import useHttp from "../../../hooks/use-http";
import defaultImage from "../../../assets/images/parcours-default.jpg";
import ParcoursHeaderIcon from "../svg-icons/parcours-header-icon";
import ImageUpload from "./image-upload";

type Props = {
  image?: string;
};

const ImageHeader: FC<Props> = ({ image }) => {
  const [bgImage, setBgImage] = useState<any | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const parcours = useSelector((state: any) => state.parcours);
  const parcoursInformations = useSelector(
    (state: any) => state.parcoursInformations
  );
  const { sendRequest } = useHttp();

  console.log({ parcoursInformations });
  console.log({ parcours });

  // en l'absence de props affiche une image par défaut
  useEffect(() => {
    console.log({ image });

    if (!image) {
      setBgImage(defaultImage);
    } else {
      setBgImage(image);
    }
  }, [image]);

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
  const setNewFile = (newFile: File) => {
    setFile(newFile);
  };

  const updateImage = useCallback(
    (image: File) => {
      const formData = new FormData();
      formData.append("parcoursId", parcours.id);
      formData.append("image", image);

      const processData = (data: any) => {
        console.log(data);
      };

      sendRequest(
        {
          path: "/parcours/update-image",
          method: "put",
          body: formData,
        },
        processData
      );
    },
    [parcours.id, sendRequest]
  );

  // affichage de la nouvelle image
  useEffect(() => {
    if (file) {
      updateImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageString = reader.result as string;
        setBgImage(imageString);
      };
      reader.readAsDataURL(file);
    }
  }, [file, updateImage]);

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
                  <h3>{parcoursInformations.infos.title}</h3>
                </div>
              </span>
              <span className="flex items-end">
                <ImageUpload onSetFile={setNewFile} maxSize={2 * 1024 * 1024} />
              </span>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default ImageHeader;
