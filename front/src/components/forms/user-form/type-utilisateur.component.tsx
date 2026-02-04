import {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import Wrapper from "../../UI/wrapper/wrapper.component";
import { createSearchParams, Link } from "react-router-dom";
import useHttp from "../../../hooks/use-http";
import Role from "../../../utils/interfaces/role";
import { RefreshCcw } from "lucide-react";

const TypeUtilisateur: FC<{
  roleId: string | null;
  sendEmail: boolean;
  onSetSendEmail: Dispatch<SetStateAction<boolean>>;
  onSetRoleId: Dispatch<SetStateAction<string | null>>;
  editMode?: boolean;
}> = ({ roleId, sendEmail, onSetSendEmail, onSetRoleId, editMode }) => {
  const { sendRequest, isLoading } = useHttp();

  const [roles, setRoles] = useState([]);
  const [showRefreshButton, setShowRefreshButton] = useState(false);

  const handleCheck = (id: string) => {
    onSetRoleId(id);
  };

  const fetchRoles = useCallback(() => {
    sendRequest({ path: "/permission/role" }, (data) => setRoles(data.data));
  }, [sendRequest]);

  const onClickManageRoles = () => {
    setShowRefreshButton(true);
  };

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  return (
    <Wrapper>
      <div className="flex justify-between h-fit items-center">
        <h2 className="font-bold text-xl">Type d'utilisateur</h2>
        <div className="flex gap-2 items-center">
          <Link
            className="btn btn-accent btn-sm normal-case tooltip"
            type="button"
            to={{
              pathname: "/admin/roles",
              search: createSearchParams({
                callback: "true",
              }).toString(),
            }}
            onClick={onClickManageRoles}
            data-tip="Ouverture dans un nouvel onglet"
            target="_blank"
          >
            Gérer les roles
          </Link>
          {showRefreshButton && (
            <button
              type="button"
              data-tip="Rafraichir la liste de roles"
              className="btn btn-ghost btn-sm tooltip"
              onClick={fetchRoles}
            >
              <RefreshCcw width={20} height={20} />
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-y-5">
        {isLoading ? (
          <p>Chargement des roles...</p>
        ) : (
          <div className="flex flex-col justify-between h-full gap-5">
            <div className="flex flex-col gap-y-4 overflow-y-auto">
              {roles.map((role: Role) => (
                <span key={role._id} className="flex gap-x-2">
                  <input
                    key={role._id}
                    name={role.role}
                    type="radio"
                    className="radio radio-primary"
                    onChange={() => handleCheck(role._id)}
                    checked={roleId === role._id}
                  />
                  <label htmlFor="etudiant">{role.label}</label>
                </span>
              ))}
            </div>
            {!editMode ? (
              <>
                <div className="divider" />
                <label
                  className="flex place-items-center gap-x-2"
                  htmlFor="sendEmail"
                >
                  <input
                    className="checkbox checkbox-primary"
                    type="checkbox"
                    name="emailSent"
                    checked={sendEmail}
                    onChange={() => onSetSendEmail((prevState) => !prevState)}
                  />
                  Envoyer un mail d'invitation
                </label>
              </>
            ) : null}
          </div>
        )}
      </div>
    </Wrapper>
  );
};

export default TypeUtilisateur;
