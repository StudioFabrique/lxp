import { Link } from "react-router-dom";
import Can from "../UI/can/can.component";
import Header from "../UI/header";
import { PlusCircle } from "lucide-react";

function CourseHeader() {
  return (
    <section className="w-full">
      <Header
        title="Liste des cours"
        description="Liste des cours associés à un module."
      >
        <Can action="write" object="course">
          <Link className="btn btn-primary btn-soft" to="add">
            <div className="flex gap-x-2 items-center">
              <PlusCircle className="w-8 h-8" />
              <p>Créer un cours</p>
            </div>
          </Link>
        </Can>
      </Header>
    </section>
  );
}

export default CourseHeader;
