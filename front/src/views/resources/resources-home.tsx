import { useState } from "react";
import ResourcesHeader from "../../components/resources-home/ResourcesHeader";
import ResourcesListCard from "../../components/resources-home/ResourcesListCard";
import ListHeader from "../../components/UI/list-header";
import ToggleList from "../../components/UI/toggle-list";
import useResources from "./hooks/useResources";
import ResourcesListTable from "../../components/resources-home/ResourcesListTable";

export default function ResourcesHome() {
  const { resourcesList, isLoading } = useResources();
  const [showList, setShowList] = useState(true);

  const handleToggleList = (value: boolean) => {
    setShowList(value);
  };

  return (
    <main className="min-h-screen w-full flex justify-center">
      <ListHeader>
        {isLoading ? (
          <div className="flex items-center">
            <p>Loading...</p>
          </div>
        ) : (
          <>
            <ResourcesHeader />
            <article className="w-full flex justify-end items-center gap-x-4">
              <ToggleList showList={showList} onToggle={handleToggleList} />
            </article>

            {showList ? (
              <ResourcesListTable resourcesList={resourcesList} />
            ) : (
              <ResourcesListCard resourcesList={resourcesList} />
            )}
          </>
        )}
      </ListHeader>
    </main>
  );
}
