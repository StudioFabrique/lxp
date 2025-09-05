import ResourcesHeader from "../../components/resources-home/ResourcesHeader";
import ElementNotFound from "../../components/UI/element-not-found";
import ListHeader from "../../components/UI/list-header";

export default function ResourcesHome() {
  return (
    <main className="min-h-screen w-full flex justify-center">
      <ListHeader>
        {/* En-tête de la page */}
        <ResourcesHeader />
        <ElementNotFound message="Aucune ressource supplémentaire trouvée" />
      </ListHeader>
    </main>
  );
}
