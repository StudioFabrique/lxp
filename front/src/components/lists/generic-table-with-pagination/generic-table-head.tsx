import { GenericItemConfig } from "./interfaces/generic-item";

type TableHeadProps = { items: GenericItemConfig[] };

const GenericTableHead = (props: TableHeadProps) => {
  return (
    <thead>
      {props.items.map((item) => (
        <th key={item.property}>{item.label ?? ""}</th>
      ))}
    </thead>
  );
};

export default GenericTableHead;
