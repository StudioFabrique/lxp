import type SearchOption from "../../utils/interfaces/search-options";
import Search from "./search/search.component";
import RefreshIcon from "./svg/refresh-icon.component";

type SearchAndRefreshProps = {
  searchOptions: SearchOption[];
  onResetInput: () => void;
  onSearch: (entityToSearch: string, searchValue: string) => void;
};

const SearchAndRefresh = ({
  searchOptions,
  onResetInput,
  onSearch,
}: SearchAndRefreshProps) => (
  <div className="flex w-full flex-wrap items-center justify-end gap-2">
    <Search
      options={searchOptions}
      placeholder="Filtrer"
      onSearch={onSearch}
      onResetInput={onResetInput}
    />
    <button
      type="button"
      className="btn btn-circle btn-sm border-none text-primary md:btn-md"
      onClick={onResetInput}
      aria-label="Réinitialiser la recherche"
    >
      <RefreshIcon size={5} />
    </button>
  </div>
);

export default SearchAndRefresh;
