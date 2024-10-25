import { Fragment } from "react/jsx-runtime";
import {
  TableListItemConfig,
  TableListItemLabels,
} from "./interfaces/table-list-item";
import { ChangeEvent } from "react";

type TableListHeadProps = {
  labels: TableListItemLabels[];
  avatar?: TableListItemConfig;
  showAvatar?: boolean;
  isAllChecked?: boolean;
  onCheckAll?: (checked: boolean) => void;
};

/**
 * Composant représentant l'en-tête d'une table de données listant des éléments.
 * @param props.labels - Labels à afficher pour chaque colonne
 * @param props.avatar - Configuration de l'avatar (optionnel)
 * @param props.showCheckbox - Afficher une checkbox (optionnel)
 * @param props.showAvatar - Afficher un avatar (optionnel)

 * @component
 */
const TableListHead = (props: TableListHeadProps) => {
  const handleChangeCheckbox = (event: ChangeEvent<HTMLInputElement>) => {
    props.onCheckAll && props.onCheckAll(event.currentTarget.checked);
  };

  return (
    <thead className="w-full">
      <tr>
        <th className="p-0 w-0" />

        {/* La cellule header pour contenir la checkbox */}
        {props.onCheckAll ? (
          <th className="pl-0 w-0">
            <div className="flex items-center">
              <input
                type="checkbox"
                className="checkbox checkbox-sm checkbox-primary"
                checked={props.isAllChecked}
                onChange={handleChangeCheckbox}
              />
            </div>
          </th>
        ) : null}

        {/* La cellule header vide pour contenir l'avatar */}
        {props.showAvatar ? (
          <th className="text-base-content text-center">
            {props.avatar?.label}
          </th>
        ) : null}

        {/* Les cellules header pour contenir les labels des propriétés  */}
        {props.labels.map((item) =>
          !item.isAction ? (
            <th key={item.property} className="text-base-content">
              <Fragment>{item.label ?? ""}</Fragment>
            </th>
          ) : null,
        )}

        {/* Les cellules header pour contenir les labels des actions  */}

        {props.labels.map((item) =>
          item.isAction ? (
            <th key={item.property} className="text-base-content">
              <div
                className="flex justify-center items-center"
                key={item.property}
              >
                {item.label ?? ""}
              </div>
            </th>
          ) : null,
        )}

        <th className="px-0" />
      </tr>
    </thead>
  );
};

export default TableListHead;
