import ResourcesListCard from "../components/list/ResourcesListCard";
import ElementNotFound from "../../../components/UI/element-not-found";
import Header from "../../../components/headers/Header";
import ListHeader from "../../../components/UI/list-header";
import TablePagination from "../../../components/table/TablePagination";
import useStudentResources from "../hooks/useStudentResources";

export default function StudentResourceHome() {
  const notFoundMessage = (
    <ElementNotFound message="Aucune ressource disponible pour le moment." />
  );

  const {
    page,
    totalPages,
    dataList,
    setPage,
    perPage,
    setPerPage,
    handleOnChangeValue,
    searchTerm,
  } = useStudentResources();

  return (
    <ListHeader>
      <Header
        title="Ressources Supplémentaires"
        description="Apprenez plus de trucs grâce à nos ressources supplémentaires"
      />

      {/* filtrage par tag */}

      <div className="flex justify-end w-full">
        <input
          className="input input-primary w-84"
          type="search"
          placeholder="Entrez un mot-clé pour filtrer les ressources..."
          defaultValue={searchTerm}
          onChange={handleOnChangeValue}
          name="search"
        />
      </div>

      {dataList && dataList.length > 0 ? (
        <>
          {/* Affichage de la liste des ressources sous forme de card  */}
          <section className="w-full mx-auto flex justify-center">
            <ResourcesListCard resourcesList={dataList}>
              {notFoundMessage}
            </ResourcesListCard>
          </section>

          {/*pagination */}
          <section className="w-full flex justify-end mt-4">
            {totalPages && totalPages > 0 ? (
              <TablePagination
                currentPage={page}
                maxPage={totalPages}
                itemsPerPage={perPage}
                onSetCurrentPage={setPage}
                onSetItemsPerPage={(itemsPerPage) => {
                  setPerPage(itemsPerPage);
                  setPage(1);
                }}
                onSetPreviousPage={() =>
                  setPage((current) => Math.max(current - 1, 1))
                }
                onSetNextPage={() =>
                  setPage((current) => Math.min(current + 1, totalPages))
                }
              />
            ) : null}
          </section>
        </>
      ) : (
        notFoundMessage
      )}
    </ListHeader>
  );
}
