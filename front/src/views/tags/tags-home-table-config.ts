import { Pen, Trash2 } from "lucide-react";
import { TableListItemConfig } from "../../components/table/table-list/interfaces/table-list-item";
import { SearchBarProps } from "../../components/UI/search-bar/search-bar";
import { TableListActionConfig } from "../../components/table/table-list/interfaces/table-list-action";
import { TableListProps } from "../../components/table/table-list/table-list";

export const tagsHomeTableItems: TableListItemConfig[] = [
  {
    property: "name",
    label: "Nom",
    sortAllowed: true,
  },
  { property: "desc", label: "Description", sortAllowed: true },
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
  title: "Tags",
  placeholder: "Rechercher un tag",
  onSubmitSearchValue: onSubmitSearchValue,
});

export const actionsConfig = (
  onRefreshData: () => Promise<void>,
): TableListActionConfig[] => [
  {
    property: "edit",
    type: "link",
    tooltip: "Modifier",
    icon: Pen,
    additionnalClassname: "btn-ghost",
    request: { path: "edit/[:id]" },
    rbacObject: "tags",
    rbacAction: "update",
  },
  {
    property: "delete",
    type: "button",
    tooltip: "Supprimer",
    icon: Trash2,
    additionnalClassname: "btn-ghost text-error",
    request: { path: "/tags/[:id]", method: "delete" },
    onSuccessfulSubmit: onRefreshData,
    withConfirmationModal: true,
    modal: {
      title: "Confirmation de suppression",
      description: "Êtes-vous sûr de vouloir supprimer ce tag ?",
    },
    rbacObject: "tags",
    rbacAction: "delete",
  },
];

export const tableListConfig = <TData>(
  data: TData,
  isLoading?: boolean,
  isSearching?: boolean,
  actionsConfig?: TableListActionConfig[],
): TableListProps<Record<string, string>> => ({
  idProperty: "_id",
  avatar: { property: "image" },
  data: data as Record<string, string>[],
  tableItemsConfig: tagsHomeTableItems,
  actionsItems: actionsConfig,
  style: {
    showAvatar: true,
    emptyArrayMessage: {
      message: isLoading
        ? "Chargement des tags..."
        : isSearching
          ? "Aucun tag ne correspond à votre recherche"
          : undefined,
      linkableMessage:
        isLoading || isSearching
          ? undefined
          : "Cliquez ici pour créer votre premier tag",
      linkTo: "add",
    },
  },
});
