import CardMedia from "../../components/mediatheque/card-media";
import usePaginatedMediatheque from "../../hooks/use-paginated-mediatheque";
import Media from "../../utils/interfaces/media";

function MediathequeHomePage() {
  const {
    list,
    page,
    perPage,
    totalPages,
    setPage,
    setLimit,
    setTotalPages,
    setList,
    setType,
  } = usePaginatedMediatheque<Media>();

  return (
    <div>
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
    </div>
  );
}

export default MediathequeHomePage;
