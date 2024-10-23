import SearchBar, { SearchBarProps } from "../UI/search-bar/search-bar";
import Wrapper from "../UI/wrapper/wrapper.component";
import TableList, { TableListProps } from "./table-list/table-list";
import { PropsWithChildren } from "react";

type TableProps<TData> = {
  list: TableListProps<TData>;
  searchBar: SearchBarProps;
};

const Table = <TData extends Record<string, string>>(
  props: PropsWithChildren<TableProps<TData>>,
) => {
  const [topChild, bottomChild] = props.children as React.ReactNode[];

  return (
    <Wrapper additionalClassname="px-10">
      <SearchBar {...props.searchBar}>{topChild}</SearchBar>
      <TableList {...props.list} />
      {bottomChild}
    </Wrapper>
  );
};

export default Table;
