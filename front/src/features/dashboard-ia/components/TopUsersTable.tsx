import { useEffect, useRef } from "react";
import { Link } from "react-router";
import SortColumnIcon from "../../../components/UI/sort-column-icon/sort-column-icon";
import Wrapper from "../../../../src/components/wrappers/BoxWrapper";
import SearchBar from "../../../components/UI/search-bar/search-bar";
import Pagination from "../../../components/UI/pagination/pagination";
import type { TopUser } from "../types";

type Props = {
  dataList: TopUser[];
  page: number;
  totalPages: number;
  perPage: number;
  sortProperty: string;
  sortDirection: string;
  setPerPage: (v: number) => void;
  setPage: (v: number) => void;
  onSort: (property: string) => void;
  onSearch: (value: string) => void;
};

const SORT_COLUMNS = ["lastname", "role", "groupName", "totalTokens", "createdAt"];

const TopUsersTable = ({
  dataList,
  page,
  totalPages,
  perPage,
  sortProperty,
  sortDirection,
  setPerPage,
  setPage,
  onSort,
  onSearch,
}: Props) => {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const handleSearch = (value: string) => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      onSearch(value);
    }, 500);
  };

  return (
    <div>
      <Wrapper additionalClassname="overflow-x-scroll">
        <SearchBar
          placeholder="Rechercher par nom d'utilisateur"
          onSubmitSearchValue={handleSearch}
        />
        <table className="w-full table">
          <thead>
            <tr className="text-xs font-semibold text-primary">
              {SORT_COLUMNS.map((col) => (
                <th
                  key={col}
                  className="cursor-pointer"
                  onClick={() => onSort(col)}
                >
                  <div className="flex items-center gap-x-2">
                    <p>
                      {col === "lastname"
                        ? "Utilisateur"
                        : col === "role"
                          ? "Rôle"
                          : col === "groupName"
                            ? "Promotion"
                            : col === "totalTokens"
                              ? "Quantité"
                              : "Dernière utilisation"}
                    </p>
                    <SortColumnIcon
                      fieldSort={sortProperty}
                      column={col}
                      direction={sortDirection === "asc"}
                    />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dataList.map((user) => (
              <tr key={user._id} className="text-xs">
                <td>
                  {user.role === "student" ? (
                    <Link to={`/admin/teacher/student/${user._id}`}>
                      {user.name}
                    </Link>
                  ) : (
                    user.name
                  )}
                </td>
                <td>
                  {user.role === "student"
                    ? "Apprenant"
                    : "Équipe pédagogique"}
                </td>
                <td className={user.groupName ? "" : "text-center"}>
                  {user.groupName ?? " - "}
                </td>
                <td>{user.totalTokens}</td>
                <td>{user.lastActivity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Wrapper>
      <Pagination
        page={page}
        setPage={setPage as React.Dispatch<React.SetStateAction<number>>}
        totalPages={totalPages}
        perPage={perPage}
        setPerPages={setPerPage as React.Dispatch<React.SetStateAction<number>>}
      />
    </div>
  );
};

export default TopUsersTable;
