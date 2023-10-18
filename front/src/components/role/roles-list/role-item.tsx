import { Dispatch, FC, SetStateAction, useEffect } from "react";
import { IRoleItem } from "../../../views/role/role";
import { sumPropertiesAsNumber } from "../../../utils/object-properties-calculation";
import EditIcon from "../../UI/svg/edit-icon";
import DeleteIcon from "../../UI/svg/delete-icon.component";
import useHttp from "../../../hooks/use-http";
import toast from "react-hot-toast";

const RoleItem: FC<{
  role: IRoleItem;
  setRoles: Dispatch<SetStateAction<IRoleItem[]>>;
  setRoleToEdit: Dispatch<
    SetStateAction<{
      _id: string;
      name: string;
    } | null>
  >;
}> = ({ role, setRoles, setRoleToEdit }) => {
  const { sendRequest, isLoading, error } = useHttp();

  const handleEditRole = () => {
    setRoleToEdit({ _id: role._id, name: role.role });
  };

  const handleDeleteRole = () => {
    const applyData = (data: any) => {
      setRoles((roles) =>
        roles.filter((currentRole) => role.role !== currentRole.role)
      );
      toast.success("Rôle supprimé avec succès");
    };

    sendRequest(
      { path: `/permission/role/${role.role}`, method: "delete" },
      applyData
    );
  };

  useEffect(() => {
    if (error) toast.error("Erreur de requête");
  }, [error]);

  return (
    <tr className="grid grid-cols-10 items-center bg-secondary rounded-xl">
      <td className="flex items-center">
        <input
          type="checkbox"
          name="active"
          id="active"
          className="checkbox checkbox-sm checkbox-primary"
        />
      </td>
      <td className="capitalize overflow-clip">{role.role}</td>
      <td className="col-span-2">{sumPropertiesAsNumber(role.permCount)}</td>
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

      <td className="flex gap-x-2">
        {isLoading ? (
          <span className="h-6 w-6 loading loading-spinner" />
        ) : (
          <>
            <button type="button" onClick={handleEditRole} className="h-6 w-6">
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
    </tr>
  );
};

export default RoleItem;
