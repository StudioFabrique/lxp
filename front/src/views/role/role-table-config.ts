import { Pen, Trash2 } from "lucide-react";
import { TableListItemConfig } from "../../components/table/table-list/interfaces/table-list-item";
import { SearchBarProps } from "../../components/UI/search-bar/search-bar";
import { TableListActionConfig } from "../../components/table/table-list/interfaces/table-list-action";
import { TableListProps } from "../../components/table/table-list/table-list";

export const roleTableItems: TableListItemConfig[] = [
  {
    property: "label",
    label: "Rôle",
    sortAllowed: false,
  },
  {
    property: "countRead",
    label: "Lire",
    sortAllowed: false,
  },
  { property: "countWrite", label: "Créer", sortAllowed: false },
  { property: "countUpdate", label: "Modifier", sortAllowed: false },
  { property: "countDelete", label: "Supprimer", sortAllowed: false },
];

export const searchBarConfig = (
  onSubmitSearchValue: (value: string) => void,
): SearchBarProps => ({
  title: "",
  placeholder: "Rechercher un rôle",
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
    rbacObject: "role",
    rbacAction: "update",
  },
  {
    property: "delete",
    type: "button",
    tooltip: "Supprimer",
    icon: Trash2,
    additionnalClassname: "btn-ghost text-error",
    request: { path: "/permission/role/[:id]", method: "delete" },
    onSuccessfulSubmit: onRefreshData,
    withConfirmationModal: true,
    modal: {
      title: "Confirmation de suppression",
      description: "Êtes-vous sûr de vouloir supprimer ce rôle ?",
    },
    rbacObject: "role",
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
  data: data as Record<string, string>[],
  tableItemsConfig: roleTableItems,
  actionsItems: actionsConfig,
  style: {
    emptyArrayMessage: {
      message: isLoading
        ? "Chargement des rôles..."
        : isSearching
          ? "Aucun role ne correspond à votre recherche"
          : "Aucun rôle créé",
    },
  },
});
