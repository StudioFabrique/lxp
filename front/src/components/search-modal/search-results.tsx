import { FC } from "react";
import SearchResultIndice from "./search-result-indice";

const SearchResults: FC<{ data: any }> = ({ data }) => {
  console.log(data);

  if (data)
    return (
      <div>
        {Object.entries(data).map(([resultTitle, searchResult]) => (
          <div>
            <h1 className="first-letter:uppercase font-bold text-xl">
              {resultTitle}
            </h1>
            <SearchResultIndice
              searchResult={(searchResult as any).hits.hits}
            />
          </div>
        ))}
      </div>
    );
  else return <p>Aucun résultats</p>;
};

export default SearchResults;
