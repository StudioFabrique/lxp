import { useState } from "react";
import ResourcesHeader from "../../components/resources-home/ResourcesHeader";
import ResourcesListCard from "../../components/resources-home/ResourcesListCard";
import ListHeader from "../../components/UI/list-header";
import ToggleList from "../../components/UI/toggle-list";
import useResources from "./hooks/useResources";
import ResourcesListTable from "../../components/resources-home/ResourcesListTable";
import Pagination from "../../components/pagination";

export default function ResourcesHome() {
  const [showList, setShowList] = useState(true);

  const {
    page,
    totalPages,
    dataList,
    perPage,
    stype,
    sdir,
    sortData,
    setPerPage,
    setPage,
  } = useResources();

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

        <section className="toto w-full">
          {showList ? (
            <ResourcesListTable
              resourcesList={dataList}
              fieldSort={stype}
              direction={sdir}
              onSorting={sortData}
              onDeleteResource={() => {}}
              loading={false}
            />
          ) : (
            <ResourcesListCard resourcesList={dataList} />
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
