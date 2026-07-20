/**
 * ModuleHeader - A component that renders the header section for the modules list page
 *
 * This component displays a header with a title, description, and conditional action button
 * to create a new module. The create button is only shown to users with appropriate permissions.
 *
 * @example
 * ```tsx
 * <ModuleHeader />
 * ```
 */
import { Link } from "react-router";
import PermissionGuard from "../../../../components/guards/PermissionGuard";
import Header from "../../../../components/headers/Header";
import { ImportIcon, PlusCircle } from "lucide-react";

function ModuleHeader() {
  return (
    <section className="w-full">
      {/* Main header component with title and description */}
      <Header
        title="Liste des modules"
        description="Gérer tous les modules qui sont créés au sein de l'application."
      >
        {/* Permission check - only users with 'write' permission on 'module' can see this button */}
        <PermissionGuard action="write" object="module">
          <Link className="btn btn-primary btn-soft mr-5" to="import-modules">
            <div className="flex gap-x-2 items-center">
              <ImportIcon />
              Importer des modules
            </div>
          </Link>
          {/* Create new module button that navigates to creation page */}
          <Link className="btn btn-primary btn-soft" to="add">
            <div className="flex gap-x-2 items-center">
              <PlusCircle />
              Créer un module
            </div>
          </Link>
        </PermissionGuard>
      </Header>
    </section>
  );
}

export default ModuleHeader;
