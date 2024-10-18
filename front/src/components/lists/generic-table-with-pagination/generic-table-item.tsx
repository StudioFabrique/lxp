import { PropsWithChildren, ReactNode } from "react";
import GenericCell from "./generic-cell";
import GenericActionCell from "./generic-action-cell";
import GenericAction from "./interfaces/generic-action";

type ItemProps<TData extends Record<string, unknown>> = {
  id: string;
  data: TData;
  actions?: GenericAction[];
};

const GenericTableItem = <TData extends Record<string, unknown>>(
  props: PropsWithChildren<ItemProps<TData>>,
) => {
  const dataEntries = Object.entries(props.data);

  return (
    <tr>
      {/* add checkbox */}
      {dataEntries.map(([key, value]) => (
        <GenericCell key={key} property={key}>
          {value as ReactNode}
        </GenericCell>
      ))}
      {props.actions?.map((action) => (
        <GenericActionCell key={action.property} {...action} id={props.id} />
      ))}
    </tr>
  );
};

export default GenericTableItem;
