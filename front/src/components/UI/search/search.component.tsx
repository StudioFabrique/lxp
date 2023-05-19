import { useState, ChangeEvent, FC } from "react";
import { regexGeneric } from "../../../utils/constantes";

const Search: FC<{
  options: Array<{
    index: number;
    value: string;
    option: string;
  }>;
  onSearch: (entityToSearch: string, searchValue: string) => void;
}> = (props) => {
  const [searchType, setSearchType] = useState<string>("search");
  const [entityToSearch, setEntityToSearch] = useState<string>("lastname");
  const [searchValue, setSearchValue] = useState("");

  const handleTypeToSearchChange = (
    event: ChangeEvent<HTMLSelectElement>
  ): void => {
    if (event.target.value !== entityToSearch) {
      setEntityToSearch(event.target.value);
      setSearchValue("");
    }
    if (event.target.value === "createdAt") {
      setSearchType("date");
    } else {
      setSearchType("search");
    }
  };

  const handleSearchValueChange = (
    event: React.FormEvent<HTMLInputElement>
  ) => {
    setSearchValue(event.currentTarget.value);
  };

  let optionsList = (
    <>
      {props.options.map(
        (item: { index: number; value: string; option: string }) => (
          <option key={item.index} value={item.value}>
            {item.option}
          </option>
        )
      )}
    </>
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (regexGeneric.test(searchValue)) {
      console.log(`Searching ${searchValue} as ${entityToSearch}`);
      props.onSearch(entityToSearch, searchValue);
    }
  };

  return (
    <div className="flex justify-end items-center gap-x-2">
      <select
        className="select select-ghost font-normal text-xs w-fit"
        onChange={handleTypeToSearchChange}
      >
        <option disabled defaultValue="">
          Choisissez un type de recherche
        </option>
        {optionsList}
      </select>
      <form className="flex gap-x-2 items-center" onSubmit={handleSubmit}>
        <input
          className="input input-bordered input-sm w-full max-w-sm"
          type={searchType}
          placeholder="Recherche..."
          value={searchValue}
          onChange={handleSearchValueChange}
        />
        <button className="btn btn-sm">Rechercher</button>
      </form>
    </div>
  );
};

export default Search;

//path: `/user/search/${entityToSearch}/${searchValue.toLowerCase()}/3/asc?page=1&limit=15`,
