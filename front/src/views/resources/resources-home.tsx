import ResourcesHeader from "../../components/resources-home/ResourcesHeader";
import ResourcesListCard from "../../components/resources-home/ResourcesListCard";
import ListHeader from "../../components/UI/list-header";
import ToggleList from "../../components/UI/toggle-list";
import ElementNotFound from "../../components/UI/element-not-found";
import ResourcesListTable from "../../components/resources-home/ResourcesListTable";
import Pagination from "../../components/pagination";
import usePagination from "../../hooks/use-pagination";

export type ResourceListItem = {
  id: string;
  title: string;
  author: string;
  createdAt: string;
};

export default function ResourcesHome() {
  const [showList, setShowList] = useState(true);

  const notFoundMessage = (
    <ElementNotFound message="Aucune ressource disponible pour le moment." />
  );

  const {
    page,
    totalPages,
    dataList,
    stype,
    sdir,
    sortData,
    setPerPage,
    setPage,
    perPage,
  } = usePagination("title", "/resources");

  const handleToggleList = (value: boolean) => {
    setShowList(value);
  };

  return (
    <main className="w-full flex justify-center">
      <ListHeader>
        <ResourcesHeader />
        <article className="w-full flex justify-end items-center gap-x-4">
          <ToggleList showList={showList} onToggle={handleToggleList} />
        </article>

        <section className="w-full">
          {showList ? (
            <ResourcesListTable
              resourcesList={dataList}
              fieldSort={stype}
              direction={sdir}
              onSorting={sortData}
              onDeleteResource={() => {}}
              loading={false}
            >
              {notFoundMessage}
            </ResourcesListTable>
          ) : (
            <ResourcesListCard resourcesList={dataList}>
              {notFoundMessage}
            </ResourcesListCard>
          )}
        </section>
        <section className="w-full flex justify-end mt-4">
          {totalPages && totalPages > 0 ? (
            <Pagination
              page={page}
              totalPages={totalPages}
              setPage={setPage}
              perPage={perPage}
              setLimit={setPerPage}
            />
          ) : null}
        </section>
      </ListHeader>
    </main>
  );
}
