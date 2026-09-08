import ResourcesListCard from "../components/list/ResourcesListCard";
import Header from "../../../components/headers/Header";
import EmptyStatePlaceholder from "../../../components/UI/empty-state-placeholder";
import MultiCriteriaSearch from "../../../components/UI/multi-criteria-search";
import TablePagination from "../../../components/table/TablePagination";
import PageWrapper from "../../../components/wrappers/PageWrapper";
import useStudentResources from "../hooks/useStudentResources";

export default function StudentResourceHome() {
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
    <PageWrapper as="main">
      <Header
        title="Ressources Supplémentaires"
        description="Accédez à plus de ressources supplémentaires"
      />

      <MultiCriteriaSearch
        value={searchTerm}
        onChange={handleOnChangeValue}
        criteria={["titre"]}
        placeholder="Rechercher une ressource..."
      />

      {dataList && dataList.length > 0 ? (
        <>
          <ResourcesListCard resourcesList={dataList} />

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
        </>
      ) : (
        <EmptyStatePlaceholder
          title={
            searchTerm
              ? "Aucune ressource trouvée"
              : "Aucune ressource disponible"
          }
        />
      )}
    </PageWrapper>
  );
}
