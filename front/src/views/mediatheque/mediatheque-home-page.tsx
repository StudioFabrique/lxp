import CardMedia from "../../components/mediatheque/card-media";
import Pagination from "../../components/pagination";
import usePaginatedMediatheque from "../../hooks/use-paginated-mediatheque";
import Media from "../../utils/interfaces/media";

function MediathequeHomePage() {
  const { list, page, perPage, totalPages, setPage, setLimit, setType } =
    usePaginatedMediatheque<Media>();

  return (
    <div className="flex flex-col items-center gap-y-8">
      <h1>Mediathèque</h1>
      {list && list.length > 0 ? (
        <ul className="flex flex-wrap gap-4">
          {(list as Media[]).map((item) => (
            <li key={item.id}>
              <CardMedia media={item} />
            </li>
          ))}
        </ul>
      ) : null}
      <Pagination
        page={page}
        perPage={perPage}
        totalPages={totalPages}
        setPage={setPage}
        setLimit={setLimit}
      />
    </div>
  );
}

export default MediathequeHomePage;
