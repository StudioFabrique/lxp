import { PropsWithChildren } from "react";
import { cn } from "../../utils/helpers/style-helpers";

interface Props {
  title: string;
  alternateBgColor?: boolean;
  successBgColor?: boolean;
  disabled?: boolean;
  description?: string;
  isSubHeader?: boolean;
  hasError?: boolean;
  classname?: string;
  onClick?: () => void;
}

const PageHeader = (props: PropsWithChildren<Props>) => {
  return (
    <div
      onClick={props.onClick}
      className={cn(
        // Classes de base
        "w-full flex px-4 items-center justify-between rounded-lg select-none mb-6",
        // Padding vertical conditionnel
        props.isSubHeader ? "py-2" : "py-4",
        // Ring / Bordures conditionnelles
        props.isSubHeader && !props.disabled && "ring-1",
        props.hasError && "ring-2 ring-error",
        // Couleur de fond conditionnelle
        props.alternateBgColor
          ? "bg-base-200"
          : props.successBgColor
            ? "bg-success"
            : "bg-secondary/20",
        // États désactivé ou cliquable
        props.disabled && "opacity-15",
        props.onClick && "cursor-pointer hover:opacity-50",
      )}
    >
      <div>
        <h2
          className={cn(
            "flex-1",
            props.isSubHeader ? "text-lg font-bold" : "text-xl font-extrabold",
            props.classname,
          )}
        >
          {props.title}
        </h2>
        <p
          className={cn(
            props.isSubHeader ? "text-[8.5pt]" : "text-xs",
            props.hasError ? "text-error" : "text-base-content",
          )}
        >
          {props.description}
        </p>
      </div>
      <div className="flex justify-end items-center">{props.children}</div>
    </div>
  );
};

export default PageHeader;
