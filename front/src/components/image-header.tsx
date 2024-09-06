import { ReactNode } from "react";

interface ImageHeaderProps {
  imageUrl: string;
  title: string;
  subTitle: string;
  isPublished?: boolean;
  hidePublished?: boolean;
  children?: ReactNode[]; // composant contenant une icône svg
}

const ImageHeader = (props: ImageHeaderProps) => {
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
      <div className="w-full h-full flex flex-col justify-end items-start relative">
        <div className="rounded-xl absolute top-0 left-0 w-full h-full bg-neutral/50 z-0" />
        {props.children[1]}
        <div className="w-full flex gap-x-2 px-4 py-5 items-end justify-between font-bold absolute z-10 bottom-2 left-2">
          <span className="flex gap-x-2 items-center">
            <div>{props.children[0]}</div>
            <div>
              <h1 className="text-xl text-white">
                {props.title}
                {!props.hidePublished &&
                  (props.isPublished ? "-(Publié)" : "-(Brouillon)")}
              </h1>
              <h3 className="capitalise text-white">{props.subTitle}</h3>
            </div>
          </span>
        </div>
      </div>
    </div>
  );
};

export default ImageHeader;
