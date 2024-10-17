import { PropsWithChildren, ReactNode } from "react";
import GenericCell from "./generic-cell";
import GenericActionCell from "./generic-action-cell";
import GenericAction from "./interfaces/generic-action";

type ItemProps<TData extends ArrayLike<string>> = {
  data: TData;
  actions: GenericAction[];
};

const GenericItem = <TData extends ArrayLike<string>>(
  props: PropsWithChildren<ItemProps<TData>>,
) => {
  const dataEntries = Object.entries(props.data);

  return (
    <tr>
      {dataEntries.map(([key, value]) => (
        <GenericCell key={key} property={key}>
          {value as ReactNode}
        </GenericCell>
      ))}
      {props.actions.map((action) => (
        <GenericActionCell {...action} />
      ))}
    </tr>
  );
};

export default GenericItem;
