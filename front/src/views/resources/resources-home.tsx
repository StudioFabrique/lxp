import ResourcesHeader from "../../components/resources-home/ResourcesHeader";
import ResourcesListCard from "../../components/resources-home/ResourcesListCard";
import ListHeader from "../../components/UI/list-header";
import useResources from "./hooks/useResources";

export default function ResourcesHome() {
  const { resourcesList, isLoading } = useResources();

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
            <ResourcesListCard resourcesList={resourcesList} />
          </>
        )}
      </ListHeader>
    </main>
  );
}
