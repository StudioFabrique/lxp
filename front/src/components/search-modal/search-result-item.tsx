import { FC } from "react";
import { resultPropertiesToShow } from "../../config/elastic-search-config";
import { Link } from "react-router";
import type { SearchResultSource } from "./search-result.types";

const formatSearchResultValue = (value: unknown): string => {
  if (value == null) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  return JSON.stringify(value);
};

const SearchResultItem: FC<{
  indexName: string;
  source: SearchResultSource;
}> = ({
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
              <p>{formatSearchResultValue(data)}</p>
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
