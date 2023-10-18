import { useEffect, useState } from "react";
import useHttp from "../../hooks/use-http";
import RolesList from "../../components/role/roles-list/roles-list";
import RoleCreateForm from "../../components/role/role-form/role-form";
import { Toaster } from "react-hot-toast";
import PermissionsList from "../../components/role/permissions-list/permissions-list";

export interface IRoleItem {
  _id: string;
  role: string;
  permCount: {
    read: number;
    write: number;
    update: number;
    delete: number;
  };
}

const Role = () => {
  const { sendRequest, isLoading } = useHttp();

  const [roles, setRoles] = useState<IRoleItem[]>([]);

  const [roleToEdit, setRoleToEdit] = useState<{
    _id: string;
    name: string;
  } | null>(null);

  useEffect(() => {
    sendRequest({ path: "/permission" }, (data) => setRoles(data.data));
  }, [sendRequest]);

  return (
    <>
      <Toaster />
      <div className="flex flex-col gap-y-5 p-10">
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
              <RoleCreateForm
                roleToEdit={roleToEdit}
                setRoles={setRoles}
                setRoleToEdit={setRoleToEdit}
              />
              <div className="col-span-2">
                <RolesList
                  setRoleToEdit={setRoleToEdit}
                  roles={roles}
                  setRoles={setRoles}
                />
              </div>
            </div>
            {roles.length > 0 && <PermissionsList roles={roles} />}
          </>
        )}
      </div>
    </>
  );
};

export default Role;
