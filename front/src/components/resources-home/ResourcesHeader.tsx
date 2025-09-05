import { Link } from "react-router-dom";
import Header from "../UI/header";
import { PlusCircle } from "lucide-react";

export default function ResourcesHeader() {
  return (
    <section className="w-full">
      {/* Main header component with title and description */}
      <Header
        title="Liste des ressources"
        description="Créer et modifier différentes ressources pédagogiques pour enrichir les parcours de vos apprenants."
      >
        {/* Create new lesson button that navigates to creation page */}
        <Link className="btn btn-primary btn-soft" to="add">
          <PlusCircle /> Créer une ressource
        </Link>
      </Header>
    </section>
  );
}
