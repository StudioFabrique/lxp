import {
  ChangeEvent,
  ChangeEventHandler,
  Dispatch,
  FC,
  SetStateAction,
} from "react";
import { IRoleItem } from "../../../views/role/role";

const RoleSelector: FC<{
  roles: IRoleItem[];
  currentRole: IRoleItem;
  onSetCurrentRole: Dispatch<SetStateAction<IRoleItem>>;
}> = ({ roles, currentRole, onSetCurrentRole }) => {
  const handleSelect: ChangeEventHandler<HTMLSelectElement> = (
    e: ChangeEvent<HTMLSelectElement>,
  ) => {
    const newRole = roles.find((role) => e.currentTarget.value === role.role);
    onSetCurrentRole((previousRole) => newRole ?? previousRole);
  };

  return (
    <select
      className="select select-bordered select-sm w-48 focus:outline-none focus:border-primary"
      name="menu"
      id="menu"
      value={currentRole?.role}
      onChange={handleSelect}
    >
      {roles &&
        roles.map((item) => (
          <option
            className="capitalize text-base-content"
            key={item._id}
            value={item.role}
          >
            {item.role}
          </option>
        ))}
    </select>
  );
};

export default RoleSelector;
