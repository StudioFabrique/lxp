import { Fragment } from "react/jsx-runtime";
import { TableListItemLabels } from "./interfaces/table-list-item";

type TableListHeadProps = {
  labels: TableListItemLabels[];
  style?: { showCheckbox?: boolean; showAvatar?: boolean };
};

const TableListHead = (props: TableListHeadProps) => {
  return (
    <thead>
      <tr>
        <th />

        {/* La cellule header pour contenir la checkbox */}
        {props.style?.showCheckbox ? (
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
        {props.style?.showAvatar ? <th /> : null}

        {/* Les cellules header pour contenir les labels des propriétés  */}
        {props.labels.map((item) =>
          !item.isAction ? (
            <th key={item.property} className="text-base-content font-bold">
              <Fragment>{item.label ?? ""}</Fragment>
            </th>
          ) : null,
        )}

        {/* Les cellules header pour contenir les labels des actions  */}
        <th className="text-base-content font-bold flex items-center justify-end px-0 gap-x-2">
          {props.labels.map((item) =>
            item.isAction ? (
              <div
                className="w-10 flex justify-center items-center"
                key={item.property}
              >
                {item.label ?? ""}
              </div>
            ) : null,
          )}
        </th>

        <th className="px-0" />
      </tr>
    </thead>
  );
};

export default TableListHead;
