import { FC } from "react";
import { resultPropertiesToShow } from "../../config/elastic-search-config";
import { Link } from "react-router-dom";

const SearchResultItem: FC<{ indexName: string; source: any }> = ({
  indexName,
  source,
}) => {
  return (
    <div className="flex gap-5 bg-primary text-primary-content p-4 rounded-lg">
      {Object.entries(source).map(
        ([sourceName, data]) =>
          resultPropertiesToShow.includes(sourceName) && (
            <span key={sourceName}>
              <p className="capitalize font-semibold">{sourceName}</p>
              <p>{data as string}</p>
            </span>
          )
      )}
      {source.prismaId && (
        <Link
          className="self-center"
          to={`../../${indexName}/view/${source.prismaId}`}
        >
          {"=>"}
        </Link>
      )}
    </div>
  );
};

export default SearchResultItem;
