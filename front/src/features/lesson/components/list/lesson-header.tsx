import { Link } from "react-router";
import Header from "../../../../../src/components/headers/Header";
import { PlusCircle } from "lucide-react";

function LessonHeader() {
  return (
    <section className="w-full">
      <Header
        title="Liste des leçons"
        description="Gérer toutes les leçons qui vous sont attribuées."
      >
        <Link className="btn btn-primary btn-soft" to="add">
          <PlusCircle /> Créer une leçon
        </Link>
      </Header>
    </section>
  );
}

export default LessonHeader;
