import { Link } from "react-router";

export type TableEmptyProps = {
  message?: string;
  linkableMessage?: string;
  linkTo?: string;
};

const TableEmpty = (props: TableEmptyProps) => (
  <div className="flex flex-col gap-5 items-center py-10 text-sm">
    {props.message ? <p className="text-secondary">{props.message}</p> : null}
    {props.linkTo && props.linkableMessage ? (
      <Link
        className="text-base-content underline hover:text-primary"
        to={props.linkTo}
      >
        {props.linkableMessage}
      </Link>
    ) : null}
  </div>
);

export default TableEmpty;
