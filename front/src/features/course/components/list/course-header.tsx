import { Link } from "react-router";
import PermissionGuard from "../../../../components/guards/PermissionGuard";
import Header from "../../../../../src/components/headers/Header";
import { ImportIcon } from "lucide-react";

function CourseHeader() {
  return (
    <section className="w-full">
      <Header
        title="Liste des cours"
        description="Liste des cours associés à un module."
      >
        <PermissionGuard action="write" object="course">
          <Link className="btn btn-primary btn-soft mr-5" to="import">
            <div className="flex gap-x-2 items-center">
              <ImportIcon />
              Importer des cours
            </div>
          </Link>
        </PermissionGuard>
      </Header>
    </section>
  );
}

export default CourseHeader;
