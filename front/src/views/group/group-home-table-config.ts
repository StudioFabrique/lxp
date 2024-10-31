import { Pen, Trash2 } from "lucide-react";
import { TableListItemConfig } from "../../components/table/table-list/interfaces/table-list-item";
import { SearchBarProps } from "../../components/UI/search-bar/search-bar";
import { TableListActionConfig } from "../../components/table/table-list/interfaces/table-list-action";
import { TableListProps } from "../../components/table/table-list/table-list";

export const groupHomeTableItems: TableListItemConfig[] = [
  { property: "name", label: "Nom", sortAllowed: true },
  { property: "desc", label: "Description", sortAllowed: true },
  { property: "formation", label: "Formation - Parcours" },
  { property: "nbStudents", label: "Nombre d'étudiants" },
];

export const searchBarConfig = (
  onSubmitSearchValue: (value: string) => void,
): SearchBarProps => ({
  title: "Groupes",
  placeholder: "Rechercher un groupe",
  onSubmitSearchValue: onSubmitSearchValue,
});

export const actionsConfig = (
  onRefreshData: () => Promise<void>,
): TableListActionConfig[] => [
  /*{
    property: "invite",
    additionnalClassname: "btn-success",
    label: "Inviter les utilisateurs",
    title: "Inviter",
    type: "button",
    request: { path: "/group/invite/[:id]", method: "post" },
    onSuccessfulSubmit: onRefreshData,
  },*/
  {
    property: "edit",
    type: "link",
    tooltip: "Modifier",
    icon: Pen,
    additionnalClassname: "btn-ghost",
    request: { path: "edit/[:id]" },
    rbacObject: "group",
    rbacAction: "update",
  },
  {
    property: "delete",
    type: "button",
    tooltip: "Supprimer",
    icon: Trash2,
    additionnalClassname: "btn-ghost text-error",
    request: { path: "/group/[:id]", method: "delete" },
    onSuccessfulSubmit: onRefreshData,
    withConfirmationModal: true,
    rbacObject: "group",
    rbacAction: "delete",
  },
];

export const listConfig = <TData>(
  data: TData,
  isLoading?: boolean,
  actionsConfig?: TableListActionConfig[],
): TableListProps<Record<string, string>> => ({
  idProperty: "_id",
  avatar: { property: "image" },
  data: data as unknown as Record<string, string>[],
  tableItemsConfig: groupHomeTableItems,
  actionsItems: actionsConfig,
  style: {
    showAvatar: true,
    emptyArrayMessage: isLoading
      ? "Chargement des groupes..."
      : "Aucun groupe disponible",
  },
});
