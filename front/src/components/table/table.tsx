import { RefreshCw } from "lucide-react";
import SearchBar, { SearchBarProps } from "../UI/search-bar/search-bar";
import Wrapper from "../UI/wrapper/wrapper.component";
import TableList, { TableListProps } from "./table-list/table-list";
import EllipsisIcon from "../UI/svg/ellipsis-icon";
import { PropsWithChildren } from "react";

type TableProps<TData> = {
  list: TableListProps<TData>;
  searchBar: SearchBarProps;
};

const Table = <TData extends Record<string, string>>(
  props: PropsWithChildren<TableProps<TData>>,
) => (
  <Wrapper additionalClassname="px-10">
    <SearchBar {...props.searchBar}>
      {/* Refresh Button */}
      <button className="btn btn-sm btn-ghost">
        <RefreshCw />
      </button>
      {/* Ellipse Actions Button */}
      <button className="btn btn-sm btn-ghost">
        <EllipsisIcon />
      </button>
    </SearchBar>
    <TableList {...props.list} />
    {props.children}
  </Wrapper>
);

export default Table;
