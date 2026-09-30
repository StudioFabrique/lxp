import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  csvUsersSchema,
  type CsvUserRow,
} from "../../../../../../user/csv-user.schema";
import { showFormErrors } from "../../../../../../../components/form/form-errors";
import { FC, useState } from "react";
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
  const [usersToImport, setUsersToImport] = useState<CsvUserRow[]>([]);
  const form = useForm<
    z.input<typeof csvUsersSchema>,
    unknown,
    z.output<typeof csvUsersSchema>
  >({ resolver: zodResolver(csvUsersSchema), defaultValues: { users: [] } });
  const selectedUsersToUpload = form.watch("users");
  const setSelectedUsersToUpload = (users: CsvUserRow[]) =>
    form.setValue("users", users, { shouldDirty: true, shouldValidate: true });
  const [isDrawerOpen, setDrawerOpenState] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState(false);

  const handleImportCsv = (data: CsvUserRow[]) => {
    const usersByEmail = new Map<string, CsvUserRow>();

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

  const handleSubmitToDatabase = form.handleSubmit(
    async ({ users: usersToUpload }) => {
      if (isLoading) return;
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
      await userMutations
        .createMany(usersToUpload)
        .then(applyData)
        .catch((err) => {
          toast.error(
            getApiErrorMessage(err, "L'import des étudiants a échoué."),
          );
        })
        .finally(() => setIsLoading(false));
    },
    showFormErrors,
  );

  const handleAddSelectedUser = (user: CsvUserRow) => {
    setSelectedUsersToUpload([...selectedUsersToUpload, user]);
  };

  const handleAddAllUsers = () => {
    setSelectedUsersToUpload(usersToImport);
  };

  const handleClearAllUsers = () => {
    setSelectedUsersToUpload([]);
  };

  const handleDeleteSelectedUser = (user: CsvUserRow) => {
    setSelectedUsersToUpload(
      selectedUsersToUpload.filter(
        (currentUser) => currentUser.email !== user.email,
      ),
    );
  };

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
