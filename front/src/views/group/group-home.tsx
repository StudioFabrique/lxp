import { Link } from "react-router-dom";
import Can from "../../components/UI/can/can.component";
import Header from "../../components/UI/header";
import { groupHomeTableItems } from "./group-home-table-config";
import { Pen, Trash2 } from "lucide-react";
import { TableListActionConfig } from "../../components/table/table-list/interfaces/table-list-action";
import Table from "../../components/table/table";
import TablePagination from "../../components/table/table-pagination/table-pagination";

const GroupHome = () => {
  // usePagination here to get data

  const dataTest = [
    {
      _id: "1",
      name: "name name",
      avatar: "",
      description: "test",
      formation: "test1234",
      nbStudents: "1",
    },
    {
      _id: "ndddt6678",
      name: "firstname test",
      avatar: "",
      description: "test",
      formation: "test1234",
      nbStudents: "10",
    },
  ];

  const actions: TableListActionConfig[] = [
    {
      property: "edit",
      type: "link",
      tooltip: "Modifier",
      icon: Pen,
      additionnalClassname: "btn-ghost",
      request: { path: "edit/[:id]", method: "get" },
    },
    {
      property: "delete",
      type: "button",
      tooltip: "Supprimer",
      icon: Trash2,
      additionnalClassname: "btn-ghost text-error",
      onSuccessfulSubmit: () => {},
    },
  ];

  return (
    <div className="flex flex-col gap-5 p-10">
      <Header
        title="Liste des groupes"
        description="Créer, modifier et supprimer des groupes"
      >
        <Can action="write" object="user">
          <Link className="btn btn-primary" to="/admin/group/add">
            Créer un groupe
          </Link>
        </Can>
      </Header>
      <Table
        searchBar={{
          title: "Groupes",
          placeholder: "Rechercher un groupe",
          // actions: [],
        }}
        list={{
          idProperty: "_id",
          avatar: { property: "avatar" },
          data: dataTest,
          tableItemsConfig: groupHomeTableItems,
          actionsItems: actions,
          style: {
            showCheckbox: true,
            showAvatar: true,
            emptyArrayMessage: "Aucun groupe disponible",
          },
        }}
      >
        {/* <TablePagination {...paginationProps} /> */}
        <TablePagination
          maxPage={5}
          page={1}
          itemsPerPage={5}
          onSetItemsPerPage={() => {}}
        />
      </Table>
    </div>
  );
};

export default GroupHome;
