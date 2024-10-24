/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import Parcours from "../../utils/interfaces/parcours";

import defaultImage from "../../assets/images/books.jpeg";
import { Eye, Users } from "lucide-react";

interface ParcoursItemProps {
  parcours: Parcours;
}

export default function ParcoursItem({ parcours }: ParcoursItemProps) {
  const isInitialRender = useRef(true);
  const [bgImage, setBgImage] = useState<any | null>(null);
  // en l'absence de props affiche une image par défaut
  useEffect(() => {
    if (isInitialRender.current) {
      if (!parcours.thumb) {
        setBgImage(defaultImage);
      } else {
        setBgImage(`data:image/jpeg;base64,${parcours.thumb}`);
      }
    } else {
      isInitialRender.current = false;
    }
  }, [parcours.thumb]);

  const classImage: React.CSSProperties = {
    backgroundImage: `url('${bgImage}')`,
    width: "100%",
    height: "12rem",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    borderRadius: "0.75rem",
  };

  return (
    <div style={classImage}>
      <div className="rounded-xl w-full h-full flex flex-col justify-end items-start relative">
        <div className="absolute left-0 top-0 bg-neutral/20 z-0" />
        <div className="w-full flex gap-x-2 px-4 py-2 items-end justify-between font-bold absolute z-50">
          <span className="flex gap-x-2 items-center">
            <div>
              <h1 className="text-xl text-white capitalize">
                {parcours.title}
              </h1>
            </div>
          </span>
          <span className="flex justify-end items-end gap-2 text-white">
            <Eye className="w-5 h-5  cursor-pointer" />
          </span>
        </div>
      </div>
    </div>
  );
}
