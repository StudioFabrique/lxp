import { useCallback, useContext, useEffect, useState } from "react";
import useHttp from "../../hooks/use-http";
import usePagination from "../../hooks/use-pagination";
import Pagination from "../UI/pagination/pagination";
import Tabs from "../UI/tabs/tabs";
import UserItem from "./user-item.component";
import RoleSelect from "./roles-select";
import { Context } from "../../store/context.store";

const roles = ["admin", "teacher", "student"];

const UserList = () => {
  const [userList, setUserList] = useState<any>([]);
  const [stype, setStype] = useState("lastname");
  const [sdir, setSdir] = useState(false);
  const [role, setRole] = useState("admin");
  const [allChecked, setAllChecked] = useState(false);
  const { sendRequest } = useHttp();
  const { page, perPage, totalPages, setTotalPages, initPagination, setPage } =
    usePagination();
  const { user } = useContext(Context);

  const handleSorting = (column: string) => {
    if (column !== stype) {
      setSdir(false);
    } else {
      setSdir((prevSdir) => {
        return !prevSdir;
      });
    }
    setStype(column);
    initPagination();
  };

  useEffect(() => {
    const applyData = (data: any) => {
      let index = (page - 1) * perPage + 1;
      data.users.forEach((item: any) => {
        item.index = index++ + ".";
        item.createdAt =
          item?.createdAt && new Date(item.createdAt).toLocaleDateString();
        item.updatedAt =
          item?.updatedAt && new Date(item.updatedAt).toLocaleDateString();
        item.isSelected = false;
      });
      setTotalPages(data.total);
      setUserList(data.users);
      setAllChecked(false);
    };
    sendRequest(
      {
        path: `/user/${role}/${stype}/${
          sdir ? "desc" : "asc"
        }?page=${page}&limit=${perPage}`,
      },
      applyData
    );
  }, [sendRequest, page, perPage, setTotalPages, role, stype, sdir]);

  const handleCheckRow = (id: string) => {
    setUserList((prevUserList: any) =>
      prevUserList.map((item: any) =>
        item._id === id ? { ...item, isSelected: !item.isSelected } : item
      )
    );
  };

  const handleAllChecked = () => {
    setAllChecked((prevAllChecked) => {
      return !prevAllChecked;
    });
    setUserList((prevUserList: any) =>
      prevUserList.map((item: any) => ({
        ...item,
        isSelected: !allChecked,
      }))
    );
  };

  const handleRolesChange = (newRoles: Array<string>, userId: string) => {
    console.log("updating roles");

    const updatedUserList = userList.map((item: any) =>
      item._id === userId
        ? {
            ...item,
            roles: newRoles,
          }
        : item
    );
    setUserList(updatedUserList);
  };

  const handleRoleSwitch = (role: string) => {
    setRole(role);
    initPagination();
    setAllChecked(false);
  };

  const handleGroupRolesChange = (updatedRoles: Array<string>) => {
    const updatedUserList = userList.map((item: any) => {
      if (item.isSelected && !item.roles.includes(user!.roles[0])) {
        return {
          ...item,
          roles: updatedRoles,
        };
      }
      return item;
    });

    setUserList(updatedUserList);
  };

  console.log(userList);

  let content = (
    <table className="table w-full">
      <thead>
        <tr>
          <th>
            <input
              className="my-auto checkbox"
              type="checkbox"
              checked={allChecked}
              onChange={handleAllChecked}
            />
          </th>
          <th></th>
          <th
            className="cursor-pointer"
            onClick={() => {
              handleSorting("lastname");
            }}
          >
            Nom
          </th>
          <th
            className="cursor-pointer"
            onClick={() => {
              handleSorting("email");
            }}
          >
            Email
          </th>
          <th
            className="cursor-pointer"
            onClick={() => {
              handleSorting("createdAt");
            }}
          >
            Créé le
          </th>
          <th
            className="cursor-pointer"
            onClick={() => {
              handleSorting("roles");
            }}
          >
            Rôles
          </th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {userList.map((item: any) => (
          <tr className="hover:bg-primary/20" key={item._id}>
            {
              <UserItem
                userItem={item}
                onRowCheck={handleCheckRow}
                onRolesChange={handleRolesChange}
              />
            }
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div>
      <Tabs role={role} roles={roles} onRoleSwitch={handleRoleSwitch} />
      <div>
        <RoleSelect onGroupRolesChange={handleGroupRolesChange} />
      </div>
      {content}
      <Pagination page={page} totalPages={totalPages} setPage={setPage} />
    </div>
  );
};

export default UserList;
