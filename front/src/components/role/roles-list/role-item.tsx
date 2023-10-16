import { Dispatch, FC, SetStateAction } from "react";
import { IRoleItem } from "../../../views/role/role";
import { sumPropertiesAsNumber } from "../../../utils/object-properties-calculation";

const RoleItem: FC<{
  role: IRoleItem;
  setRoles: Dispatch<SetStateAction<IRoleItem[]>>;
}> = ({ role, setRoles }) => {
  return (
    <tr>
      <td className="flex items-center">
        <input
          type="checkbox"
          name="active"
          id="active"
          className="checkbox checkbox-sm checkbox-primary"
        />
      </td>
      <td>{role.role}</td>
      <td>{sumPropertiesAsNumber(role.permCount)}</td>
      <td>{role.permCount.write}</td>
      <td>{role.permCount.read}</td>
      <td>{role.permCount.update}</td>
      <td>{role.permCount.delete}</td>
      <td className="flex items-center">
        <input
          type="checkbox"
          name="active"
          id="active"
          className="toggle toggle-sm toggle-primary"
        />
      </td>
      <td></td>
    </tr>
  );
};

export default RoleItem;
