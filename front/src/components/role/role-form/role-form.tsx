import {
  Dispatch,
  FC,
  Ref,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { regexGeneric } from "../../../utils/constantes";
import { setInputStyle, setTextAreaStyle } from "../../../utils/formClasses";
import Wrapper from "../../UI/wrapper/wrapper.component";
import useHttp from "../../../hooks/use-http";
import toast from "react-hot-toast";
import { IRoleItem, IRoleToEdit } from "../../../views/role/role";
import useInput from "../../../hooks/use-input";
import RoleTypeSelector from "./role-type-selector";
import { Context } from "../../../store/context.store";

const RoleCreateForm: FC<{
  roleToEdit: IRoleToEdit | null;
  setRoles: Dispatch<SetStateAction<IRoleItem[]>>;
  setRoleToEdit: Dispatch<SetStateAction<IRoleToEdit | null>>;
  setCurrentRole: Dispatch<SetStateAction<IRoleItem>>;
}> = ({ roleToEdit, setRoles, setRoleToEdit, setCurrentRole }) => {
  const { fetchRoles, user } = useContext(Context);
  const { sendRequest, isLoading: isRequestLoading } = useHttp(true);

  const [isActive, SetActive] = useState(false);

  const [currentRoleType, setCurrentRoleType] = useState<number>(1);

  const nameInputRef: Ref<HTMLInputElement> = useRef(null);

  const { value: name } = useInput(
    (value: string) => regexGeneric.test(value),
    roleToEdit?.name ? roleToEdit.name : ""
  );

  const { value: label } = useInput(
    (value: string) => regexGeneric.test(value),
    roleToEdit?.label ? roleToEdit.label : ""
  );

  const cancelForm = () => {
    setRoleToEdit(null);
    name.reset();
    label.reset();
    setCurrentRoleType(1);
  };

  const handleSubmitRole = () => {
    const applyDataCreate = (data: any) => {
      const newRole: IRoleItem = data.data;
      setRoles((currentRoles) => [...currentRoles, newRole]);
      setCurrentRole(newRole);
      cancelForm();
      toast.success(data.message);
    };

    const applyDataUpdate = (data: any) => {
      setRoles((currentRoles) =>
        currentRoles.map((role) => {
          const roleData = data.data;
          if (role._id === roleToEdit?._id)
            return {
              ...role,
              role: roleData.role,
              label: roleData.label,
              rank: roleData.rank,
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
          body: {
            role: name.value,
            label: label.value,
            rank: currentRoleType,
            isActive,
          },
        },
        roleToEdit ? applyDataUpdate : applyDataCreate
      );
    else toast.error("Le formulaire n'est pas valide");
  };

  /**
   * Dès qu'un rôle à editer est défini, alors activer le toggle en fonction de l'état d'activation du role
   * puis faire un focus sur l'input du nom du rôle (name)
   */
  useEffect(() => {
    if (roleToEdit) {
      SetActive(roleToEdit.isActive);
      setCurrentRoleType(roleToEdit.rank);
      nameInputRef.current?.focus();
    } else SetActive(false);
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
              ref={nameInputRef}
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

          <span className="flex flex-col gap-y-1">
            <p>Modèle de rôle</p>
            <RoleTypeSelector
              currentRoleType={currentRoleType}
              onSetCurrentRoleType={setCurrentRoleType}
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
