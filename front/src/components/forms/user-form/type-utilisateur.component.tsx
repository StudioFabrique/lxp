import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import Wrapper from "../../UI/wrapper/wrapper.component";
import { useLocation, useNavigate } from "react-router-dom";
import useHttp from "../../../hooks/use-http";

const TypeUtilisateur: FC<{
  roleId: string | null;
  onSetRoleId: Dispatch<SetStateAction<string | null>>;
}> = ({ roleId, onSetRoleId }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const { sendRequest, isLoading } = useHttp();

  const [roles, setRoles] = useState([]);

  const handleCheck = (id: string) => {
    onSetRoleId(id);
  };

  useEffect(() => {
    sendRequest({ path: "/permission" }, (data) => setRoles(data.data));
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

      <div className="flex flex-col gap-y-5 h-[15em] overflow-y-auto">
        {isLoading ? (
          <p>Chargement des roles...</p>
        ) : (
          roles.map((role: any) => (
            <span key={role._id} className="flex gap-x-2">
              <input
                key={role._id}
                name={role.role}
                type="checkbox"
                className="checkbox checkbox-primary rounded-full"
                onChange={() => handleCheck(role._id)}
                checked={roleId === role._id}
              />
              <label htmlFor="etudiant">{role.label}</label>
            </span>
          ))
        )}
      </div>
    </Wrapper>
  );
};

export default TypeUtilisateur;
