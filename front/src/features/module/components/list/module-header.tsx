import { Link } from "react-router";
import PermissionGuard from "../../../../components/guards/PermissionGuard";
import Header from "../../../../components/headers/Header";
import { ImportIcon } from "lucide-react";

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
        </PermissionGuard>
      </Header>
    </section>
  );
}

export default ModuleHeader;
