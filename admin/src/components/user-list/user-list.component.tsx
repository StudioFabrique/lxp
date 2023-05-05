import { useEffect, useMemo, useState } from "react";
import ReactTable from "../react-table/react-table.component";
import toTitleCase from "../../utils/toTitleCase";
import User from "../../utils/interfaces/user";
import { Link } from "react-router-dom";
import useHttp from "../../hooks/use-http";
import Tabs from "../UI/tabs/tabs";
import usePagination from "../../hooks/use-pagination";

const roles = ["admin", "teacher", "student"];

const UserList = () => {
  const [role, setRole] = useState(roles[0]);
  const [userList, setUserList] = useState<Array<any>>([]);
  const { sendRequest } = useHttp();
  const { page, perPage, totalPages, setTotalPages, initPagination, setPage } =
    usePagination();
  const [stype, setStype] = useState("firstname");
  const [sdir, setSdir] = useState(false);

  const handleSorting = (column: number) => {
    const columns = [
      "firstname",
      "lastname",
      "promotion",
      "createdAt",
      "updatedAt",
    ];
    if (column !== 4 && column !== 7) {
      if (columns[column - 1] !== stype) {
        setSdir(false);
      } else {
        setSdir((prevSdir) => {
          return !prevSdir;
        });
      }
      setStype(columns[column - 1]);
      initPagination();
    }
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
      });
      setTotalPages(data.total);
      setUserList(data.users);
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

  const handleRoleSwitch = (newRole: string) => {
    initPagination();
    setRole(newRole);
  };

  const columns = useMemo(
    () => [
      {
        Header: "",
        accessor: "index",
      },
      {
        Header: "Prénom",
        accessor: "firstname" as const,
      },
      {
        Header: "Nom",
        accessor: "lastname" as const,
      },
      {
        Header: "Promotion",
        accessor: "promotion" as const,
        Cell: ({ cell: { value: promotion } }: { cell: { value: string } }) => {
          return promotion ? (
            <p>{toTitleCase(promotion)}</p>
          ) : (
            <p className="flex justify-center">-</p>
          );
        },
      },
      {
        Header: "Rôle",
        accessor: "roles" as const,
        Cell: ({
          cell: { value: roles },
        }: {
          cell: { value: Array<string> };
        }) => {
          return <p>{toTitleCase(roles[0])}</p>;
        },
      },
      {
        Header: "Date de Création",
        accessor: "createdAt" as const,
      },
      {
        Header: "Mis à jour le",
        accessor: "updatedAt" as const,
      },
      {
        Header: "Actions",
        accessor: "id" as const,
        Cell: ({ row: { original } }: { row: { original: User } }) => (
          <div className="flex gap-x-2">
            <Link to="#">Détails</Link>
            <Link to="#">Editer</Link>
            <Link to="#">Supprimer</Link>
          </div>
        ),
      },
    ],
    []
  );
  return (
    <div>
      <Tabs role={role} roles={roles} onRoleSwitch={handleRoleSwitch} />
      <ReactTable
        columns={columns}
        data={userList}
        page={page}
        perPage={perPage}
        totalPages={totalPages}
        setPage={setPage}
        onSort={handleSorting}
      />
    </div>
  );
};

export default UserList;
