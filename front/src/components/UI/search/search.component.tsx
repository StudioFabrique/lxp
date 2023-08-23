import { useState, ChangeEvent, FC } from "react";

import { regexGeneric } from "../../../utils/constantes";

const Search: FC<{
  options: Array<{
    index: number;
    value: string;
    option: string;
  }>;
  placeholder?: string;
  onSearch: (entityToSearch: string, searchValue: string) => void;
}> = (props) => {
  const [searchType, setSearchType] = useState<string>("search");
  const [entityToSearch, setEntityToSearch] = useState<string>(
    props.options[0].value
  );
  const [searchValue, setSearchValue] = useState("");
  const [switchValue, setSwitchValue] = useState(true);

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

  const handleSwitchValueChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSwitchValue(event.target.value === "actif" ? true : false);
  };

  const handleSearchValueChange = (
    event: React.FormEvent<HTMLInputElement>
  ) => {
    setSearchValue(event.currentTarget.value);
  };

  const optionsList = (
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

    if (entityToSearch === "isActive") {
      props.onSearch(entityToSearch, switchValue ? "true" : "false");
    }

    if (regexGeneric.test(searchValue)) {
      console.log(`Searching ${searchValue} as ${entityToSearch}`);
      props.onSearch(entityToSearch, searchValue);
    }
  };

  return (
    <form className="join" onSubmit={handleSubmit}>
      <div>
        <div>
          {entityToSearch !== "isActive" ? (
            <input
              className="input input-bordered input-sm join-item"
              type={searchType}
              placeholder="Recherche..."
              value={searchValue}
              onChange={handleSearchValueChange}
            />
          ) : (
            <div>
              <select
                className="select select-bordered select-sm join-item"
                onChange={handleSwitchValueChange}
              >
                <option value="actif">Actif</option>
                <option value="inactif">Inactif</option>
              </select>
            </div>
          )}
        </div>
      </div>
      <select
        className="select select-bordered select-sm join-item font-normal"
        onChange={handleTypeToSearchChange}
      >
        <option disabled defaultValue="">
          Catégorie
        </option>
        {optionsList}
      </select>
      <button
        className="btn btn-primary btn-sm join-item capitalize"
        type="submit"
      >
        {props.placeholder ? (
          props.placeholder
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path
              fillRule="evenodd"
              d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </button>
    </form>
  );
};

export default Search;
