import TabsMedia from "../../components/mediatheque/tabs-media";
import Pagination from "../../components/pagination";
import Header from "../../components/UI/header";
import PaginationLimitSelect from "../../components/UI/pagination-limit-select";
import usePaginatedMediatheque from "../../hooks/use-paginated-mediatheque";
import Media from "../../utils/interfaces/media";

function MediathequeHomePage() {
  const { list, page, perPage, setLimit, setPage, totalPages, type, setType } =
    usePaginatedMediatheque<Media>();

  return (
    <main className="w-full min-h-screen flex flex-col items-center py-8 gap-8">
      {/* En-tête de la page */}
      <section className="w-5/6 flex flex-col items-center">
        <Header
          title="Mediathèque"
          description="Gérez toutes les ressources utilisées dans l'application."
        ></Header>
      </section>
      <section className="w-5/6 flex-1 flex flex-col items-center gap-y-2">
        <TabsMedia type={type} list={list as Media[]} setType={setType}>
          <div className="flex-1 flex flex-col items-center mt-4">
            <Pagination
              page={page}
              perPage={perPage}
              totalPages={totalPages}
              setPage={setPage}
              setLimit={setLimit}
            >
              <PaginationLimitSelect />
            </Pagination>
          </div>
        </TabsMedia>
      </section>
    </main>
  );
}

export default MediathequeHomePage;
