/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useCallback, useState } from "react";
import { csvUsersFields } from "../../../../../../../config/csv/csv-users-fields";
import RightSideDrawer from "../../../../../../../components/UI/right-side-drawer/right-side-drawer";
import User from "../../../../../../../utils/interfaces/user";
import { toast } from "react-hot-toast";
import apiClient from "../../../../../../../lib/axios";
import CsvUserListConfirmation from "./csv-user-list-confirmation.component";
import CsvImportUser from "../csv-import.component";

const CsvImportUserList: FC<{
  onAddUsers: (users: Array<User>) => void;
  usersAddedInTable: User[];
}> = ({ onAddUsers, usersAddedInTable }) => {
  const [usersToImport, setUsersToImport] = useState<User[]>([]);
  const [selectedUsersToUpload, setSelectedUsersToUpload] = useState<User[]>(
    [],
  );
  const [isDrawerOpen, setDrawerOpenState] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState(false);

  const handleImportCsv = (data: User[]) => {
    if (data) {
      // transform data here with a function
      const nonEmptyEmails = data.filter((item) => item.email.length > 0);

      const dataWithoutDuplicate = [
        ...new Set(nonEmptyEmails.map((item) => item.email)),
      ].map((email) => data.find((item) => item.email === email)!);

      const filteredData = dataWithoutDuplicate.filter(
        (item) => Object.keys(item).length > 0,
      );
      setUsersToImport(filteredData);
      setSelectedUsersToUpload(filteredData);
      setDrawerOpenState(true);
    } else {
      toast.error("problème d'importation des données");
    }
  };

  const handleSubmitToDatabase = () => {
    if (!(selectedUsersToUpload.length > 0)) {
      toast.error("aucun utilisateur sélectionné");
      return;
    }

    selectedUsersToUpload.map((user) => {
      if (user.birthDate) {
        const [day, month, year] = (user.birthDate as unknown as string).split(
          "/"
        );
        const date = `${year}-${month}-${day}`;
        user.birthDate = new Date(date);
      }

      return user;
    });

    const applyData = (data: any) => {
      setDrawerOpenState(false);
      onAddUsers(data.usersCreated);
      toast.success("étudiants enregistrés");
    };
    setIsLoading(true);
    apiClient
      .post("/user/many", selectedUsersToUpload)
      .then((response) => applyData(response.data))
      .catch((err) => {
        const errorMessage =
          err?.response?.data?.message ?? "Erreur inconnue";
        toast.error(errorMessage);
      })
      .finally(() => setIsLoading(false));
  };

  const handleAddSelectedUser = (user: User) => {
    setSelectedUsersToUpload((selectedUsersToUpload) => [
      ...selectedUsersToUpload,
      user,
    ]);
  };

  const handleAddAllUsers = () => {
    setSelectedUsersToUpload(usersToImport);
  };

  const handleClearAllUsers = () => {
    setSelectedUsersToUpload([]);
  };

  const handleDeleteSelectedUser = useCallback((user: User) => {
    setSelectedUsersToUpload((selectedUsersToUpload) =>
      selectedUsersToUpload.filter(
        (currentUser) => currentUser.email !== user.email
      )
    );
  }, []);

  const handleCloseDrawer = () => {
    setDrawerOpenState(false);
    setUsersToImport([]);
    setSelectedUsersToUpload([]);
  };

  return (
    <div>
      <CsvImportUser
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
        onCloseDrawer={handleCloseDrawer}
      >
        <CsvUserListConfirmation
          usersFromCsv={usersToImport}
          usersToAdd={usersAddedInTable}
          onConfirmSubmit={handleSubmitToDatabase}
          setDrawerOpenState={setDrawerOpenState}
          isLoading={isLoading}
          onAddSelectedUser={handleAddSelectedUser}
          onDeleteSelectedUser={handleDeleteSelectedUser}
          onSelectAllUsers={handleAddAllUsers}
          onDeselectAllUsers={handleClearAllUsers}
        />
      </RightSideDrawer>
    </div>
  );
};

export default CsvImportUserList;
