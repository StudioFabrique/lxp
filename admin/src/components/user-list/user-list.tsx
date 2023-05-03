import { FC, useMemo } from "react";
import ReactTable from "../react-table/react-table";
import toTitleCase from "../../utils/toTitleCase";
import User from "../../utils/interfaces/user";

const UserList: FC<{ userList: Array<User> }> = ({ userList }) => {
  const columns = useMemo(
    () => [
      {
        Header: "Prénom",
        accessor: "firstname",
      },
      {
        Header: "Nom",
        accessor: "lastname",
      },
      {
        Header: "Rôle",
        accessor: "roles",
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
        accessor: "createdAt",
      },
      {
        Header: "Mis à jour le",
        accessor: "updatedAt",
      },
    ],
    []
  );
  return (
    <div>
      {columns !== undefined ? (
        <ReactTable columns={columns} data={userList} />
      ) : null}
    </div>
  );
};

export default UserList;
