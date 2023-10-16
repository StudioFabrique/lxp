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
  const { sendRequest } = useHttp();
  const [roles, setRoles] = useState<IRoleItem[]>([]);

  /* const handleCopyItem = (roleName: ) => {

  }; */

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
        <div className="grid grid-cols-3 gap-5">
          <RoleCreateForm setRoles={setRoles} />
          <div className="col-span-2">
            <RolesList roles={roles} setRoles={setRoles} />
          </div>
        </div>
        <PermissionsList roles={roles} />
      </div>
    </>
  );
};

export default Role;
