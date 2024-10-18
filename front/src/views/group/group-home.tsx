import { Link } from "react-router-dom";
import Can from "../../components/UI/can/can.component";
import Header from "../../components/UI/header";
import GenericTable from "../../components/lists/generic-table-with-pagination/generic-table";
import { groupHomeTableItems } from "./group-home-table-config";
import { GenericActionConfig } from "../../components/lists/generic-table-with-pagination/interfaces/generic-action";

const GroupHome = () => {
  // usePagination here to get data

  const actions: GenericActionConfig[] = [];

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
        data={}
        tableItems={groupHomeTableItems}
        actions={actions}
      />
    </div>
  );
};
export default GroupHome;
