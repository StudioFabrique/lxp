/**
 * En tête pour les interfaces qui listent les groupes, les users, les parcours, etc...
 */

import { PropsWithChildren, type ReactNode } from "react";
import { cn } from "../../utils/cn";
import BoxWrapper from "../wrappers/BoxWrapper";
import SidebarRouteIcon from "./SidebarRouteIcon";

interface HeaderProps {
  title: ReactNode;
  alternateBgColor?: boolean;
  successBgColor?: boolean;
  disabled?: boolean;
  description?: string;
  isSubHeader?: boolean;
  hasError?: boolean;
  classname?: string;
  containerClassname?: string;
  onClick?: () => void;
}

const Header = (props: PropsWithChildren<HeaderProps>) => {
  return (
    <BoxWrapper
      onClick={props.onClick}
      className={cn(
        "h-auto w-full flex-row items-center justify-between px-4 shadow-none select-none",
        props.isSubHeader ? "py-2" : "py-4",
        props.isSubHeader && !props.disabled && "ring-1",
        props.hasError && "ring-2 ring-error",
        props.successBgColor && "bg-success",
        props.disabled && "opacity-15",
        props.onClick && "cursor-pointer hover:opacity-50",
        props.containerClassname,
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        {!props.isSubHeader && <SidebarRouteIcon />}
        <div>
          <h2
            className={`flex-1 ${props.isSubHeader ? "text-lg font-bold" : "text-xl font-extrabold"} ${props.classname}`}
          >
            {props.title}
          </h2>
          <p
            className={`${props.isSubHeader ? "text-[8.5pt]" : "text-xs"} ${props.hasError ? "text-error" : "text-base-content"}`}
          >
            {props.description}
          </p>
        </div>
      </div>
      <div className="flex shrink-0 justify-end items-center">
        {props.children}
      </div>
    </BoxWrapper>
  );
};

export default Header;
