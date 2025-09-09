import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import Wrapper from "../../UI/wrapper/wrapper.component";
import { useLocation, useNavigate } from "react-router-dom";
import useHttp from "../../../hooks/use-http";
import Role from "../../../utils/interfaces/role";

const TypeUtilisateur: FC<{
  roleId: string | null;
  sendEmail: boolean;
  onSetSendEmail: Dispatch<SetStateAction<boolean>>;
  onSetRoleId: Dispatch<SetStateAction<string | null>>;
  editMode?: boolean;
}> = ({ roleId, sendEmail, onSetSendEmail, onSetRoleId, editMode }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { sendRequest, isLoading } = useHttp();
  const [roles, setRoles] = useState([]);

  const handleCheck = (id: string) => {
    onSetRoleId(id);
  };

  useEffect(() => {
    sendRequest({ path: "/permission/role" }, (data) => setRoles(data.data));
  }, [sendRequest]);

  return (
    <Wrapper>
      <div className="flex justify-between">
        <h2 className="font-bold text-xl">Type d'utilisateur</h2>
        <button
          type="button"
          onClick={() =>
            navigate("/admin/roles", { state: { from: pathname } })
          }
        >
          Gérer les roles
        </button>
      </div>

      <div className="flex flex-col gap-y-5 h-[15em]">
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
            ) : null}
          </div>
        )}
      </div>
    </Wrapper>
  );
};

export default TypeUtilisateur;
