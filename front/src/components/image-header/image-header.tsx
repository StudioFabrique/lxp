import { CornerDownRight } from "lucide-react";
import { ReactNode } from "react";
import { Link } from "react-router";
import { bgImageGradient } from "../../utils/helpers/color-helpers";
import { cn } from "../../utils/cn";

interface ImageHeaderProps {
  imageUrl: string;
  title: ReactNode;
  titleIcon?: ReactNode;
  subTitle: ReactNode;
  subTitleIcon?: ReactNode;
  subTitleLinkTo?: string;
  isPublished?: boolean;
  hidePublished?: boolean;
  reserveActionSpace?: boolean;
  bottomAction?: ReactNode;
  titlePosition?: "top" | "bottom";
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
    <div className="overflow-hidden" style={classImage}>
      <div className="w-full h-full flex flex-col justify-end items-start relative select-none">
        <div className="rounded-xl absolute top-0 left-0 w-full h-full bg-neutral/50 z-0" />
        {props.children ? props.children[1] : null}
        <div
          className={cn(
            "absolute bottom-2 right-2 left-2 z-5 flex min-w-0 items-end justify-between gap-x-2 px-4 py-5 font-bold",
            props.bottomAction && "flex-col gap-y-3",
            props.titlePosition === "top" && "top-2",
            props.reserveActionSpace && "pr-20 sm:pr-48",
          )}
        >
          <span
            className={cn(
              "flex min-w-0 flex-1 gap-x-2 overflow-hidden",
              props.bottomAction && "w-full flex-none",
            )}
          >
            {props.children ? props.children[0] : null}
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              {props.subTitle ? (
                <div className="flex min-w-0 items-center gap-2">
                  <span className="shrink-0">{props.subTitleIcon}</span>
                  {props.subTitleLinkTo ? (
                    <Link
                      className="min-w-0 max-w-full truncate first-letter:uppercase text-white hover:underline"
                      to={props.subTitleLinkTo}
                    >
                      {props.subTitle}
                    </Link>
                  ) : (
                    <h3 className="min-w-0 max-w-full truncate first-letter:uppercase text-white">
                      {props.subTitle}
                    </h3>
                  )}
                </div>
              ) : null}

              {props.title ? (
                <div className="flex min-w-0 items-center gap-2 pl-5">
                  <CornerDownRight className="shrink-0 stroke-white" />
                  <span className="shrink-0">{props.titleIcon}</span>
                  <h1 className="min-w-0 max-w-full flex-1 truncate text-xl text-white first-letter:uppercase">
                    {props.title}
                    {!props.hidePublished &&
                      (props.isPublished ? "-(Publié)" : "-(Brouillon)")}
                  </h1>
                </div>
              ) : null}
            </div>
          </span>
          {props.bottomAction ? (
            <div className="flex w-full justify-end">{props.bottomAction}</div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ImageHeader;
