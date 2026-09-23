import type React from "react";
import { motion } from "motion/react";
import { cn } from "../../../utils/cn";

type ModuleContentLayoutProps = {
  header: React.ReactNode;
  toolbar: React.ReactNode;
  sidebar: React.ReactNode;
  children: React.ReactNode;
  isSidebarCollapsed?: boolean;
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
}: ModuleContentLayoutProps) => {
  return (
    <div className="w-full overflow-x-clip">
      {header}

      {toolbar}

      <div className="mt-5 grid grid-cols-[minmax(7.5rem,1fr)_minmax(0,2fr)] gap-2 sm:grid-cols-[minmax(9rem,1fr)_minmax(0,2fr)] sm:gap-3 lg:grid-cols-3 lg:gap-5 w-full">
        {!isSidebarCollapsed && (
          <motion.div
            className="min-w-0"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "auto", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {sidebar}
          </motion.div>
        )}
        <div
          className={cn("flex flex-col gap-2 min-w-0 min-h-[80vh]", isSidebarCollapsed
              ? "col-span-2 lg:col-span-3"
              : "col-span-1 lg:col-span-2")}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default ModuleContentLayout;
