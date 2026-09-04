import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  Download,
  EllipsisVertical,
  ExternalLink,
  LoaderCircle,
  Pencil,
  Send,
  Trash2,
} from "lucide-react";
import { Link } from "react-router";

import PermissionGuard from "../../../../components/guards/PermissionGuard";
import RoleRankGuard from "../../../../components/guards/RoleRankGuard";
import type { HierarchicalListMenuControl } from "../../../../components/UI/hierarchical-list-card/HierarchicalListRow";
import type ParcoursSummary from "../../../dashboard-admin/interfaces/parcours-summary";

type ParcoursActionsMenuProps = {
  parcours: ParcoursSummary;
  onDelete: (parcours: ParcoursSummary) => void;
  onExport?: (parcours: ParcoursSummary) => void;
  isExporting?: boolean;
  menuControl?: HierarchicalListMenuControl;
};

const itemBaseClassName =
  "flex w-full cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm outline-none transition-colors";
const itemClassName = `${itemBaseClassName} hover:bg-primary/10 focus:bg-primary/10`;

const ParcoursActionsMenu = ({
  parcours,
  onDelete,
  onExport,
  isExporting = false,
  menuControl,
}: ParcoursActionsMenuProps) => (
  <DropdownMenu.Root
    open={menuControl?.open}
    onOpenChange={menuControl?.onOpenChange}
  >
    <DropdownMenu.Trigger asChild>
      <button
        type="button"
        className="btn btn-square btn-sm btn-ghost self-center"
        aria-label={`Actions pour le parcours ${parcours.title}`}
      >
        <EllipsisVertical className="size-[1.2em]" />
      </button>
    </DropdownMenu.Trigger>

    <DropdownMenu.Portal>
      <DropdownMenu.Content
        align="end"
        sideOffset={6}
        className="z-20 min-w-52 rounded-box border border-base-300 bg-base-100 p-1.5 text-base-content shadow-lg"
      >
        <DropdownMenu.Item asChild>
          <Link
            className={itemClassName}
            to={`/admin/parcours/view/${parcours.id}`}
          >
            <ExternalLink className="size-4" />
            Prévisualiser
          </Link>
        </DropdownMenu.Item>

        {parcours.canManage !== false ? (
          <PermissionGuard action="update" object="parcours">
            <>
              <DropdownMenu.Item asChild>
                <Link
                  className={itemClassName}
                  to={`/admin/parcours/edit/${parcours.id}`}
                >
                  <Pencil className="size-4" />
                  Modifier
                </Link>
              </DropdownMenu.Item>

              {!parcours.isPublished ? (
                <DropdownMenu.Item asChild>
                  <Link
                    className={itemClassName}
                    to={`/admin/parcours/edit/${parcours.id}?step=7`}
                  >
                    <Send className="size-4" />
                    Publier
                  </Link>
                </DropdownMenu.Item>
              ) : null}
            </>
          </PermissionGuard>
        ) : null}

        {onExport ? (
          <RoleRankGuard ranks={[0, 1]}>
            <PermissionGuard action="read" object="parcours">
              <DropdownMenu.Item
                className={itemClassName}
                disabled={isExporting}
                onSelect={() => onExport(parcours)}
              >
                {isExporting ? (
                  <LoaderCircle className="size-4 animate-spin" />
                ) : (
                  <Download className="size-4" />
                )}
                Exporter (.zip)
              </DropdownMenu.Item>
            </PermissionGuard>
          </RoleRankGuard>
        ) : null}

        {parcours.canManage !== false ? (
          <RoleRankGuard ranks={[0, 1]}>
            <PermissionGuard action="delete" object="parcours">
              <DropdownMenu.Separator className="my-1 h-px bg-base-300" />
              <DropdownMenu.Item
                className={`${itemBaseClassName} text-error hover:bg-error/10 focus:bg-error/10`}
                onSelect={() => onDelete(parcours)}
              >
                <Trash2 className="size-4" />
                Supprimer
              </DropdownMenu.Item>
            </PermissionGuard>
          </RoleRankGuard>
        ) : null}
      </DropdownMenu.Content>
    </DropdownMenu.Portal>
  </DropdownMenu.Root>
);

export default ParcoursActionsMenu;
