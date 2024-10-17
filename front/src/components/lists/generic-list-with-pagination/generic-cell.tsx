import { PropsWithChildren } from "react";

type CellProps = {
  property: string;
};

const GenericCell = (props: PropsWithChildren<CellProps>) => {
  return <td>{props.children}</td>;
};

export default GenericCell;
