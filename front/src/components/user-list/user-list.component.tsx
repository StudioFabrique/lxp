import { useEffect, useState } from "react";
import useHttp from "../../hooks/use-http";
import usePagination from "../../hooks/use-pagination";
import toTitleCase from "../../utils/toTitleCase";
import Pagination from "../UI/pagination/pagination";
import Tabs from "../UI/tabs/tabs";
import { Link } from "react-router-dom";

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

  console.log("allchecked", allChecked);

  const handleCheckRow = (id: string) => {
    setUserList((prevUserList: any) =>
      prevUserList.map((item: any) =>
        item._id === id ? { ...item, isSelected: !item.isSelected } : item
      )
    );
  };

  const handleAllChecked = () => {
    console.log(allChecked);

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

  const handleRoleSwitch = (role: string) => {
    setRole(role);
    initPagination();
    setAllChecked(false);
  };

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
              handleSorting("roles");
            }}
          >
            Rôles
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
              handleSorting("updatedAt");
            }}
          >
            Mis à jour le
          </th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {userList.map((item: any) => (
          <tr className="hover:bg-primary/20" key={item._id}>
            <td className="bg-transparent">
              <input
                className="my-auto checkbox"
                type="checkbox"
                checked={item.isSelected}
                onChange={() => handleCheckRow(item._id)}
              />
            </td>
            <td className="font-bold bg-transparent">{item.index}</td>
            <td className="bg-transparent">{`${toTitleCase(
              item.lastname
            )} ${toTitleCase(item.firstname)}`}</td>
            <td className="bg-transparent">{item.email}</td>
            <td className="bg-transparent">{item.roles[0]}</td>
            <td className="bg-transparent">{item.createdAt}</td>
            <td className="bg-transparent">{item.updatedAt}</td>
            <td className="bg-transparent font-bold text-xs">
              <div className="flex gap-x-2">
                <Link to="#">Détails</Link>
                <Link to="#">Editer</Link>
                <Link to="#">Supprimer</Link>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div>
      <Tabs role={role} roles={roles} onRoleSwitch={handleRoleSwitch} />
      {content}
      <Pagination page={page} totalPages={totalPages} setPage={setPage} />
    </div>
  );
};

export default UserList;
