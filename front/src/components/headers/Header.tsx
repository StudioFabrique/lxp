/**
 * En tête pour les interfaces qui listent les groupes, les users, les parcours, etc...
 */

import type { PropsWithChildren, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "../../utils/cn";
import BoxWrapper from "../wrappers/BoxWrapper";
import SidebarRouteIcon from "./SidebarRouteIcon";

interface HeaderProps {
  title: ReactNode;
  alternateBgColor?: boolean;
  successBgColor?: boolean;
  disabled?: boolean;
  description?: string;
  icon?: LucideIcon;
  isSubHeader?: boolean;
  hasError?: boolean;
  classname?: string;
  containerClassname?: string;
  onClick?: () => void;
}

const Header = ({
  title,
  alternateBgColor = false,
  successBgColor = false,
  disabled = false,
  description,
  icon: Icon,
  isSubHeader = false,
  hasError = false,
  classname,
  containerClassname,
  onClick,
  children,
}: PropsWithChildren<HeaderProps>) => {
  return (
    <BoxWrapper
      onClick={onClick}
      className={cn(
        "h-auto w-full flex-row flex-wrap items-center justify-between gap-3 px-4 shadow-none select-none",
        !alternateBgColor && !successBgColor && "themed-page-header",
        isSubHeader ? "py-2" : "py-4",
        isSubHeader && !disabled && "ring-1",
        alternateBgColor && "bg-base-300",
        successBgColor && "bg-success text-success-content",
        hasError && "ring-2 ring-error",
        disabled && "opacity-15",
        onClick && "cursor-pointer hover:opacity-50",
        containerClassname,
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        {!isSubHeader &&
          (Icon ? (
            <Icon aria-hidden className="size-7 shrink-0" />
          ) : (
            <SidebarRouteIcon />
          ))}
        <div>
          <h2
            className={cn(
              "flex-1",
              isSubHeader ? "text-lg font-bold" : "text-xl font-extrabold",
              classname,
            )}
          >
            {title}
          </h2>
          <p
            className={cn(
              isSubHeader ? "text-[8.5pt]" : "text-xs",
              hasError
                ? "text-error"
                : successBgColor
                  ? "text-success-content"
                  : "text-base-content",
            )}
          >
            {description}
          </p>
        </div>
      </div>
      {children && (
        <div className={cn("header-actions flex w-full min-w-0 flex-wrap items-center justify-start gap-2 sm:w-auto sm:justify-end", !isSubHeader && "header-actions-main")}>
          {children}
        </div>
      )}
    </BoxWrapper>
  );
};

export default Header;
