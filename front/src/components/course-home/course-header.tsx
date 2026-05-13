/**
 * CourseHeader - A component that renders the header section for the courses list page
 *
 * This component displays a header with a title, description, and conditional action button
 * to create a new course. The create button is only shown to users with appropriate permissions.
 *
 * @example
 * ```tsx
 * <CourseHeader />
 * ```
 */
import { Link } from "react-router";
import Can from "../UI/can/can.component";
import Header from "../UI/header";
import { ImportIcon, PlusCircle } from "lucide-react";

function CourseHeader() {
  return (
    <section className="w-full">
      {/* Main header component with title and description */}
      <Header
        title="Liste des cours"
        description="Liste des cours associés à un module."
      >
        {/* Permission check - only users with 'write' permission on 'course' can see this button */}
        <Can action="write" object="course">
          <Link
            className="btn btn-primary btn-soft mr-5"
            to="import"
            // state={{ parcoursId }}
          >
            <div className="flex gap-x-2 items-center">
              <ImportIcon />
              Importer des cours
            </div>
          </Link>
          {/* Create new course button that navigates to creation page */}
          <Link className="btn btn-primary btn-soft" to="add">
            <div className="flex gap-x-2 items-center">
              <PlusCircle />
              Créer un cours
            </div>
          </Link>
        </Can>
      </Header>
    </section>
  );
}

export default CourseHeader;
