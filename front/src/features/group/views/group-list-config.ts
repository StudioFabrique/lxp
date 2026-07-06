import { Edit, Trash2 } from "lucide-react";
import { TableListItemConfig } from "../../../components/table/table-list/interfaces/table-list-item";
import { SearchBarProps } from "../../../../src.legacy/components/UI/search-bar/search-bar";
import { TableListActionConfig } from "../../../components/table/table-list/interfaces/table-list-action";
import { TableListProps } from "../../../components/table/table-list/table-list";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { PaginatedResponse } from "../../../components/table/table.api";

export const groupHomeTableItems: TableListItemConfig[] = [
  {
    property: "name",
    label: "Nom",
    sortAllowed: true,
  },
  // { property: "desc", label: "Description", sortAllowed: true },
  {
    property: "formation",
    label: "Formation - Parcours",
    valueAsLink: {
      identifier: "parcoursId",
      link: "/admin/parcours/view/[:id]",
    },
  },
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
  onRefreshData: (
    options?: RefetchOptions | undefined,
  ) => Promise<QueryObserverResult<NoInfer<PaginatedResponse<unknown>>, Error>>,
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
    icon: Edit,
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
    modal: {
      title: "Confirmation de suppression",
      description: "Êtes-vous sûr de vouloir supprimer ce groupe ?",
    },
    rbacObject: "group",
    rbacAction: "delete",
  },
];

export const groupListConfig = <TData>(
  data: TData,
  isLoading?: boolean,
  isSearching?: boolean,
  actionsConfig?: TableListActionConfig[],
): TableListProps<Record<string, string>> => ({
  idProperty: "_id",
  avatar: { property: "image" },
  data: data as Record<string, string>[],
  tableItemsConfig: groupHomeTableItems,
  actionsItems: actionsConfig,
  style: {
    showAvatar: true,
    emptyArrayMessage: {
      message: isLoading
        ? "Chargement des groupes..."
        : isSearching
          ? "Aucun groupe ne correspond à votre recherche"
          : undefined,
      linkableMessage:
        isLoading || isSearching
          ? undefined
          : "Cliquez ici pour créer votre premier groupe",
      linkTo: "add",
    },
  },
});
