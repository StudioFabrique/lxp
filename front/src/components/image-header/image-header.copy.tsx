import { ReactNode } from "react";

interface ImageHeaderProps {
  imageUrl: string;
  title: string;
  subTitle: string;
  isPublished?: boolean;
  children: ReactNode[]; // composant contenant une icône svg
}

const ImageHeaderCopy = (props: ImageHeaderProps) => {
  const classImage: React.CSSProperties = {
    backgroundImage: `url(${props.imageUrl})`,
    width: "100%",
    height: "20rem",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    borderRadius: "0.75rem",
  };

  return (
    <div style={classImage}>
      <div className="rounded-xl w-full h-full flex flex-col justify-end items-start relative">
        <div className="absolute top-0 left-0 w-full h-full bg-neutral/50 z-0" />
        {props.children[1]}
        <div className="w-full flex gap-x-2 px-4 py-2 items-end justify-between font-bold absolute z-10">
          <span className="flex gap-x-2 items-center">
            <div className="w-12 h-12 text-white">{props.children[0]}</div>
            <div>
              <h1 className="text-xl text-white">
                {props.title} - {props.isPublished ? "(Publié)" : "(Brouillon)"}
              </h1>
              <h3 className="capitalise text-white">{props.subTitle}</h3>
            </div>
          </span>
        </div>
      </div>
    </div>
  );
};

export default ImageHeaderCopy;
