import { Dispatch, FC, SetStateAction, useContext } from "react";
import { IRoleItem, IRoleToEdit } from "../../../views/role/role";
import { sumPropertiesAsNumber } from "../../../utils/object-properties-calculation";
import EditIcon from "../../UI/svg/edit-icon";
import DeleteIcon from "../../UI/svg/delete-icon.component";
import useHttp from "../../../hooks/use-http";
import toast from "react-hot-toast";
import { Context } from "../../../store/context.store";

const RoleItem: FC<{
  role: IRoleItem;
  setRoles: Dispatch<SetStateAction<IRoleItem[]>>;
  setRoleToEdit: Dispatch<SetStateAction<IRoleToEdit | null>>;
  setCurrentRole: Dispatch<SetStateAction<IRoleItem>>;
}> = ({ role, setRoles, setRoleToEdit, setCurrentRole }) => {
  const { defineRulesFor, fetchRoles, user } = useContext(Context);

  const { sendRequest, isLoading } = useHttp(true);

  const handleEditRole = () => {
    setRoleToEdit({
      _id: role._id,
      name: role.role,
      label: role.label,
      rank: role.rank,
      isActive: role.isActive,
    });
    setCurrentRole(role);
  };

  const handleDeleteRole = () => {
    const applyData = () => {
      setRoles((roles) =>
        roles.filter((currentRole) => role.role !== currentRole.role)
      );
      fetchRoles(user!.roles[0]);
      defineRulesFor();
      toast.success("Rôle supprimé avec succès");
    };

    sendRequest(
      { path: `/permission/role/${role.role}`, method: "delete" },
      applyData
    );
  };

  return (
    <tr className="grid grid-cols-10 items-center bg-primary/80 text-primary-content rounded-xl">
      <td className="flex items-center">
        <input
          type="checkbox"
          name="active"
          id="active"
          className="checkbox checkbox-sm checkbox-primary"
        />
      </td>
      <td className="capitalize">
        <div className="relative">
          <span
            data-tip={role.role}
            className="w-10 h-10 tooltip tooltip-bottom absolute"
          />
        </div>
        <div className="truncate">
          <p>{role.role}</p>
        </div>
      </td>
      <td className="col-span-2">{sumPropertiesAsNumber(role.permCount)}</td>
      <td>{role.permCount.write}</td>
      <td>{role.permCount.read}</td>
      <td>{role.permCount.update}</td>
      <td>{role.permCount.delete}</td>
      {role.role !== "admin" && (
        <>
          <td className="flex items-center">
            <input
              type="checkbox"
              name="active"
              id="active"
              checked={role.isActive}
              disabled
              className="toggle toggle-sm toggle-primary disabled:opacity-100 disabled:toggle-primary disabled:cursor-default"
            />
          </td>

          <td className="flex gap-x-2">
            {isLoading ? (
              <span className="h-6 w-6 loading loading-spinner" />
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleEditRole}
                  className="h-6 w-6"
                >
                  <EditIcon />
                </button>
                <button
                  type="button"
                  className="h-6 w-6 stroke-red-600"
                  onClick={handleDeleteRole}
                >
                  <DeleteIcon />
                </button>
              </>
            )}
          </td>
        </>
      )}
    </tr>
  );
};

export default RoleItem;
