import { createPortal } from "react-dom";
import { PropsWithChildren } from "react";
import { cn } from "../../utils/cn";
import { formatTitle } from "../../utils/helpers/text-helpers";
import BoxWrapper from "../wrappers/BoxWrapper";
import SidebarRouteIcon from "./SidebarRouteIcon";
import { useMobilePageHeader } from "./useMobilePageHeader";
import StickyPageHeader from "./StickyPageHeader";

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
  /** Faux sur les pages qui ont leurs propres éléments collants : l'en-tête reste alors fixe dans la page. */
  sticky?: boolean;
}

const PageHeader = (props: PropsWithChildren<Props>) => {
  const isPageTitle =
    !props.isSubHeader && !props.successBgColor && !props.hasError && !props.disabled && !props.onClick;
  const mobile = useMobilePageHeader(isPageTitle);

  // Mobile : la barre du haut porte déjà la section, le titre ne reste que pour les lecteurs d'écran.
  if (mobile.collapsed) {
    return (
      <>
        <h2 className="sr-only">{props.title}</h2>
        {props.children && mobile.container ? createPortal(props.children, mobile.container) : null}
      </>
    );
  }

  // Titre de page ou sous-en-tête d'étape : il reste accessible au défilement (barre flottante) ;
  // un sous-en-tête prend la place de l'en-tête de la page quand il se colle à son tour.
  const isStickable =
    !props.successBgColor && !props.hasError && !props.disabled && !props.onClick;
  if (isStickable && (props.sticky ?? true)) {
    return (
      <StickyPageHeader
        title={formatTitle(props.title)}
        description={props.description}
        variant={props.isSubHeader ? "sub" : "page"}
        titleClassName={props.classname}
        className="mb-6"
      >
        {props.children}
      </StickyPageHeader>
    );
  }

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
