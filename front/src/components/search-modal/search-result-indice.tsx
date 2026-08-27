import { FC } from "react";
import SearchResultItem from "./search-result-item";
import convertSearchResultToIndices from "../../utils/convertSearchResultToIndices";

type SearchResult = {
  _index: string;
  _id: string;
  _source: Record<string, unknown>;
};

const SearchResultIndice: FC<{ searchResult: SearchResult[] }> = ({
  searchResult,
}) => {
  const indicesList = convertSearchResultToIndices(searchResult);

  return (
    <div className="flex flex-wrap gap-10 p-4 overflow-y-scroll">
      {indicesList.map((index) => (
        <details
          className="self-start bg-secondary text-secondary-content p-4 rounded-lg"
          key={index}
        >
          <summary className="text-lg font-bold capitalize cursor-pointer">
            {index.replace("_", " ")}
          </summary>
          <div className="pt-2 flex flex-col gap-5">
            {searchResult
              .filter((singleData) => singleData._index === index)
              .map((result) => (
                <SearchResultItem
                  indexName={result._index}
                  source={result._source}
                  key={result._id}
                />
              ))}
          </div>
        </details>
      ))}
    </div>
  );
};

export default SearchResultIndice;
