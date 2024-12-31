import { Link, useNavigate, useParams } from "react-router-dom";
import Header from "../../components/UI/header";
import useManagePermissions from "./hooks/use-manage-permissions";
import PermissionsListWithDrawer from "../../components/role/permissions/permissions-list-with-drawer";
import Loader from "../../components/UI/loader";
import toTitleCase from "../../utils/toTitleCase";
import RoleForm from "../../components/role/role-form/role-form";
import { useEffect } from "react";

const RoleEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { permissions, ressources, remainingRessources, role } =
    useManagePermissions(id || "");

  useEffect(() => {
    if (role === null) {
      return navigate(-1);
    }
  }, [role, navigate]);

  if (!role) return <Loader />;

  return (
    <div className="flex flex-col gap-y-5 p-10">
      {/* Header de la liste des rôles */}
      <Header
        title={`Liste des permissions du rôle ${toTitleCase(role.role)} (${toTitleCase(role.label)})`}
      >
        <Link to="/admin/roles" className="btn btn-outline">
          Retour
        </Link>
      </Header>
      <div className="w-[70%]">
        <RoleForm role={role} />
      </div>
      <div className="grid grid-cols-2 gap-10">
        <PermissionsListWithDrawer
          title="Peut lire"
          permissions={permissions?.read}
          ressources={ressources}
        />
        <PermissionsListWithDrawer
          title="Peut écrire"
          permissions={permissions?.update}
          ressources={ressources}
        />
        <PermissionsListWithDrawer
          title="Peut mettre à jour"
          permissions={permissions?.update}
          ressources={ressources}
        />
        <PermissionsListWithDrawer
          title="Peut supprimer"
          permissions={permissions?.delete}
          ressources={ressources}
        />
      </div>
    </div>
  );
};

export default RoleEdit;
