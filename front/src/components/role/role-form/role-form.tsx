import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import useInput from "../../../hooks/use-input";
import { regexGeneric } from "../../../utils/constantes";
import { setInputStyle, setTextAreaStyle } from "../../../utils/formClasses";
import Wrapper from "../../UI/wrapper/wrapper.component";
import useHttp from "../../../hooks/use-http";
import toast from "react-hot-toast";
import { IRoleItem } from "../../../views/role/role";
import useWatchInput from "../../../hooks/use-watch-input";

const RoleCreateForm: FC<{
  roleToEdit: { _id: string; name: string } | null;
  setRoles: Dispatch<SetStateAction<IRoleItem[]>>;
  setRoleToEdit: Dispatch<
    SetStateAction<{
      _id: string;
      name: string;
    } | null>
  >;
}> = ({ roleToEdit, setRoles, setRoleToEdit }) => {
  const {
    sendRequest,
    isLoading: isRequestLoading,
    error: requestError,
  } = useHttp();

  const [isActive, SetActive] = useState(true);

  const { value: name } = useWatchInput(
    (value: string) => regexGeneric.test(value),
    roleToEdit?.name ? roleToEdit.name : ""
  );

  const { value: description } = useWatchInput(
    (value: string) => regexGeneric.test(value),
    ""
  );

  /* const { value: rank } = useInput(
    (value: string) => regexNumber.test(value),
    ""
  ); */

  const handleSubmitRole = () => {
    const applyDataCreate = (data: any) => {
      setRoles((currentRoles) => [...currentRoles, data.data]);
      toast.success(data.message);
    };

    const applyDataUpdate = (data: any) => {
      setRoles((currentRoles) =>
        currentRoles.map((role) => {
          if (role._id === roleToEdit?._id)
            return { ...role, role: name.value };
          return role;
        })
      );
      setRoleToEdit(null);
      toast.success(data.message);
    };

    if (name.isValid && description.isValid)
      sendRequest(
        {
          path: roleToEdit
            ? `/permission/role/${roleToEdit._id}`
            : `/permission/role`,
          method: roleToEdit ? "put" : "post",
          body: { role: name.value, description: description.value, rank: 1 },
        },
        roleToEdit ? applyDataUpdate : applyDataCreate
      );
    else toast.error("Le formulaire n'est pas valide");
  };

  useEffect(() => {
    if (requestError) toast.error("problème requête");
  }, [requestError]);

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
                description.hasError && description.value.length > 0
              )}
              onChange={description.valueChangeHandler}
              onBlur={description.valueBlurHandler}
              value={description.value}
            />
          </span>
        </div>

        <span className="flex gap-x-1">
          <p>Status</p>
          <input
            type="checkbox"
            className="toggle toggle-primary"
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
              onClick={() => setRoleToEdit(null)}
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
