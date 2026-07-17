import { ColumnDef } from "@tanstack/react-table";
import { Edit, MailCheck, RotateCw, Send, Trash2 } from "lucide-react";
import { Link } from "react-router";
import type User from "../../../utils/interfaces/user";
import PermissionGuard from "../../../components/guards/PermissionGuard";
import UserStatusToggle from "./UserStatusToggle";
import { cn } from "../../../utils/cn";

export const getUsersColumns = (
  onDelete: (id: string) => void,
  onToggleStatus: (id: string, isActive: boolean) => void,
  onSendInvitation: (id: string) => void,
  onSendResetPassword: (id: string) => void,
): ColumnDef<User>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <input
        type="checkbox"
        className="checkbox checkbox-sm checkbox-primary"
        checked={table.getIsAllPageRowsSelected()}
        onChange={table.getToggleAllPageRowsSelectedHandler()}
      />
    ),
    cell: ({ row }) => (
      <input
        type="checkbox"
        className="checkbox checkbox-sm checkbox-primary"
        checked={row.getIsSelected()}
        onChange={row.getToggleSelectedHandler()}
      />
    ),
    enableSorting: false,
  },
  {
    accessorKey: "firstname",
    header: "Prénom",
    cell: (info) => (
      <span className="capitalize">{info.getValue() as string}</span>
    ),
  },
  {
    accessorKey: "lastname",
    header: "Nom",
    cell: (info) => (
      <span className="capitalize">{info.getValue() as string}</span>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: (info) => {
      const email = info.getValue() as string;
      return (
        <span className="tooltip tooltip-bottom" data-tip={email}>
          {email.length > 20 ? `${email.slice(0, 20)}...` : email}
        </span>
      );
    },
  },
  {
    accessorKey: "formation",
    header: "Formation",
    cell: (info) => {
      const value = info.getValue() as string | undefined;
      return <span>{value ?? "ND"}</span>;
    },
  },
  {
    accessorKey: "parcours",
    header: "Promotion",
    cell: (info) => {
      const value = info.getValue() as string | undefined;
      return <span>{value ?? "ND"}</span>;
    },
  },
  {
    id: "roles",
    header: "Rôle(s)",
    cell: ({ row }) => {
      const roles = row.original.roles;
      const label = roles
        .filter((r) => !r.role.startsWith("interface"))
        .map((r) => r.label)
        .join(", ");
      return (
        <span className="tooltip tooltip-bottom" data-tip={label}>
          {label || "ND"}
        </span>
      );
    },
    enableSorting: false,
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <UserStatusToggle
          isActive={user.isActive}
          onToggle={() => onToggleStatus(user._id, user.isActive)}
        />
      );
    },
    enableSorting: false,
  },
  {
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => {
      const user = row.original;
      const userId = user._id;
      if (!userId) return null;
      return (
        <div className="flex gap-2 justify-center items-center">
          {user.isActive ? (
            <button
              onClick={() => onSendResetPassword(userId)}
              className="btn btn-ghost btn-xs tooltip"
              data-tip="Envoyer une demande de réinitialisation de mot de passe"
            >
              <RotateCw className="w-4 h-4 text-warning" />
            </button>
          ) : (
            <button
              onClick={() => onSendInvitation(userId)}
              className={cn("btn btn-ghost btn-sm text-primary", {
                "text-success btn-disabled": user.invitationSent,
                tooltip: !user.invitationSent,
              })}
              data-tip="Envoyer une invitation"
            >
              {user.invitationSent ? (
                <MailCheck className="w-4 h-4 text-success" />
              ) : (
                <Send className="w-4 h-4 text-primary" />
              )}
            </button>
          )}
          <PermissionGuard object="user" action="update">
            <Link
              to={`/admin/user/edit/${userId}`}
              className="btn btn-ghost btn-xs tooltip"
              data-tip="Modifier"
            >
              <Edit className="w-4 h-4" />
            </Link>
          </PermissionGuard>
          <PermissionGuard object="user" action="delete">
            <button
              onClick={() => onDelete(userId)}
              className="btn btn-ghost btn-xs text-error tooltip"
              data-tip="Supprimer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </PermissionGuard>
        </div>
      );
    },
    enableSorting: false,
  },
];
