import {
  Copy,
  Eye,
  FilePlus2,
  PanelRightOpen,
  Pencil,
  RefreshCcw,
  ShieldCheck,
  Trash2,
  UsersRound,
} from "lucide-react";
import type { ReactNode } from "react";

import PermissionGuard from "../../../components/guards/PermissionGuard";
import HierarchicalListCard from "../../../components/UI/hierarchical-list-card/HierarchicalListCard";
import type { PermissionTypes, RoleCounts } from "../api/role.api";

type PermissionSummary = {
  type: PermissionTypes;
  label: string;
  count: number;
  icon: ReactNode;
};

type RoleCardProps = {
  role: RoleCounts;
  onEdit: (role: RoleCounts) => void;
  onReset: (role: RoleCounts) => void;
  onDuplicate: (role: RoleCounts) => void;
  onDelete: (role: RoleCounts) => void;
  onViewUsers: (role: RoleCounts) => void;
  onOpenPermissions: (
    role: RoleCounts,
    type: PermissionTypes,
    label: string,
  ) => void;
};

export default function RoleCard({
  role,
  onEdit,
  onReset,
  onDuplicate,
  onDelete,
  onViewUsers,
  onOpenPermissions,
}: RoleCardProps) {
  const summaries: PermissionSummary[] = [
    {
      type: "read",
      label: "Lecture",
      count: role.countRead,
      icon: <Eye className="text-info" strokeWidth={1.7} />,
    },
    {
      type: "write",
      label: "Écriture",
      count: role.countWrite,
      icon: <FilePlus2 className="text-success" strokeWidth={1.7} />,
    },
    {
      type: "update",
      label: "Modification",
      count: role.countUpdate,
      icon: <Pencil className="text-warning" strokeWidth={1.7} />,
    },
    {
      type: "delete",
      label: "Suppression",
      count: role.countDelete,
      icon: <Trash2 className="text-error" strokeWidth={1.7} />,
    },
  ];

  return (
    <HierarchicalListCard
      label="Rôle"
      title={role.label}
      truncateTitle
      labelAccessory={
        role.protection >= 1 ? (
          <span
            data-tip="Rôle protégé"
            className="tooltip tooltip-right mb-0.5"
          >
            <ShieldCheck className="size-3 text-primary" />
          </span>
        ) : undefined
      }
      description={<span className="capitalize">Modèle {role.model}</span>}
      action={
        <div className="flex items-center gap-0.5">
          <PermissionGuard action="read" object="user">
            <button
              type="button"
              className="btn btn-square btn-sm btn-ghost tooltip tooltip-left"
              data-tip="Voir les utilisateurs associés"
              aria-label={`Voir les utilisateurs associés au rôle ${role.label}`}
              onClick={() => onViewUsers(role)}
            >
              <UsersRound className="size-[1.15em]" />
            </button>
          </PermissionGuard>

          <PermissionGuard action="update" object="role">
            <button
              type="button"
              className="btn btn-square btn-sm btn-ghost tooltip tooltip-left"
              data-tip="Modifier les détails"
              aria-label={`Modifier les détails du rôle ${role.label}`}
              onClick={() => onEdit(role)}
            >
              <Pencil className="size-[1.15em]" />
            </button>
          </PermissionGuard>

          <PermissionGuard action="update" object="role">
            <button
              type="button"
              className="btn btn-square btn-sm btn-ghost tooltip tooltip-left"
              data-tip="Réinitialiser les permissions"
              aria-label={`Réinitialiser les permissions du rôle ${role.label}`}
              onClick={() => onReset(role)}
            >
              <RefreshCcw className="size-[1.15em]" />
            </button>
          </PermissionGuard>

          <PermissionGuard action="write" object="role">
            <button
              type="button"
              className="btn btn-square btn-sm btn-ghost tooltip tooltip-left"
              data-tip="Dupliquer"
              aria-label={`Dupliquer le rôle ${role.label}`}
              onClick={() => onDuplicate(role)}
            >
              <Copy className="size-[1.15em]" />
            </button>
          </PermissionGuard>

          {role.protection < 1 ? (
            <PermissionGuard action="delete" object="role">
              <button
                type="button"
                className="btn btn-square btn-sm btn-ghost text-error tooltip tooltip-left"
                data-tip="Supprimer"
                aria-label={`Supprimer le rôle ${role.label}`}
                onClick={() => onDelete(role)}
              >
                <Trash2 className="size-[1.15em]" />
              </button>
            </PermissionGuard>
          ) : null}
        </div>
      }
      items={summaries.map((summary) => ({
        id: summary.type,
        title: summary.label,
        titleAccessory: (
          <span className="badge badge-sm badge-ghost tabular-nums">
            {summary.count}
          </span>
        ),
        icon: summary.icon,
        action: (
          <PanelRightOpen
            className="mr-5 size-4 opacity-0 transition-opacity duration-200 ease-out group-hover/row:opacity-100 group-focus-within/row:opacity-100"
            aria-hidden="true"
          />
        ),
        onClick: () => onOpenPermissions(role, summary.type, summary.label),
        ariaLabel: `Gérer les permissions de ${summary.label.toLowerCase()} du rôle ${role.label}`,
      }))}
      maxItemsShown={4}
      showMore={false}
      hideLastItemDivider
    />
  );
}
