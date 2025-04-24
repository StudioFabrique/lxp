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
import Header from "../UI/header";
import AddIcon from "../UI/svg/add-icon";
import { Link } from "react-router-dom";
import Can from "../UI/can/can.component";

function ParcoursHeader() {
  return (
    <section className="w-full">
      {/* Main header component with title and description */}
      <Header
        title="Liste des parcours"
        description="Gérer tous les parcours qui vous sont attribués."
      >
        {/* Permission check - only users with 'write' permission on 'parcours' can see this button */}
        <Can action="write" object="parcours">
          {/* Create new course button that navigates to creation page */}
          <Link className="btn btn-primary btn-soft" to="créer-un-parcours">
            <div className="flex gap-x-2 items-center">
              <div className="w-8 h-8">
                <AddIcon />
              </div>
              <p>Créer un parcours</p>
            </div>
          </Link>
        </Can>
      </Header>
    </section>
  );
}

export default ParcoursHeader;
