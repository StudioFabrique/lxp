import { Dispatch, FC, SetStateAction, useState } from "react";
import { csvUsersFields } from "../../../../config/csv/csv-users-fields";
import RightSideDrawer from "../../right-side-drawer/right-side-drawer";
import CsvImport from "../csv-import.component";
import User from "../../../../utils/interfaces/user";
import { toast } from "react-hot-toast";
import useHttp from "../../../../hooks/use-http";
import CsvUserListConfirmation from "./csv-user-list-confirmation.component";

const CsvImportUserList: FC<{
  setDataUpdateState: Dispatch<SetStateAction<boolean>>;
  onAddUsers: (users: Array<User>) => void;
}> = ({ setDataUpdateState, onAddUsers }) => {
  const [usersToImport, setUsersToImport] = useState<User[]>([]);
  const [selectedUsersToUpload, setSelectedUsersToUpload] = useState<User[]>(
    []
  );
  const [isDrawerOpen, setDrawerOpenState] = useState<boolean>(false);

  const { isLoading, sendRequest, error } = useHttp();

  const handleImportCsv = (data: User[]) => {
    if (data) {
      setUsersToImport(data);
      setDrawerOpenState(true);
    } else {
      toast.error("problème d'importation des données");
    }
  };

  const handleSubmitToDatabase = async () => {
    if (!(selectedUsersToUpload.length > 0)) {
      toast.error("aucun utilisateur sélectionné");
      return;
    }
    sendRequest(
      {
        path: "/user/many",
        body: selectedUsersToUpload,
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

  const handleAddSelectedUser = (user: User) => {
    setSelectedUsersToUpload((selectedUsersToUpload) => [
      ...selectedUsersToUpload,
      user,
    ]);
  };

  const handleDeleteSelectedUser = (email: string) => {
    setSelectedUsersToUpload((selectedUsersToUpload) =>
      selectedUsersToUpload.filter((user) => user.email !== email)
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
        <CsvUserListConfirmation
          usersFromCsv={usersToImport}
          onConfirmSubmit={handleSubmitToDatabase}
          setDrawerOpenState={setDrawerOpenState}
          isLoading={isLoading}
          onAddSelectedUser={handleAddSelectedUser}
          onDeleteSelectedUser={handleDeleteSelectedUser}
        />
      </RightSideDrawer>
    </div>
  );
};

export default CsvImportUserList;
