import { Link, useNavigate, useParams } from "react-router";
import { TimerReset } from "lucide-react";

import useRoleEdit from "../hooks/useRoleEdit";
import PermissionsPanel from "../components/permissions/PermissionsPanel";
import RoleForm from "../components/role-form/RoleForm";

import PageHeader from "../../../components/headers/PageHeader";
import Loader from "../../../../src.legacy/components/UI/loader";
import QuestionMarkTooltip from "../../../../src.legacy/components/UI/question-mark-tooltip/question-mark-tooltip";

const toTitleCase = (str: string) =>
  str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase());

const RoleEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const {
    permissions,
    remainingResources,
    role,
    isLoading,
    onAddPermission,
    onDeletePermission,
    onResetPermissions,
  } = useRoleEdit(id || "");

  if (isLoading || !role) return <Loader />;

  return (
    <div className="w-full flex flex-col gap-6">
      <PageHeader
        title={`Modification du rôle ${toTitleCase(role.label)}`}
        description="Modifiez les détails du rôle ci-dessous"
      >
        <Link to="/admin/roles" className="btn btn-outline">
          Retour
        </Link>
      </PageHeader>

      <RoleForm role={role} />

      <div className="h-2" />

      <h3 className="font-semibold text-2xl ml-2">
        Liste des permission du rôle
        <span className="capitalize font-bold"> {role.label} </span>
      </h3>

      <div className="grid xl:grid-cols-2 gap-10">
        <PermissionsPanel
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

        <PermissionsPanel
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

        <PermissionsPanel
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

        <PermissionsPanel
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
        <div className="flex gap-2 items-center">
          {role.protection >= 1 && (
            <>
              <button
                className="btn btn-sm btn-accent w-fit"
                onClick={onResetPermissions}
              >
                <TimerReset className="w-4" />
                Réinitialiser toutes les permissions pour ce rôle
              </button>
              <QuestionMarkTooltip tooltipValue="Lorsque de nouvelles permissions ont été ajoutées ou que des permissions sont manquantes pour ce rôle système, ce bouton permet d'ajouter ces permissions manquantes." />
            </>
          )}
        </div>
        <button
          type="button"
          className="btn btn-primary text-base-100"
          onClick={() => navigate(-1)}
        >
          Valider
        </button>
      </span>
    </div>
  );
};

export default RoleEdit;
