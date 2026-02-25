import { Dispatch, SetStateAction, useEffect } from "react";
import SortColumnIcon from "../../../components/UI/sort-column-icon.component/sort-column-icon.component";
import Wrapper from "../../../components/UI/wrapper/wrapper.component";
import { TopUser } from "../hooks/useDashboardIA";
import Pagination from "../../../components/UI/pagination/pagination";
import { Link } from "react-router-dom";
import SearchBar from "../../../components/UI/search-bar/search-bar";

type Props = {
  dataList: TopUser[];
  page: number;
  totalPages: number;
  perPage: number;
  setPerPage: Dispatch<SetStateAction<number>>;
  setPage: Dispatch<SetStateAction<number>>;
  onSorting: (stype: string) => void;
  sdir: boolean;
  stype: string;
  setPath: Dispatch<SetStateAction<string>>;
  onSearchTerm: Dispatch<SetStateAction<string | null>>;
};

export default function PaginatedTopUsers(props: Props) {
  let timer: NodeJS.Timeout | null = null;

  const handleSearch = (value: string) => {
    console.log("TRIGGERED", value);
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      props.onSearchTerm(value);
    }, 500);
  };

  useEffect(() => {
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [timer]);

  return (
    <div>
      <h2 className="font-semibold pl-1 mb-4">
        Consommation tous utilisateurs
      </h2>
      <Wrapper additionalClassname="overflow-x-scroll">
        <SearchBar
          placeholder="Rechercher par nom d'utilisateur"
          onSubmitSearchValue={handleSearch}
        />
        <table className="w-full table">
          <thead>
            <tr className="text-xs font-semibold text-primary">
              <th
                className="cursor-pointer"
                onClick={() => props.onSorting("lastname")}
              >
                <div className="flex items-center gap-x-2">
                  <p>Utilisateur</p>
                  <SortColumnIcon
                    fieldSort={props.stype}
                    column="lastname"
                    direction={props.sdir}
                  />
                </div>
              </th>
              <th
                className="cursor-pointer"
                onClick={() => props.onSorting("role")}
              >
                <div className="flex items-center gap-x-2">
                  <p>Rôle</p>
                  <SortColumnIcon
                    fieldSort={props.stype}
                    column="role"
                    direction={props.sdir}
                  />
                </div>
              </th>
              <th
                className="cursor-pointer"
                onClick={() => props.onSorting("groupName")}
              >
                <div className="flex items-center gap-x-2">
                  <p>Promotion</p>
                  <SortColumnIcon
                    fieldSort={props.stype}
                    column="groupName"
                    direction={props.sdir}
                  />
                </div>
              </th>
              <th
                className="cursor-pointer"
                onClick={() => props.onSorting("totalTokens")}
              >
                <div className="flex items-center gap-x-2">
                  <p>Quantité</p>
                  <SortColumnIcon
                    fieldSort={props.stype}
                    column="totalTokens"
                    direction={props.sdir}
                  />
                </div>
              </th>
              <th
                className="cursor-pointer"
                onClick={() => props.onSorting("createdAt")}
              >
                <div className="flex items-center gap-x-2">
                  <p>Dernière utilisation</p>
                  <SortColumnIcon
                    fieldSort={props.stype}
                    column="createdAt"
                    direction={props.sdir}
                  />
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {props.dataList.map((user: TopUser) => (
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
                  {user.role === "student" ? "Apprenant" : "Équipe pédagogique"}
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
        page={props.page}
        setPage={props.setPage}
        totalPages={props.totalPages}
        perPage={props.perPage}
        setPerPages={props.setPerPage}
      />
    </div>
  );
}
