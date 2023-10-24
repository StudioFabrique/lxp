import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { regexGeneric } from "../../../utils/constantes";
import { setInputStyle, setTextAreaStyle } from "../../../utils/formClasses";
import Wrapper from "../../UI/wrapper/wrapper.component";
import useHttp from "../../../hooks/use-http";
import toast from "react-hot-toast";
import { IRoleItem } from "../../../views/role/role";
import useWatchInput from "../../../hooks/use-watch-input";

const RoleCreateForm: FC<{
  roleToEdit: {
    _id: string;
    name: string;
    label: string;
    isActive: boolean;
  } | null;
  setRoles: Dispatch<SetStateAction<IRoleItem[]>>;
  setRoleToEdit: Dispatch<
    SetStateAction<{
      _id: string;
      name: string;
      label: string;
      isActive: boolean;
    } | null>
  >;
}> = ({ roleToEdit, setRoles, setRoleToEdit }) => {
  const {
    sendRequest,
    isLoading: isRequestLoading,
    error: requestError,
  } = useHttp();

  const [isActive, SetActive] = useState(false);

  const { value: name } = useWatchInput(
    (value: string) => regexGeneric.test(value),
    roleToEdit?.name ? roleToEdit.name : ""
  );

  const { value: label } = useWatchInput(
    (value: string) => regexGeneric.test(value),
    roleToEdit?.label ? roleToEdit.label : ""
  );

  const cancelForm = () => {
    setRoleToEdit(null);
  };

  const handleSubmitRole = () => {
    const applyDataCreate = (data: any) => {
      setRoles((currentRoles) => [...currentRoles, data.data]);
      cancelForm();
      toast.success(data.message);
    };

    const applyDataUpdate = (data: any) => {
      console.log(data.data);

      setRoles((currentRoles) =>
        currentRoles.map((role) => {
          const roleData = data.data;
          if (role._id === roleToEdit?._id)
            return {
              ...role,
              role: roleData.role,
              label: roleData.label,
              isActive: roleData.isActive,
            };
          return role;
        })
      );
      cancelForm();
      toast.success(data.message);
    };

    if (name.isValid && label.isValid)
      sendRequest(
        {
          path: roleToEdit
            ? `/permission/role/${roleToEdit._id}`
            : `/permission/role`,
          method: roleToEdit ? "put" : "post",
          body: { role: name.value, description: label.value, isActive },
        },
        roleToEdit ? applyDataUpdate : applyDataCreate
      );
    else toast.error("Le formulaire n'est pas valide");
  };

  useEffect(() => {
    if (requestError) toast.error("problème requête");
  }, [requestError]);

  useEffect(() => {
    if (roleToEdit) SetActive(roleToEdit?.isActive);
    else SetActive(false);
  }, [roleToEdit]);

  return (
    <Wrapper>
      <form autoComplete="off" className="flex flex-col gap-y-10">
        <div className="flex flex-col gap-y-5">
          <span className="flex flex-col gap-y-1">
            <h2 className="flex flex-col gap-y-4 font-bold text-xl">
              Création de rôles
            </h2>
            <p className="text-sm">
              Après avoir créé un rôle, vous pourrez lui ajouter des permissions
            </p>
          </span>

          <span className="flex flex-col gap-y-1">
            <p>Nom du rôle</p>
            <input
              type="text"
              name="name"
              id="name"
              className={setInputStyle(name.hasError && name.value.length > 0)}
              onChange={name.valueChangeHandler}
              onBlur={name.valueBlurHandler}
              value={name.value}
            />
          </span>

          <span className="flex flex-col gap-y-1">
            <p>Description</p>
            <textarea
              name="description"
              id="description"
              className={setTextAreaStyle(
                label.hasError && label.value.length > 0
              )}
              onChange={label.valueChangeHandler}
              onBlur={label.valueBlurHandler}
              value={label.value}
            />
          </span>
        </div>

        <span className="flex gap-x-1">
          <p>Status</p>
          <input
            type="checkbox"
            className="toggle toggle-primary"
            checked={isActive}
            onChange={(e) => SetActive(e.currentTarget.checked)}
          />
          <p>{isActive ? "Actif" : "Inactif"}</p>
        </span>

        <div className="flex justify-between">
          {isRequestLoading ? (
            <button type="button" className="btn btn-sm px-10">
              <span className="loading loading-spinner" />
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-sm btn-primary normal-case px-10"
              onClick={handleSubmitRole}
            >
              {roleToEdit ? "Modifier" : "Ajouter"}
            </button>
          )}
          {roleToEdit && (
            <button
              onClick={cancelForm}
              type="button"
              className="btn btn-sm normal-case px-10"
            >
              Annuler
            </button>
          )}
        </div>
      </form>
    </Wrapper>
  );
};

export default RoleCreateForm;
