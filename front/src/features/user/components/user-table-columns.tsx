import { ColumnDef } from "@tanstack/react-table";
import {
  Eye,
  LoaderCircle,
  MailCheck,
  Pencil,
  RotateCw,
  Send,
  Trash2,
} from "lucide-react";
import { Link } from "react-router";
import type User from "../../../utils/interfaces/user";
import PermissionGuard from "../../../components/guards/PermissionGuard";
import UserStatusToggle from "./UserStatusToggle";

export const getUsersColumns = (
  onDelete: (id: string) => void,
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
      return <UserStatusToggle isActive={user.isActive} />;
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
              className="btn btn-ghost btn-xs btn-square text-primary tooltip"
              data-tip="Envoyer une demande de réinitialisation de mot de passe"
            >
              <RotateCw className="w-4 h-4 text-warning" />
            </button>
          ) : user.invitationPending ? (
            // L'envoi est détaché de la création : tant que le serveur SMTP n'a
            // pas remis le message, l'action de renvoi n'a pas lieu d'être
            // proposée. Le libellé reste lisible aux lecteurs d'écran, que
            // `data-tip` seul n'atteindrait pas.
            <span
              className="btn btn-ghost btn-xs btn-square tooltip btn-disabled"
              data-tip="Invitation en cours d'envoi"
              role="status"
              aria-label={`Invitation en cours d'envoi à ${user.firstname} ${user.lastname}`}
            >
              <LoaderCircle className="w-4 h-4 animate-spin text-primary" />
            </span>
          ) : (
            <button
              onClick={() => onSendInvitation(userId)}
              className="btn btn-ghost btn-xs btn-square tooltip"
              data-tip={
                user.invitationSent
                  ? "L'invitation a déjà été envoyée. Cliquez pour renvoyer."
                  : "Envoyer une invitation"
              }
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
              className="btn btn-ghost btn-xs btn-square tooltip"
              data-tip="Modifier"
            >
              <Pencil className="w-4 h-4" />
            </Link>
          </PermissionGuard>
          <PermissionGuard object="user" action="delete">
            <button
              onClick={() => onDelete(userId)}
              className="btn btn-ghost btn-xs btn-square text-error tooltip"
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
  {
    id: "student-data",
    header: "Statistiques",
    cell: ({ row }) => {
      const user = row.original;
      const userId = user._id;
      if (!userId) return null;
      const isStudent = user.roles.some((role) => role.role === "student");

      return (
        isStudent && (
          <div className="flex justify-center gap-2">
            <Link
              to={`/admin/user/data/${userId}`}
              className="btn btn-ghost btn-xs btn-square tooltip"
              data-tip="Consulter"
              // Le lien n'a pour contenu qu'une icône : sans nom accessible,
              // il est annoncé « lien » et rien d'autre. `data-tip` est un
              // attribut de style, il n'est pas restitué aux lecteurs d'écran.
              aria-label={`Consulter les statistiques de ${user.firstname} ${user.lastname}`}
            >
              <Eye className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        )
      );
    },
    enableSorting: false,
  },
];
