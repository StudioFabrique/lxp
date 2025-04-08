import { Edit, Trash2 } from "lucide-react";
import { TableListItemConfig } from "../../components/table/table-list/interfaces/table-list-item";
import { SearchBarProps } from "../../components/UI/search-bar/search-bar";
import { TableListActionConfig } from "../../components/table/table-list/interfaces/table-list-action";
import { TableListProps } from "../../components/table/table-list/table-list";
import WrappedParcoursCell from "./custom-cell-components/wrapped-parcours-cell";
import { ComponentType } from "react";

type DataType = "text" | "list";

export const tagsHomeTableItems: TableListItemConfig<DataType>[] = [
  {
    property: "name",
    label: "Titre",
    sortAllowed: true,
  },
  {
    property: "totalUses",
    label: "No. d'utilisation",
    sortAllowed: false,
  },
  {
    property: "parcours",
    type: "list",
    label: "Parcours",
    sortAllowed: false,
  },
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
    icon: Edit,
    additionnalClassname: "btn-ghost",
    request: { path: ".?openModal=true&editId=[:id]" },
    rbacObject: "tag",
    rbacAction: "update",
  },
  {
    property: "delete",
    type: "button",
    tooltip: "Supprimer",
    icon: Trash2,
    additionnalClassname: "btn-ghost text-error",
    request: { path: "/tag/deleteSingle/[:id]", method: "delete" },
    onSuccessfulSubmit: onRefreshData,
    withConfirmationModal: true,
    modal: {
      title: "Confirmation de suppression",
      description: "Êtes-vous sûr de vouloir supprimer ce tag ?",
    },
    rbacObject: "tag",
    rbacAction: "delete",
  },
];

export const tableListConfig = <TData>(
  data: TData,
  isLoading?: boolean,
  isSearching?: boolean,
  actionsConfig?: TableListActionConfig[],
): TableListProps<Record<string, string>> => ({
  idProperty: "id",
  avatar: { property: "image" },
  data: data as Record<string, string>[],
  tableItemsConfig: tagsHomeTableItems,
  actionsItems: actionsConfig,
  style: {
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
      linkTo: "?openModal=true",
    },
  },
  customCellComponents: [
    {
      type: "list",
      component: WrappedParcoursCell as ComponentType<{ data: unknown }>,
    },
  ],
});
