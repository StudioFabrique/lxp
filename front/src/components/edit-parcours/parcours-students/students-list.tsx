import { useSelector } from "react-redux";
import useEagerLoadingList from "../../../hooks/use-eager-loading-list";
import User from "../../../utils/interfaces/user";
import SortColumnIcon from "../../UI/sort-column-icon.component/sort-column-icon.component";
import StudentItem from "./student-item";
import Group from "../../../utils/interfaces/group";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { parcoursGroupsAction } from "../../../store/redux-toolkit/parcours/parcours-groups";
import Pagination from "../../UI/pagination/pagination";
import Search from "../../UI/search/search.component";
import { userInGroupSearchOptions } from "../../../config/search-options";
import RefreshIcon from "../../UI/svg/refresh-icon.component";

interface StudentsListProps {
  initalList: User[];
}

const StudentsList = (props: StudentsListProps) => {
  const {
    list,
    page,
    fieldSort,
    direction,
    totalPages,
    setPage,
    getFilteredList,
    resetFilters,
    sortData,
  } = useEagerLoadingList(props.initalList, "lastname");
  const groups = useSelector(
    (state: any) => state.parcoursGroups.groups
  ) as Group[];
  const [filter, setFilter] = useState<string | null>(null);
  const dispatch = useDispatch();

  const handleFilterGroups = (_id: string) => {
    if (filter === _id) {
      resetFilters();
      setFilter(null);
    } else {
      setFilter(_id);
      getFilteredList({ field: "group", property: "_id", value: _id });
    }
  };

  const setStyle = (_id: string) => {
    return _id === filter
      ? "btn btn-sm rounded-full btn-accent"
      : "btn btn-sm rounded-full btn-info";
  };

  const removeBtn = (
    <button className="btn btn-xs btn-error btn-circle lowercase">x</button>
  );

  const handleRemoveGroup = (_id: string) => {
    setFilter(null);
    dispatch(parcoursGroupsAction.removeGroup(_id));
  };

  const handleSearch = (field: string, value: string) => {
    getFilteredList({ field, property: "", value });
  };

  const handleRefreshList = () => {
    resetFilters();
    setFilter(null);
  };

  return (
    <>
      <article className="w-full flex justify-between items-center">
        <ul className="flex gap-x-2">
          {groups.map((group) => (
            <li className={setStyle(group._id!)} key={group._id}>
              <span className="flex items-center gap-x-4">
                <p onClick={() => handleFilterGroups(group._id!)}>
                  {group.name}
                </p>
                <div onClick={() => handleRemoveGroup(group._id!)}>
                  {removeBtn}
                </div>
              </span>
            </li>
          ))}
        </ul>
        <div className="flex gap-x-2 items-center">
          <Search options={userInGroupSearchOptions} onSearch={handleSearch} />
          <div className="text-primary" onClick={handleRefreshList}>
            <RefreshIcon size={6} />
          </div>
        </div>
      </article>

      {list && list.length > 0 ? (
        <>
          <article>
            <table className="table w-full border-separate border-spacing-y-2">
              <thead>
                <tr>
                  <th>Avatar</th>
                  <th
                    className="cursor-pointer"
                    onClick={() => {
                      sortData("firstname");
                    }}
                  >
                    <div className="flex items-center gap-x-2">
                      <p>Prénom</p>
                      <SortColumnIcon
                        fieldSort={fieldSort}
                        column="firstname"
                        direction={direction}
                      />
                    </div>
                  </th>
                  <th
                    className="cursor-pointer"
                    onClick={() => {
                      sortData("lastname");
                    }}
                  >
                    <div className="flex items-center gap-x-2">
                      <p>Nom</p>
                      <SortColumnIcon
                        fieldSort={fieldSort}
                        column="lastname"
                        direction={direction}
                      />
                    </div>
                  </th>
                  <th
                    className="cursor-pointer"
                    onClick={() => {
                      sortData("email");
                    }}
                  >
                    <div className="flex items-center gap-x-2">
                      <p>Email</p>
                      <SortColumnIcon
                        fieldSort={fieldSort}
                        column="email"
                        direction={direction}
                      />
                    </div>
                  </th>
                  <th
                    className="cursor-pointer"
                    onClick={() => {
                      sortData("group");
                    }}
                  >
                    <div className="flex items-center gap-x-2">
                      <p>Formation</p>
                      <SortColumnIcon
                        fieldSort={fieldSort}
                        column="CDA"
                        direction={direction}
                      />
                    </div>
                  </th>
                  <th
                    className="cursor-pointer"
                    onClick={() => {
                      sortData("group");
                    }}
                  >
                    <div className="flex items-center gap-x-2">
                      <p>Groupe</p>
                      <SortColumnIcon
                        fieldSort={fieldSort}
                        column="group"
                        direction={direction}
                      />
                    </div>
                  </th>
                  <th
                    className="cursor-pointer"
                    onClick={() => {
                      sortData("createdAt");
                    }}
                  >
                    <div className="flex items-center gap-x-2">
                      <p>Ajouté le</p>
                      <SortColumnIcon
                        fieldSort={fieldSort}
                        column="createdAt"
                        direction={direction}
                      />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {list.map((item: any, index: number) => (
                  <tr
                    className="bg-secondary/10 hover:bg-secondary/20 hover:text-base-content"
                    key={index}
                  >
                    <StudentItem studentItem={item} />
                  </tr>
                ))}
              </tbody>
            </table>
          </article>
          <article>
            <Pagination page={page} totalPages={totalPages} setPage={setPage} />
          </article>
        </>
      ) : (
        <p>Les groupes choisis sont vides.</p>
      )}
    </>
  );
};

export default StudentsList;
