import { ArrowLeft } from "lucide-react";
import Header from "../../../../components/headers/Header";
import { Link } from "react-router";
import { useRoleLabels } from "../../../role/hooks/useRoleLabels";

export default function ResourcesAddHeader() {
  const { teamLabel } = useRoleLabels();
  return (
    <section className="w-full">
      {/* Main header component with title and description */}
      <Header
        title="Gestion des ressources supplémentaires"
        description={`Mettre à jour un membre « ${teamLabel} » supplémentaire`}
      >
        {/* Create new lesson button that navigates to creation page */}
        <Link className="btn btn-outline btn-primary" to="..">
          <ArrowLeft /> Retour à la liste des ressources
        </Link>
      </Header>
    </section>
  );
}
