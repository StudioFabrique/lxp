import { PlusCircle } from "lucide-react";
import Header from "../UI/header";
import { Link } from "react-router";

export default function ResourcesHeader() {
  return (
    <section className="w-full">
      {/* Main header component with title and description */}
      <Header
        title="Liste des ressources supplémentaires"
        description="Gérer toutes les ressources supplémentaires pour les apprenants."
      >
        {/* Create new lesson button that navigates to creation page */}
        <Link className="btn btn-primary btn-soft" to="add">
          <PlusCircle /> Créer une ressource
        </Link>
      </Header>
    </section>
  );
}
