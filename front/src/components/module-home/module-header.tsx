import { Link } from "react-router-dom";
import Can from "../UI/can/can.component";
import Header from "../UI/header";
import AddIcon from "../UI/svg/add-icon";

function ModuleHeader() {
  return (
    <section className="w-full">
      <Header
        title="Liste des modules"
        description="Gérer tous les modules qui sont créés au sein de l'application."
      >
        <Can action="write" object="module">
          <Link className="btn btn-primary" to="add">
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
