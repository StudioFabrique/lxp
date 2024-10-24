import EllipsisIcon from "../svg/ellipsis-icon";

interface ActionsDropdownItem<FuncDataT = void> {
  actionTitle: string;
  data: FuncDataT;
  onClick: (data: FuncDataT) => void;
}

type ActionsDropdownProps<FuncDataT = void> = {
  actions: ActionsDropdownItem<FuncDataT>[];
  isLoading?: boolean;
};

const ActionsDropdown = <FuncDataT,>(
  props: ActionsDropdownProps<FuncDataT>,
) => {
  const handleClick = (onClick: (data: FuncDataT) => void, data: FuncDataT) => {
    onClick(data);
  };

  return (
    <div className="dropdown dropdown-end">
      <div
        tabIndex={0}
        role="button"
        className="flex items-center btn btn-sm btn-ghost disabled:bg-transparent"
      >
        <EllipsisIcon />
      </div>
      <ul
        tabIndex={0}
        className="menu dropdown-content bg-base-100 rounded-box z-[1] p-2 m-2 shadow w-max whitespace-nowrap"
      >
        {props.actions.map((act) => (
          <li key={act.actionTitle}>
            <button
              disabled={props.isLoading}
              onClick={() => handleClick(act.onClick, act.data)}
            >
              {act.actionTitle}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActionsDropdown;
