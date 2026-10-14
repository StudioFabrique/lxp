/**
 * En tête pour les interfaces qui listent les groupes, les users, les parcours, etc...
 */

import { createPortal } from "react-dom";
import type { PropsWithChildren, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "../../utils/cn";
import BoxWrapper from "../wrappers/BoxWrapper";
import SidebarRouteIcon from "./SidebarRouteIcon";
import { formatTitle } from "../../utils/helpers/text-helpers";
import { useMobilePageHeader } from "./useMobilePageHeader";

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
  /** Mobile : le titre prend la place du nom de la section dans la barre du haut. */
  showTitleInTopBar?: boolean;
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
  showTitleInTopBar = false,
  children,
}: PropsWithChildren<HeaderProps>) => {
  const isPageTitle =
    !isSubHeader && !alternateBgColor && !successBgColor && !hasError && !disabled && !onClick;
  const mobile = useMobilePageHeader(
    isPageTitle,
    showTitleInTopBar && typeof title === "string" ? { text: title, className: classname } : undefined,
  );

  // Mobile : la barre du haut porte déjà la section, le titre ne reste que pour les lecteurs d'écran.
  if (mobile.collapsed) {
    return (
      <>
        <h2 className="sr-only">{title}</h2>
        {children && mobile.container ? createPortal(children, mobile.container) : null}
      </>
    );
  }

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
            {typeof title === "string" ? formatTitle(title) : title}
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
