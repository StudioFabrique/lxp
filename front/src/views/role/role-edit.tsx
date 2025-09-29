import { Link, useNavigate, useParams } from "react-router-dom";
import Header from "../../components/UI/header";
import useManagePermissions from "./hooks/use-manage-permissions";
import PermissionsListWithDrawer from "../../components/role/permissions/permissions-list-with-drawer";
import Loader from "../../components/UI/loader";
import toTitleCase from "../../utils/toTitleCase";
import RoleForm from "../../components/role/role-form/role-form";
import { useEffect } from "react";
import { ListRestartIcon } from "lucide-react";
import ViewWrapper from "../../components/UI/wrapper/view-wrapper";

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

  const onClickPreviousPage = () => {
    navigate(-1);
  };

  useEffect(() => {
    if (role === null) {
      return navigate(-1);
    }
  }, [role, navigate]);

  if (!role) return <Loader />;

  return (
    <ViewWrapper className="flex flex-col gap-6">
      {/* Header de la liste des rôles */}
      <Header
        title={`Modification du rôle ${toTitleCase(role.label)}`}
        description="Modifiez les détails du rôle ci-dessous"
      >
        <Link to="/admin/roles" className="btn btn-outline">
          Retour
        </Link>
      </Header>
      <RoleForm role={role} />
      <div className="h-2" />
      <h3 className="font-semibold text-2xl ml-2">
        Liste des permission du rôle
        <span className="capitalize font-bold"> {role.label} </span>
      </h3>
      <div className="grid xl:grid-cols-2 gap-10">
        {/* top left */}
        <PermissionsListWithDrawer
          drawerId="drawer-1"
          zIndex={40}
          title="Lecture"
          descriptionTooltip="Permet de consulter et visualiser les ressources sans pouvoir les modifier. Cette permission est fondamentale pour accéder aux informations tout en préservant leur intégrité."
          permissions={permissions?.read}
          remainingResources={remainingResources?.read}
          roleProtection={role.protection}
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
          roleProtection={role.protection}
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
          roleProtection={role.protection}
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
          roleProtection={role.protection}
          onAddPermission={onAddPermission}
          onDeletePermission={onDeletePermission}
        />
      </div>
      <span className="flex justify-between w-full">
        <button className="btn btn-primary w-fit btn-sm" disabled>
          <ListRestartIcon />
          Réinitialiser toutes les permissions pour ce rôle
        </button>
        <button
          type="button"
          className="btn btn-primary text-base-100"
          onClick={onClickPreviousPage}
        >
          Valider
        </button>
      </span>
    </ViewWrapper>
  );
};

export default RoleEdit;
