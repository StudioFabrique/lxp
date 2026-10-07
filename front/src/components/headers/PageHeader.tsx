import { PropsWithChildren } from "react";
import { cn } from "../../utils/cn";
import { formatTitle } from "../../utils/helpers/text-helpers";
import BoxWrapper from "../wrappers/BoxWrapper";
import SidebarRouteIcon from "./SidebarRouteIcon";

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
    <BoxWrapper
      onClick={props.onClick}
      className={cn(
        "mb-6 h-auto w-full flex-row flex-wrap items-center justify-between gap-3 px-4 shadow-none select-none",
        !props.successBgColor && "themed-page-header",
        props.isSubHeader ? "py-2" : "py-4",
        props.isSubHeader && !props.disabled && "ring-1",
        props.hasError && "ring-2 ring-error",
        props.successBgColor && "bg-success",
        props.disabled && "opacity-15",
        props.onClick && "cursor-pointer hover:opacity-50",
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        {!props.isSubHeader && <SidebarRouteIcon />}
        <div>
          <h2
            className={cn(
              "flex-1",
              props.isSubHeader ? "text-lg font-bold" : "text-xl font-extrabold",
              props.classname,
            )}
          >
            {formatTitle(props.title)}
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
      </div>
      <div
        className={cn("header-actions flex w-full min-w-0 flex-wrap items-center justify-start gap-2 sm:w-auto sm:justify-end", !props.isSubHeader && "header-actions-main")}
      >
        {props.children}
      </div>
    </BoxWrapper>
  );
};

export default PageHeader;
