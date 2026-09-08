import { FC, useCallback, useState } from "react";
import { Download, Upload } from "lucide-react";
import { csvUsersFields } from "../../../../../../../config/csv/csv-users-fields";
import RightSideDrawer from "../../../../../../../components/UI/right-side-drawer/right-side-drawer";
import User from "../../../../../../../utils/interfaces/user";
import { toast } from "react-hot-toast";
import { mutations as userMutations } from "../../../../../../user/api/user.api";
import CsvUserListConfirmation from "./csv-user-list-confirmation.component";
import CsvImportUser from "../csv-import.component";
import { getApiErrorMessage } from "../../../../../../../utils/helpers/api-error-message";
import { downloadFile } from "../../../../../../../utils/helpers/download-csv-template";
import { DOWNLOAD_URL } from "../../../../../../../config/urls";

type CreateManyUsersResponse = {
  usersCreated: User[];
  createdCount: number;
  message?: string;
};

const CsvImportUserList: FC<{
  onAddUsers: (users: Array<User>) => void;
}> = ({ onAddUsers }) => {
  const [usersToImport, setUsersToImport] = useState<User[]>([]);
  const [selectedUsersToUpload, setSelectedUsersToUpload] = useState<User[]>(
    [],
  );
  const [isDrawerOpen, setDrawerOpenState] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState(false);

  const handleImportCsv = (data: User[]) => {
    const usersByEmail = new Map<string, User>();

    data.forEach((user) => {
      const email = user.email?.trim();
      if (!email) return;

      const normalizedEmail = email.toLocaleLowerCase("fr");
      if (!usersByEmail.has(normalizedEmail)) {
        usersByEmail.set(normalizedEmail, { ...user, email });
      }
    });

    const users = [...usersByEmail.values()];
    if (users.length === 0) {
      toast.error("Le fichier CSV ne contient aucune adresse email valide");
      return;
    }

    setUsersToImport(users);
    setSelectedUsersToUpload(users);
  };

  const handleSubmitToDatabase = () => {
    if (!(selectedUsersToUpload.length > 0)) {
      toast.error("aucun utilisateur sélectionné");
      return;
    }

    const usersToUpload = selectedUsersToUpload.map((user) => {
      if (user.birthDate) {
        const [day, month, year] = (user.birthDate as unknown as string).split(
          "/",
        );
        const date = `${year}-${month}-${day}`;
        return { ...user, birthDate: new Date(date) };
      }

      return user;
    });

    const applyData = (data: CreateManyUsersResponse) => {
      handleCloseDrawer();
      onAddUsers(data.usersCreated);

      // L'API détaille ce qui a été créé et ce qui a été écarté (adresses déjà
      // enregistrées, lignes sans email). Un fichier entièrement composé de
      // doublons affichait auparavant « étudiants enregistrés ».
      const message = data.message ?? "étudiants enregistrés";

      if (data.createdCount === 0) {
        toast(message, { icon: "ℹ️" });
        return;
      }

      toast.success(message);
    };
    setIsLoading(true);
    userMutations
      .createMany(usersToUpload)
      .then(applyData)
      .catch((err) => {
        toast.error(
          getApiErrorMessage(err, "L'import des étudiants a échoué."),
        );
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
        (currentUser) => currentUser.email !== user.email,
      ),
    );
  }, []);

  const handleCloseDrawer = () => {
    setDrawerOpenState(false);
    setUsersToImport([]);
    setSelectedUsersToUpload([]);
  };

  const handleDownloadFile = () => {
    void downloadFile(
      `${DOWNLOAD_URL}/csv-users-group-modele.csv`,
      "csv-users-group-modele.csv",
    ).then((hasDownloaded) => {
      if (!hasDownloaded) {
        toast.error("Le modèle CSV n'a pas pu être téléchargé");
      }
    });
  };

  const isConfirmingImport = usersToImport.length > 0;

  return (
    <>
      <button
        type="button"
        className="btn btn-sm whitespace-nowrap"
        onClick={() => setDrawerOpenState(true)}
      >
        <Upload className="h-5 w-5" />
        Importer une liste d'étudiants
      </button>

      <RightSideDrawer
        title={
          isConfirmingImport
            ? "Confirmer la création des étudiants"
            : "Importer une liste d'étudiants"
        }
        id="add-user"
        visible={false}
        isOpen={isDrawerOpen}
        onCloseDrawer={handleCloseDrawer}
      >
        {isConfirmingImport ? (
          <CsvUserListConfirmation
            usersFromCsv={usersToImport}
            usersToAdd={selectedUsersToUpload}
            onConfirmSubmit={handleSubmitToDatabase}
            onCancel={handleCloseDrawer}
            isLoading={isLoading}
            onAddSelectedUser={handleAddSelectedUser}
            onDeleteSelectedUser={handleDeleteSelectedUser}
            onSelectAllUsers={handleAddAllUsers}
            onDeselectAllUsers={handleClearAllUsers}
          />
        ) : (
          <div className="flex min-h-full flex-col">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleDownloadFile}
                className="btn btn-outline btn-sm btn-primary whitespace-nowrap"
              >
                <Download className="h-4 w-4" />
                Télécharger le modèle
              </button>
            </div>

            <div className="flex flex-1 items-center justify-center pb-16">
              <CsvImportUser
                onParseCsv={handleImportCsv}
                fields={csvUsersFields}
              />
            </div>
          </div>
        )}
      </RightSideDrawer>
    </>
  );
};

export default CsvImportUserList;
