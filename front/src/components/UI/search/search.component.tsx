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
  onResetInput?: () => void;
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
    const value = event.currentTarget.value;
    setSearchValue(value);
    if (!!props.onResetInput && value.length <= 0) {
      props.onResetInput();
    }
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
      props.onSearch(entityToSearch, searchValue);
    }
  };

  return (
    <form className="join" onSubmit={handleSubmit}>
      <div>
        <div>
          {entityToSearch !== "isActive" ? (
            <input
              className="input input-sm md:input-md input-bordered focus:outline-none join-item"
              type={searchType}
              id="searchtype"
              placeholder="Recherche..."
              value={searchValue}
              onChange={handleSearchValueChange}
              autoComplete="off"
            />
          ) : (
            <div>
              <select
                className="select select-sm md:select-md select-bordered focus:outline-none join-item"
                id="isactive"
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
        className="select select-sm md:select-md select-bordered join-item font-normal"
        id="typetosearch"
        onChange={handleTypeToSearchChange}
      >
        <option disabled defaultValue="">
          Catégorie
        </option>
        {optionsList}
      </select>
      <button
        className="btn btn-sm md:btn-md btn-primary join-item capitalize"
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
