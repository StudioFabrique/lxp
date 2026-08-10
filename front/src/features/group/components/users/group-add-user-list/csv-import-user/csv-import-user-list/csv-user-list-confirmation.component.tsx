import type { Dispatch, SetStateAction } from "react";
import type User from "../../../../../../../utils/interfaces/user";

type Props = {
  usersFromCsv: User[];
  usersToAdd: User[];
  onConfirmSubmit: () => void;
  setDrawerOpenState: Dispatch<SetStateAction<boolean>>;
  onAddSelectedUser: (user: User) => void;
  onDeleteSelectedUser: (user: User) => void;
  isLoading: boolean;
  onSelectAllUsers: () => void;
  onDeselectAllUsers: () => void;
};

const CsvUserListConfirmation = ({
  usersFromCsv,
  usersToAdd,
  onConfirmSubmit,
  setDrawerOpenState,
  onAddSelectedUser,
  onDeleteSelectedUser,
  isLoading,
  onSelectAllUsers,
  onDeselectAllUsers,
}: Props) => {
  const allSelected =
    usersFromCsv.length > 0 &&
    usersFromCsv.every((user) =>
      usersToAdd.some((selectedUser) => selectedUser.email === user.email),
    );

  if (usersFromCsv.length === 0) {
    return (
      <p className="text-center text-sm text-base-content/70">
        Aucun utilisateur disponible. Vérifiez le fichier d’importation.
      </p>
    );
  }

  return (
    <div className="flex min-h-full flex-col gap-5">
      <label className="flex items-center gap-3 rounded-lg bg-base-100 p-3">
        <input
          type="checkbox"
          checked={allSelected}
          onChange={(event) =>
            event.currentTarget.checked
              ? onSelectAllUsers()
              : onDeselectAllUsers()
          }
          className="checkbox checkbox-sm checkbox-primary"
        />
        Tout sélectionner
      </label>

      <div className="flex flex-col gap-2">
        {usersFromCsv.map((user) => {
          const isSelected = usersToAdd.some(
            (selectedUser) => selectedUser.email === user.email,
          );
          return (
            <label
              key={user.email}
              className="flex items-center gap-3 rounded-lg bg-base-100 p-4"
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={(event) =>
                  event.currentTarget.checked
                    ? onAddSelectedUser(user)
                    : onDeleteSelectedUser(user)
                }
                className="checkbox checkbox-sm checkbox-primary"
              />
              <span className="capitalize">
                {user.firstname} {user.lastname}
              </span>
              <span className="ml-auto text-sm text-base-content/65">
                {user.email}
              </span>
            </label>
          );
        })}
      </div>

      <div className="mt-auto flex justify-end gap-2 border-t border-base-300 pt-4">
        <button
          type="button"
          className="btn btn-outline"
          onClick={() => setDrawerOpenState(false)}
        >
          Annuler
        </button>
        <button
          type="button"
          className="btn btn-primary"
          disabled={isLoading || usersToAdd.length === 0}
          onClick={onConfirmSubmit}
        >
          {isLoading ? "Création…" : "Confirmer la création"}
        </button>
      </div>
    </div>
  );
};

export default CsvUserListConfirmation;
