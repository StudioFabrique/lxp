import { Dispatch, FC, SetStateAction, useState } from "react";
import { csvUsersFields } from "../../../../config/csv/csv-users-fields";
import RightSideDrawer from "../../right-side-drawer/right-side-drawer";
import CsvImport from "../csv-import.component";
import UserListConfirmation from "./user-list-confirmation.component";
import User from "../../../../utils/interfaces/user";
import { toast } from "react-hot-toast";
import useHttp from "../../../../hooks/use-http";

const CsvImportUserList: FC<{
  setDataUpdateState: Dispatch<SetStateAction<boolean>>;
  onAddUsers: (users: Array<User>) => void;
}> = ({ setDataUpdateState, onAddUsers }) => {
  const [usersToImport, setUsersToImport] = useState<User[]>([]);
  const [isDrawerOpen, setDrawerOpenState] = useState<boolean>(false);

  const { isLoading, sendRequest, error } = useHttp();

  const handleImportCsv = (data: User[]) => {
    if (data) {
      console.log(data);
      setUsersToImport(data);
      setDrawerOpenState(true);
    } else {
      toast("problème d'importation des données");
    }
  };

  const handleSubmitToDatabase = async () => {
    sendRequest(
      {
        path: "/user/many",
        body: usersToImport,
        method: "post",
      },
      (data) => {
        setDrawerOpenState(false);
        setDataUpdateState(true);
        onAddUsers(data.usersCreated);
        toast.success("étudiants enregistrés");
      }
    );
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
          setDrawerOpenState={setDrawerOpenState}
          isLoading={isLoading}
        />
      </RightSideDrawer>
    </div>
  );
};

export default CsvImportUserList;
