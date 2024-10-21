import { RefreshCw } from "lucide-react";
import SearchBar, { SearchBarProps } from "../UI/search-bar/search-bar";
import Wrapper from "../UI/wrapper/wrapper.component";
import TableList, { TableListProps } from "./table-list/table-list";
import EllipsisIcon from "../UI/svg/ellipsis-icon";

type TableProps<TData extends Record<string, string>> = {
  list: TableListProps<TData>;
  searchBar: SearchBarProps;
  // pagination: {};
};

const Table = <TData extends Record<string, string>>(
  props: TableProps<TData>,
) => {
  return (
    <Wrapper>
      <SearchBar {...props.searchBar}>
        <button className="btn btn-sm btn-ghost">
          <RefreshCw />
        </button>
        <button className="btn btn-sm btn-ghost">
          <EllipsisIcon />
        </button>
      </SearchBar>
      <TableList {...props.list} />
    </Wrapper>
  );
};

export default Table;
