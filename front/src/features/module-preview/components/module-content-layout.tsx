import type React from "react";
import { motion } from "motion/react";
import { cn } from "../../../utils/cn";

type ModuleContentLayoutProps = {
  header: React.ReactNode;
  toolbar: React.ReactNode;
  sidebar: React.ReactNode;
  children: React.ReactNode;
  isSidebarCollapsed?: boolean;
  /**
   * Mobile : la colonne de gauche n'est gardée que lorsqu'elle sert à autre chose que naviguer
   * (vue calendrier). Sinon la navigation s'ouvre en plein écran depuis la barre du haut
   * et le contenu occupe toute la largeur.
   */
  showSidebarOnMobile?: boolean;
};

/**
 * Conteneur structurel de la page ModuleContent.
 * Il encapsule la logique de présentation et la mise en page des aperçus de leçons en utilisant des props.
 */
const ModuleContentLayout = ({
  header,
  toolbar,
  sidebar,
  children,
  isSidebarCollapsed = false,
  showSidebarOnMobile = false,
}: ModuleContentLayoutProps) => {
  return (
    <div className="w-full overflow-x-clip">
      {header}

      {toolbar}

      <div
        className={cn(
          "mt-5 grid w-full gap-2 sm:gap-3 lg:grid-cols-3 lg:gap-5",
          showSidebarOnMobile
            ? "grid-cols-[minmax(7.5rem,1fr)_minmax(0,2fr)] sm:grid-cols-[minmax(9rem,1fr)_minmax(0,2fr)]"
            : "grid-cols-1 md:grid-cols-[minmax(9rem,1fr)_minmax(0,2fr)]",
        )}
      >
        {!isSidebarCollapsed && (
          <motion.div
            className={cn("min-w-0", !showSidebarOnMobile && "hidden md:block")}
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "auto", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {sidebar}
          </motion.div>
        )}
        <div
          className={cn(
            "flex flex-col gap-2 min-w-0 min-h-[80vh]",
            isSidebarCollapsed
              ? showSidebarOnMobile
                ? "col-span-2 lg:col-span-3"
                : "col-span-1 md:col-span-2 lg:col-span-3"
              : "col-span-1 lg:col-span-2",
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default ModuleContentLayout;
