import TabsMedia from "../components/tabs-media";
import Pagination from "../../../../src/components/pagination";
import Header from "../../../components/headers/Header";
import PaginationLimitSelect from "../../../../src/components/UI/pagination-limit-select";
import usePaginatedMediatheque from "../hooks/use-paginated-mediatheque";
import Media from "../interfaces/media";

/**
 * Composant principal de la page d'accueil de la médiathèque
 * Gère l'affichage et la pagination des médias
 */
function MediathequeHomePage() {
  // Utilisation du hook personnalisé pour gérer la pagination et le filtrage des médias
  const {
    list, // Liste des médias
    page, // Page courante
    perPage, // Nombre d'éléments par page
    setLimit, // Fonction pour modifier le nombre d'éléments par page
    setPage, // Fonction pour changer de page
    totalPages, // Nombre total de pages
    type, // Type de média sélectionné
    setType, // Fonction pour modifier le type de média
    setSort, // Fonction pour modifier le tri
  } = usePaginatedMediatheque<Media>("mediatheque");

  return (
    <div className="w-full flex flex-col items-center gap-8">
      {/* Section d'en-tête avec titre et description */}
      <section className="w-full flex flex-col items-center">
        <Header
          title="Mediathèque"
          description="Gérez toutes les ressources utilisées dans l'application."
        ></Header>
      </section>

      {/* Section principale avec les onglets et la pagination */}
      <section className="w-full flex-1 flex flex-col items-center gap-y-2">
        {/* Composant d'onglets pour filtrer les médias */}
        <TabsMedia
          type={type}
          list={list as Media[]}
          setType={setType}
          setSort={setSort}
        >
          {/* Conteneur pour la pagination */}
          <div className="flex-1 flex flex-col items-center mt-4">
            <Pagination
              page={page}
              perPage={perPage}
              totalPages={totalPages}
              setPage={setPage}
              setLimit={setLimit}
            >
              {/* Sélecteur du nombre d'éléments par page */}
              <PaginationLimitSelect />
            </Pagination>
          </div>
        </TabsMedia>
      </section>
    </div>
  );
}

export default MediathequeHomePage;
