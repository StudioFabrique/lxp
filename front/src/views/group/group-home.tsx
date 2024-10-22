import { Link } from "react-router-dom";
import Can from "../../components/UI/can/can.component";
import Header from "../../components/UI/header";
import { groupHomeTableItems } from "./group-home-table-config";
import { Pen, Trash2 } from "lucide-react";
import { TableListActionConfig } from "../../components/table/table-list/interfaces/table-list-action";
import Table from "../../components/table/table";

const GroupHome = () => {
  // usePagination here to get data

  const dataTest = [
    // {
    //   _id: "1",
    //   name: "name name",
    //   description: "test",
    //   formation: "test1234",
    //   nbStudents: "1",
    // },
    // {
    //   _id: "ndddt6678",
    //   name: "firstname test",
    //   description: "test",
    //   formation: "test1234",
    //   nbStudents: "10",
    // },
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
          data: dataTest,
          tableItems: groupHomeTableItems,
          actionsItems: actions,
          style: {
            showCheckbox: true,
            emptyArrayMessage: "Aucun groupe disponible",
          },
        }}
        pagination={{
          onSetItemsPerPage: () => {},
        }}
      />
    </div>
  );
};

export default GroupHome;
