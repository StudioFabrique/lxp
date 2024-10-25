import SearchBar, { SearchBarProps } from "../UI/search-bar/search-bar";
import Wrapper from "../UI/wrapper/wrapper.component";
import TableList, { TableListProps } from "./table-list/table-list";
import { PropsWithChildren } from "react";

type TableProps<TData> = {
  list: TableListProps<TData>;
  searchBar: SearchBarProps;
};

/**
 * Composant Table
 *
 * Ce composant fournit une structure pour afficher des données sous forme de tableau,
 * avec une barre de recherche en haut et des éléments supplémentaires en bas.
 *
 * @template TData - Type des données à afficher dans le tableau.
 *
 * @param props.list - Configuration de la liste de données,
 *   incluant les colonnes et les éléments à afficher.
 * @param props.searchBar - Propriétés pour configurer la barre de recherche.
 * @param props.children - Children sous forme de tableau, où le premier élément
 *   est affiché au-dessus du tableau à coté du composant SearchBar et le second en dessous de ce tableau.
 *
 * @component
 */
const Table = <TData extends Record<string, string>>(
  props: PropsWithChildren<TableProps<TData>>,
) => {
  const [topChild, bottomChild] = props.children as React.ReactNode[];

  return (
    <Wrapper additionalClassname="px-10 justify-between">
      {/* éléments du haut, avec les childrens à coté du composant SearchBar*/}
      <SearchBar {...props.searchBar}>{topChild}</SearchBar>

      {/* tableau au milieu */}
      <TableList {...props.list} />

      {/* éléments children en bas du tableau */}
      <div>{bottomChild}</div>
    </Wrapper>
  );
};

export default Table;
