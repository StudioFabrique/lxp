import SearchOption from "../../utils/interfaces/search-options";
import Search from "./search/search.component";
import RefreshIcon from "./svg/refresh-icon.component";

type Props = {
  searchOptions: SearchOption[];
  placeholder: string;
  onResetInput?: () => void;
  onSearch: (entityToSearch: string, searchValue: string) => void;
};

export default function SearchAndRefresh(props: Props) {
  return (
    <article className="w-full flex justify-end items-center gap-x-2">
      <Search
        options={props.searchOptions}
        placeholder="Filtrer"
        onSearch={props.onSearch}
      />
      <button
        className="btn btn-outline btn-sm btn-circle border-none text-primary"
        onClick={props.onResetInput}
      >
        <RefreshIcon size={8} />
      </button>
    </article>
  );
}
