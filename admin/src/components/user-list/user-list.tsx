import { FC, useMemo } from "react";
import ReactTable from "../react-table/react-table";
import toTitleCase from "../../utils/toTitleCase";
import User from "../../utils/interfaces/user";
import { Link } from "react-router-dom";

const UserList: FC<{ userList: Array<any> }> = ({ userList }) => {
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
      {columns !== undefined ? (
        <ReactTable columns={columns} data={userList} />
      ) : null}
    </div>
  );
};

export default UserList;
