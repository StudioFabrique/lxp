import ResourcesListCard from "../../../components/resources-home/ResourcesListCard";
import ElementNotFound from "../../../components/UI/element-not-found";
import Header from "../../../components/UI/header";
import ListHeader from "../../../components/UI/list-header";
import Pagination from "../../../components/UI/pagination/pagination";
import useStudentResources from "../hooks/useStudentResources";

export default function StudentResourceHome() {
  const notFoundMessage = (
    <ElementNotFound message="Aucune ressource disponible pour le moment." />
  );

  const { page, totalPages, dataList, setPage, perPage, setPerPage } =
    useStudentResources();

  return (
    <ListHeader>
      <Header
        title="Ressources Supplémentaires"
        description="Apprenez plus de trucs grâce à nos ressources supplémentaires"
      />

      {/* filtrage par tag */}

      <div className="flex justify-end w-full">
        <input
          className="input input-primary"
          type="text"
          placeholder="Rechercher..."
        />
      </div>

      <form className="flex gap-x-4">
        <input
          className="btn"
          type="checkbox"
          name="frameworks"
          aria-label="Svelte"
        />
        <input
          className="btn"
          type="checkbox"
          name="frameworks"
          aria-label="Vue"
        />
        <input
          className="btn"
          type="checkbox"
          name="frameworks"
          aria-label="React"
        />
        <input className="btn btn-square" type="reset" value="×" />
      </form>

      {dataList && dataList.length > 0 ? (
        <>
          {/* Affichage de la liste des ressources sous forme de card  */}
          <section className="flex justify-center">
            <ResourcesListCard resourcesList={dataList}>
              {notFoundMessage}
            </ResourcesListCard>
          </section>

          {/*pagination */}
          <section className="w-full flex justify-end mt-4">
            {totalPages && totalPages > 0 ? (
              <Pagination
                page={page}
                totalPages={totalPages}
                setPage={setPage}
                perPage={perPage}
                setPerPages={setPerPage}
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
