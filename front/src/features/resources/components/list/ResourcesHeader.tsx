import { PlusCircle } from "lucide-react";
import Header from "../../../../components/headers/Header";
import PermissionGuard from "../../../../components/guards/PermissionGuard";

export default function ResourcesHeader({ onCreate }: { onCreate: () => void }) {
  return (
    <section className="w-full">
      <Header
        title="Liste des ressources supplémentaires"
        description="Gérer toutes les ressources supplémentaires pour les apprenants."
      >
        <PermissionGuard action="write" object="resource">
          <button type="button" className="btn btn-primary btn-soft" onClick={onCreate}>
            <PlusCircle /> Créer une ressource
          </button>
        </PermissionGuard>
      </Header>
    </section>
  );
}
