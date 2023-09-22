import { useState, ChangeEvent, FC } from "react";

import { regexGeneric } from "../../../utils/constantes";
import MagnifyIcon from "../svg/magnify-icon";

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
              className="input input-bordered input-sm focus:outline-none join-item"
              type={searchType}
              placeholder="Recherche..."
              value={searchValue}
              onChange={handleSearchValueChange}
            />
          ) : (
            <div>
              <select
                className="select select-bordered select-sm focus:outline-none join-item"
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
          <div className="w-6 h-6">
            <MagnifyIcon />
          </div>
        )}
      </button>
    </form>
  );
};

export default Search;
