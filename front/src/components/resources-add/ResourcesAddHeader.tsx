import { ArrowLeft } from "lucide-react";
import Header from "../UI/header";
import { Link } from "react-router-dom";

export default function ResourcesAddHeader() {
  return (
    <section className="w-full">
      {/* Main header component with title and description */}
      <Header
        title="Gestion des ressources supplémentaires"
        description="Mettre à jour une ressource pédagogique supplémentaire."
      >
        {/* Create new lesson button that navigates to creation page */}
        <Link className="btn btn-primary btn-soft" to="..">
          <ArrowLeft /> Retour à la liste des ressources
        </Link>
      </Header>
    </section>
  );
}
