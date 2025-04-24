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
import { Link } from "react-router-dom";
import Can from "../UI/can/can.component";
import Header from "../UI/header";
import AddIcon from "../UI/svg/add-icon";

function ModuleHeader() {
  return (
    <section className="w-full">
      {/* Main header component with title and description */}
      <Header
        title="Liste des modules"
        description="Gérer tous les modules qui sont créés au sein de l'application."
      >
        {/* Permission check - only users with 'write' permission on 'module' can see this button */}
        <Can action="write" object="module">
          {/* Create new module button that navigates to creation page */}
          <Link className="btn btn-primary btn-soft" to="add">
            <div className="flex gap-x-2 items-center">
              <div className="w-8 h-8">
                <AddIcon />
              </div>
              <p>Créer un module</p>
            </div>
          </Link>
        </Can>
      </Header>
    </section>
  );
}

export default ModuleHeader;
