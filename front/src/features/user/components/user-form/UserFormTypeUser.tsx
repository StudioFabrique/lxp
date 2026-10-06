import { useId, useState } from "react";
import { Link, createSearchParams } from "react-router";
import { RefreshCcw } from "lucide-react";
import type Role from "../../../../utils/interfaces/role";
import BoxWrapper from "../../../../components/wrappers/BoxWrapper";
import RoleRadioCard from "../../../role/components/RoleRadioCard";

type Props = {
  roleId: string | null;
  sendEmail: boolean;
  onSetSendEmail: (v: boolean) => void;
  onSetRoleId: (v: string | null) => void;
  editMode?: boolean;
  disabled?: boolean;
  roles: Role[];
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  onRefresh: () => void;
  studentOnly?: boolean;
  error?: string;
};

const UserFormTypeUser = ({
  roleId,
  sendEmail,
  onSetSendEmail,
  onSetRoleId,
  editMode,
  disabled,
  roles,
  isLoading,
  isFetching,
  isError,
  onRefresh,
  studentOnly,
  error,
}: Props) => {
  const [showRefreshButton, setShowRefreshButton] = useState(false);
  const fieldId = useId();

  return (
    <BoxWrapper>
      <div className="flex flex-wrap justify-between gap-3 h-fit items-center">
        <h2 id={`${fieldId}-label`} className="font-bold text-xl">Type d'utilisateur</h2>
        <div className="flex gap-2 items-center">
          <Link
            className="btn btn-accent btn-sm normal-case tooltip"
            type="button"
            to={{
              pathname: "/admin/roles",
              search: createSearchParams({ callback: "true" }).toString(),
            }}
            onClick={() => setShowRefreshButton(true)}
            data-tip="Ouverture dans un nouvel onglet"
            target="_blank"
          >
            Gérer les rôles
          </Link>
          {showRefreshButton && (
            <button
              type="button"
              data-tip="Rafraîchir la liste des rôles"
              className="btn btn-ghost btn-sm tooltip"
              aria-label="Rafraîchir la liste des rôles"
              disabled={isFetching}
              onClick={onRefresh}
            >
              <RefreshCcw width={20} height={20} />
            </button>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-y-5">
        {studentOnly ? (
          <p className="text-sm text-base-content/70">Seuls les apprenants peuvent être ajoutés au groupe.</p>
        ) : null}
        {isLoading ? (
          <div role="status" aria-label="Chargement des rôles" className="space-y-3">
            <span className="sr-only">Chargement des rôles…</span>
            {[0, 1, 2].map((item) => <div key={item} className="skeleton h-8 w-full" aria-hidden="true" />)}
          </div>
        ) : isError ? (
          <div className="alert alert-error" role="alert">
            <span>Impossible de charger les rôles.</span>
            <button type="button" className="btn btn-sm" onClick={onRefresh} disabled={isFetching}>Réessayer</button>
          </div>
        ) : (
          <div className="flex flex-col justify-between h-full gap-5">
            <div role="radiogroup" aria-labelledby={`${fieldId}-label`} aria-describedby={error ? `${fieldId}-error` : undefined} className="flex flex-col gap-y-3">
              {roles.map((role) => (
                  <RoleRadioCard
                    key={role._id}
                    name={fieldId}
                    value={role._id}
                    rank={role.rank}
                    label={role.label}
                    onChange={() => onSetRoleId(role._id)}
                    checked={roleId === role._id}
                    disabled={disabled}
                    invalid={Boolean(error)}
                    describedBy={error ? `${fieldId}-error` : undefined}
                  />
                ))}
              {roles.length === 0 ? <p className="text-sm text-base-content/70">Aucun rôle disponible. Vérifiez les rôles et vos droits, puis actualisez la liste.</p> : null}
            </div>
            {error ? <p id={`${fieldId}-error`} className="text-sm text-error" role="alert">{error}</p> : null}
            {!editMode && (
              <>
                <div className="divider" />
                <label
                  className="flex place-items-center gap-x-2"
                  htmlFor={`${fieldId}-send-email`}
                  data-recommended-tour="user-invitation"
                >
                  <input
                    id={`${fieldId}-send-email`}
                    className="checkbox checkbox-primary"
                    type="checkbox"
                    name="emailSent"
                    checked={sendEmail}
                    disabled={disabled}
                    onChange={() => onSetSendEmail(!sendEmail)}
                    disabled={disabled}
                  />
                  Envoyer un mail d'invitation
                </label>
              </>
            )}
          </div>
        )}
      </div>
    </BoxWrapper>
  );
};

export default UserFormTypeUser;
