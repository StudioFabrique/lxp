import { useState } from "react";
import { csvUsersFields } from "../../../../config/csv/csv-users-fields";
import RightSideDrawer from "../../right-side-drawer/right-side-drawer";
import CsvImport from "../csv-import.component";
import UserListConfirmation from "./user-list-confirmation.component";
import User from "../../../../utils/interfaces/user";
import { toast } from "react-hot-toast";

const CsvImportUserList = () => {
  const [usersToImport, setUsersToImport] = useState<User[]>([]);
  const [isDrawerOpen, setDrawerOpenState] = useState<boolean>(false);

  const handleImportCsv = (data: any) => {
    if (data) {
      console.log(data);
      setUsersToImport(data);
      setDrawerOpenState(true);
    } else {
      toast("problème d'importation des données");
    }
  };

  const handleSubmitToDatabase = () => {
    setDrawerOpenState(false);
  };

  return (
    <div>
      <CsvImport
        type="text"
        origin=""
        onParseCsv={handleImportCsv}
        fields={csvUsersFields}
      />
      <RightSideDrawer
        title="Confirmer la création des étudiants"
        id="add-user"
        visible={false}
        isOpen={isDrawerOpen}
      >
        <UserListConfirmation
          usersFromCsv={usersToImport}
          onConfirmSubmit={handleSubmitToDatabase}
        />
      </RightSideDrawer>
    </div>
  );
};

export default CsvImportUserList;
