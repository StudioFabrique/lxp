/**
 * ParcoursHeader - A component that renders the header section for the courses list page
 *
 * This component displays a header with a title, description, and conditional action button
 * to create a new course. The create button is only shown to users with appropriate permissions.
 *
 * @example
 * ```tsx
 * <ParcoursHeader />
 * ```
 */
import Header from "../../../../../src/components/headers/Header";
import { Link } from "react-router";
import { PlusCircle } from "lucide-react";
import PermissionGuard from "../../../../components/guards/PermissionGuard";

function ParcoursHeader() {
  return (
    <section className="w-full">
      {/* Main header component with title and description */}
      <Header
        title="Liste des parcours"
        description="Gérer tous les parcours qui vous sont attribués."
      >
        {/* Permission check - only users with 'write' permission on 'parcours' can see this button */}
        <PermissionGuard action="write" object="parcours">
          {/* Create new course button that navigates to creation page */}
          <Link className="btn btn-primary btn-soft" to="new">
            <div className="flex gap-x-2 items-center">
              <PlusCircle />
              Créer un parcours
            </div>
          </Link>
        </PermissionGuard>
      </Header>
    </section>
  );
}

export default ParcoursHeader;
