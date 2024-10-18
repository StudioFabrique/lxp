import { Link } from "react-router-dom";
import Can from "../../components/UI/can/can.component";
import Header from "../../components/UI/header";
import { groupHomeTableItems } from "./group-home-table-config";
import { TableListActionConfig } from "../../components/lists/generic-table-list/interfaces/table-list-action";
import TableList from "../../components/table/generic-table-list/table-list";

const GroupHome = () => {
  // usePagination here to get data

  const dataTest = [
    {
      _id: "1",
      name: "name name",
      testField: "test",
      test: "test1234",
      nbStudents: "1",
    },
    {
      _id: "ndddt6678",
      name: "firstname test",
      testField: "test",
      test: "test1234",
      nbStudents: "10",
    },
  ];

  const actions: TableListActionConfig[] = [
    { type: "button", property: "testing", onSuccessfulSubmit: () => {} },
  ];

  return (
    <div className="p-10">
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
      <TableList
        idProperty="_id"
        data={dataTest}
        tableItems={groupHomeTableItems}
        actionsItems={actions}
      />
    </div>
  );
};
export default GroupHome;
