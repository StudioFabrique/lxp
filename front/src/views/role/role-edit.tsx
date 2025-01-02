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
  const {
    permissions,
    remainingResources,
    role,
    onAddPermission,
    onDeletePermission,
  } = useManagePermissions(id || "");

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
      <div className="grid xl:grid-cols-2 gap-10">
        {/* top left */}
        <PermissionsListWithDrawer
          drawerId="drawer-1"
          zIndex={40}
          title="Lecture"
          descriptionTooltip="Permet de consulter et visualiser les ressources sans pouvoir les modifier. Cette permission est fondamentale pour accéder aux informations tout en préservant leur intégrité."
          permissions={permissions?.read}
          remainingResources={remainingResources?.read}
          onAddPermission={onAddPermission}
          onDeletePermission={onDeletePermission}
        />

        {/* top right */}
        <PermissionsListWithDrawer
          drawerId="drawer-2"
          zIndex={30}
          title="Écriture"
          descriptionTooltip="Autorise la création de nouvelles ressources dans le système. Cette permission est essentielle pour contribuer activement au contenu tout en respectant la structure établie."
          permissions={permissions?.write}
          remainingResources={remainingResources?.write}
          onAddPermission={onAddPermission}
          onDeletePermission={onDeletePermission}
        />

        {/* bottom left */}
        <PermissionsListWithDrawer
          drawerId="drawer-3"
          zIndex={20}
          title="Mise à jour"
          descriptionTooltip="Permet de mettre à jour et d'améliorer les ressources existantes. Cette permission est cruciale pour maintenir les informations à jour et corriger les erreurs si nécessaire."
          permissions={permissions?.update}
          remainingResources={remainingResources?.update}
          onAddPermission={onAddPermission}
          onDeletePermission={onDeletePermission}
        />

        {/* bottom right */}
        <PermissionsListWithDrawer
          drawerId="drawer-4"
          zIndex={10}
          title="Suppression"
          descriptionTooltip="Autorise la suppression des ressources du système. Cette permission doit être utilisée avec précaution car elle permet de retirer définitivement des éléments de la base de données."
          permissions={permissions?.delete}
          remainingResources={remainingResources?.delete}
          onAddPermission={onAddPermission}
          onDeletePermission={onDeletePermission}
        />
      </div>
    </div>
  );
};

export default RoleEdit;
