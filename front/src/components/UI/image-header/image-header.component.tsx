import React, { FC, useEffect, useState } from "react";
import axios from "axios";

import ParcoursHeaderIcon from "../svg-icons/parcours-header-icon";
import ImageFileUpload from "../image-file-upload/image-file-upload";

type Props = {
  image?: string;
};

const ImageHeader: FC<Props> = ({ image }) => {
  const title = "Développeur Web";
  const parcours = "Dév Web 2023";
  const [bgImage, setBgImage] = useState<any | null>(null);
  const [file, setFile] = useState<File | null>(null);

  // en l'absence de props affiche une image par défaut
  useEffect(() => {
    if (image) {
      setBgImage(image);
    } else {
      const fetchImage = async () => {
        const image = await fetchUnsplash();
        console.log({ image });

        setBgImage(image);
      };
      fetchImage();
    }
  }, [image]);

  let classImage: React.CSSProperties = {
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

  // affichage de la nouvelle image
  useEffect(() => {
    if (file) {
      console.log(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBgImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }, [file]);

  const fetchUnsplash = async () => {
    const response = await axios.get("https://api.unsplash.com/search/photos", {
      headers: {
        "",
      },
      params: { query: "business" },
    });
    const results = await response.data.results[0].links.html;

    return results;
  };

  return (
    <>
      {bgImage ? (
        <div style={classImage}>
          <div className="rounded-xl w-full h-full bg-neutral/50 flex flex-col justify-end items-start">
            <div className="w-full flex gap-x-2 px-4 py-2 items-end justify-between font-bold">
              <span className="flex gap-x-2 items-center">
                <ParcoursHeaderIcon size="lg" />
                <div>
                  <h1 className="text-xl">{title}</h1>
                  <h3>{parcours}</h3>
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
