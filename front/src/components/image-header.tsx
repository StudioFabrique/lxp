import { CornerDownRight } from "lucide-react";
import { ReactNode } from "react";
import { Link } from "react-router";
import bgImageGradient from "../utils/bg-image-gradient";

interface ImageHeaderProps {
  imageUrl: string;
  title: string;
  titleIcon?: ReactNode;
  subTitle: string;
  subTitleIcon?: ReactNode;
  subTitleLinkTo?: string;
  isPublished?: boolean;
  hidePublished?: boolean;
  children?: ReactNode[];
}

const ImageHeader = (props: ImageHeaderProps) => {
  const classImage: React.CSSProperties = {
    backgroundImage: bgImageGradient(props.imageUrl),
    width: "100%",
    height: "20rem",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    borderRadius: "0.75rem",
  };

  return (
    <div style={classImage}>
      <div className="w-full h-full flex flex-col justify-end items-start relative select-none">
        <div className="rounded-xl absolute top-0 left-0 w-full h-full bg-neutral/50 z-0" />
        {props.children ? props.children[1] : null}
        <div className="w-full flex gap-x-2 px-4 py-5 items-end justify-between font-bold absolute z-5 bottom-2 left-2">
          <span className="flex gap-x-2">
            {props.children ? props.children[0] : null}
            <div className="flex flex-col gap-1">
              {props.subTitle ? (
                <div className="flex items-center gap-2">
                  {props.subTitleIcon}
                  {props.subTitleLinkTo ? (
                    <Link
                      className="capitalise text-white hover:underline truncate max-w-125"
                      to={props.subTitleLinkTo}
                    >
                      {props.subTitle}
                    </Link>
                  ) : (
                    <h3 className="capitalise text-white truncate max-w-125">
                      {props.subTitle}
                    </h3>
                  )}
                </div>
              ) : null}

              {props.title ? (
                <div className="pl-5 flex items-center gap-2">
                  <CornerDownRight className="stroke-white" />
                  {props.titleIcon}
                  <h1 className="text-xl text-white truncate max-w-137.5">
                    {props.title}
                    {!props.hidePublished &&
                      (props.isPublished ? "-(Publié)" : "-(Brouillon)")}
                  </h1>
                </div>
              ) : null}
            </div>
          </span>
        </div>
      </div>
    </div>
  );
};

export default ImageHeader;
