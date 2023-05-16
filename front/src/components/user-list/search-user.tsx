import { useState, ChangeEvent, FC, useEffect } from "react";

const SearchUser: FC<{
  options: Array<{ index: number; value: string; option: string }>;
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
    if (event.target.value === "date") {
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

  useEffect(() => {
    const timer = setTimeout(() => {
      console.log("Searching...");
    }, 1000);

    return () => {
      console.log("CLEANUP");
      clearTimeout(timer);
    };
  }, [searchValue]);

  return (
    <div className="flex justify-end items-center gap-x-4">
      <select
        className="select select-ghost font-normal text-xs w-full max-w-xs"
        onChange={handleTypeToSearchChange}
      >
        <option disabled defaultValue="">
          Choisissez un type de recherche
        </option>
        {optionsList}
      </select>
      <input
        className="input input-bordered input-sm w-full max-w-xs"
        type={searchType}
        placeholder="Recherche..."
        value={searchValue}
        onChange={handleSearchValueChange}
      />
    </div>
  );
};

export default SearchUser;
