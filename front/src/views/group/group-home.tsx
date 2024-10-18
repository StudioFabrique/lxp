import { Link } from "react-router-dom";
import Can from "../../components/UI/can/can.component";
import Header from "../../components/UI/header";
import GenericTable from "../../components/lists/generic-table-with-pagination/generic-table";
import { groupHomeTableItems } from "./group-home-table-config";
import { GenericActionConfig } from "../../components/lists/generic-table-with-pagination/interfaces/generic-action";

const GroupHome = () => {
  // usePagination here to get data

  const dataTest = [
    {
      _id: "hbdhj23223",
      name: "name name",
      test: "test1234",
    },
    {
      _id: "ndddt6678",
      name: "firstname test",
      test: "test1234",
    },
  ];

  const handleTest = () => {
    console.log("test");
  };

  const actions: GenericActionConfig[] = [
    { type: "button", property: "test", onSuccessfulSubmit: handleTest },
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
      <GenericTable
        idProperty="_id"
        data={dataTest}
        tableItems={groupHomeTableItems}
        actionsItems={actions}
      />
    </div>
  );
};
export default GroupHome;
