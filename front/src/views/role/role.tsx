import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import useHttp from "../../hooks/use-http";
import RolesList from "../../components/role/roles-list/roles-list";
import RoleForm from "../../components/role/role-form/role-form";
import PermissionsList from "../../components/role/permissions-list/permissions-list";

export interface IRoleItem {
  _id: string;
  role: string;
  label: string;
  rank: number;
  isActive: boolean;
  permCount: {
    read: number;
    write: number;
    update: number;
    delete: number;
  };
}

export interface IRoleToEdit {
  _id: string;
  name: string;
  label: string;
  rank: number;
  isActive: boolean;
}

const Role = () => {
  const { state: history } = useLocation();
  const navigate = useNavigate();
  const { sendRequest, isLoading } = useHttp(true);

  const [isRolesInitialized, setIsRolesInitialized] = useState<boolean>(false);

  const [roles, setRoles] = useState<IRoleItem[]>([]);

  const [roleToEdit, setRoleToEdit] = useState<IRoleToEdit | null>(null);

  const [currentRole, setCurrentRole] = useState<IRoleItem>(roles[0]);

  useEffect(() => {
    if (roles.length > 0) {
      setCurrentRole(roles[0]);
      setIsRolesInitialized(true);
    }
    if (!isRolesInitialized) {
      sendRequest({ path: "/permission" }, (data) => setRoles(data.data));
    }
  }, [roles, isRolesInitialized, sendRequest]);

  return (
    <>
      <div className="flex flex-col gap-y-5 p-10">
        {!!history?.from && (
          <button
            onClick={() => navigate(history.from)}
            type="button"
            className="self-start"
          >
            Retour
          </button>
        )}
        <h1 className="text-2xl font-semibold">
          Controler des rôles et des accès
        </h1>
        <p>
          Créer et gérer des rôles, les droits et les permissions des
          utilisateurs
        </p>

        <>
          <div className="grid lg:grid-cols-3 gap-5">
            <RoleForm
              roleToEdit={roleToEdit}
              setRoles={setRoles}
              setRoleToEdit={setRoleToEdit}
              setCurrentRole={setCurrentRole}
            />
            <div className="lg:col-span-2">
              <RolesList
                setRoleToEdit={setRoleToEdit}
                roles={roles}
                isLoading={isLoading}
                setRoles={setRoles}
                setCurrentRole={setCurrentRole}
              />
            </div>
          </div>
          {isRolesInitialized && (
            <PermissionsList
              roles={roles}
              currentRole={currentRole}
              setCurrentRole={setCurrentRole}
            />
          )}
        </>
      </div>
    </>
  );
};

export default Role;
