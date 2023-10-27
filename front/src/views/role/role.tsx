import { useEffect, useState } from "react";
import useHttp from "../../hooks/use-http";
import RolesList from "../../components/role/roles-list/roles-list";
import RoleForm from "../../components/role/role-form/role-form";
import { Toaster } from "react-hot-toast";
import PermissionsList from "../../components/role/permissions-list/permissions-list";
import { useLocation, useNavigate } from "react-router-dom";

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
    sendRequest({ path: "/permission" }, (data) => setRoles(data.data));
  }, [sendRequest]);

  useEffect(() => {
    if (roles.length > 0 && !isRolesInitialized) {
      setCurrentRole(roles[0]);
      setIsRolesInitialized(true);
    }
  }, [roles, isRolesInitialized]);

  return (
    <>
      <Toaster />
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
        {isLoading ? (
          <p>Chargement des rôles...</p>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-5">
              <RoleForm
                roleToEdit={roleToEdit}
                setRoles={setRoles}
                setRoleToEdit={setRoleToEdit}
                setCurrentRole={setCurrentRole}
              />
              <div className="col-span-2">
                <RolesList
                  setRoleToEdit={setRoleToEdit}
                  roles={roles}
                  setRoles={setRoles}
                />
              </div>
            </div>
            {roles.length > 0 && currentRole && (
              <PermissionsList
                roles={roles}
                currentRole={currentRole}
                setCurrentRole={setCurrentRole}
              />
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Role;
