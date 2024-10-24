import { Fragment } from "react/jsx-runtime";
import {
  TableListItemConfig,
  TableListItemLabels,
} from "./interfaces/table-list-item";

type TableListHeadProps = {
  labels: TableListItemLabels[];
  avatar?: TableListItemConfig;
  showCheckbox?: boolean;
  showAvatar?: boolean;
};

const TableListHead = (props: TableListHeadProps) => {
  return (
    <thead className="w-full">
      <tr>
        <th className="p-0 w-0" />

        {/* La cellule header pour contenir la checkbox */}
        {props.showCheckbox ? (
          <th className="pl-0 w-0">
            <div className="flex items-center">
              <input
                type="checkbox"
                className="checkbox checkbox-sm checkbox-primary"
              />
            </div>
          </th>
        ) : null}

        {/* La cellule header vide pour contenir l'avatar */}
        {props.showAvatar ? (
          <th className="flex justify-center items-center">
            {props.avatar?.label}
          </th>
        ) : null}

        {/* Les cellules header pour contenir les labels des propriétés  */}
        {props.labels.map((item) =>
          !item.isAction ? (
            <th key={item.property} className="text-base-content font-bold">
              <Fragment>{item.label ?? ""}</Fragment>
            </th>
          ) : null,
        )}

        {/* Les cellules header pour contenir les labels des actions  */}

        {props.labels.map((item) =>
          item.isAction ? (
            <th className="text-base-content font-bold">
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
