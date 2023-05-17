import { useState, ChangeEvent, FC, useEffect } from "react";
import useHttp from "../../../hooks/use-http";

const Search: FC<{
  options: Array<{
    index: number;
    value: string;
    option: string;
  }>;
}> = (props) => {
  const [searchType, setSearchType] = useState<string>("search");
  const [entityToSearch, setEntityToSearch] = useState<string>("lastname");
  const [searchValue, setSearchValue] = useState("");
  const { sendRequest } = useHttp();

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

  useEffect(() => {
    const timer = setTimeout(() => {
      console.log(`Searching... ${searchValue}`);

      const applyData = (data: any) => {
        console.log(data);
      };
      if (searchValue.length > 0) {
        sendRequest(
          {
            path: `/user/search/${entityToSearch}/${searchValue.toLowerCase()}/3/asc?page=1&limit=15`,
          },
          applyData
        );
      }
    }, 1000);

    return () => {
      console.log("CLEANUP");
      clearTimeout(timer);
    };
  }, [searchValue, sendRequest, entityToSearch]);

  return (
    <div className="flex justify-end items-center gap-x-4">
      <select
        className="select select-ghost font-normal text-xs w-fit"
        onChange={handleTypeToSearchChange}
      >
        <option disabled defaultValue="">
          Choisissez un type de recherche
        </option>
        {optionsList}
      </select>
      <input
        className="input input-bordered input-sm w-full max-w-sm"
        type={searchType}
        placeholder="Recherche..."
        value={searchValue}
        onChange={handleSearchValueChange}
      />
    </div>
  );
};

export default Search;
