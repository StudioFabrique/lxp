import { FC } from "react";
import SearchResultIndice from "./search-result-indice";
import type { SearchResultsData } from "./search-result.types";

const SearchResults: FC<{ data: SearchResultsData }> = ({ data }) => {
  return (
    <div>
      {Object.entries(data).map(([resultTitle, searchResult]) => (
        <div key={resultTitle}>
          <h1 className="first-letter:uppercase font-bold text-xl">
            {resultTitle}
          </h1>
          <SearchResultIndice searchResult={searchResult.hits.hits} />
        </div>
      ))}
    </div>
  );
};

export default SearchResults;
