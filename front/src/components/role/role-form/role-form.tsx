/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Ref,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import { regexGeneric } from "../../../utils/constantes";
import { setInputStyle } from "../../../utils/formClasses";
import Wrapper from "../../UI/wrapper/wrapper.component";
import useHttp from "../../../hooks/use-http";
import toast from "react-hot-toast";
import useInput from "../../../hooks/use-input";
import RoleTypeSelector from "./role-type-selector";
import { Context } from "../../../store/context.store";

type RoleFormProps = {
  role?: any;
  onRefreshData?: () => Promise<void>;
};

const RoleForm = ({ role, onRefreshData }: RoleFormProps) => {
  const { fetchRoles, user } = useContext(Context);
  const { sendRequest, isLoading: isRequestLoading } = useHttp(true);

  const [currentRoleType, setCurrentRoleType] = useState<number>(1);

  const nameInputRef: Ref<HTMLInputElement> = useRef(null);

  const { value: name } = useInput(
    (value: string) => regexGeneric.test(value),
    role?.role || "",
  );

  const { value: label } = useInput(
    (value: string) => regexGeneric.test(value),
    role?.label || "",
  );

  const cancelForm = useCallback(() => {
    name.reset();
    label.reset();
    setCurrentRoleType(1);
  }, [name, label]);

  const applyDataCreate = useCallback(
    async (data: any) => {
      cancelForm();
      toast.success(data.message);
      onRefreshData && (await onRefreshData());
    },
    [cancelForm, onRefreshData],
  );

  const applyDataUpdate = useCallback(
    (data: any) => {
      fetchRoles(user!.roles[0]);
      toast.success(data.message);
    },
    [fetchRoles, user],
  );

  const handleSubmitRole = useCallback(() => {
    if (name.isValid && label.isValid)
      sendRequest(
        {
          path: role ? `/permission/role/${role._id}` : `/permission/role`,
          method: role ? "put" : "post",
          body: {
            role: name.value,
            label: label.value,
            rank: currentRoleType,
          },
        },
        role ? applyDataUpdate : applyDataCreate,
      );
    else toast.error("Le formulaire n'est pas valide");
  }, [
    role,
    name,
    label,
    currentRoleType,
    sendRequest,
    applyDataCreate,
    applyDataUpdate,
  ]);

  useEffect(() => {
    if (role) {
      setCurrentRoleType(role.rank);
      nameInputRef.current?.focus();
    }
  }, [role]);

  const formClassName = useMemo(() => "flex flex-col gap-y-10", []);
  const inputClassName = useMemo(
    () => (hasError: boolean) => setInputStyle(hasError),
    [],
  );

  return (
    <div className="h-fit">
      <Wrapper>
        <form
          autoComplete="off"
          className={formClassName}
          onSubmit={(e) => e.preventDefault()}
        >
          <span className="flex flex-col gap-y-1">
            <h2 className="font-bold text-xl">
              {role ? "Modification du rôle" : "Création de rôles"}
            </h2>
            {!role && (
              <p className="text-sm">
                Après avoir créé un rôle, vous pourrez lui ajouter des
                permissions
              </p>
            )}
          </span>

          <div className="flex flex-col sm:flex-row gap-10 w-full items-end">
            <span className="flex flex-col gap-y-1 w-full">
              <p>Nom du rôle</p>
              <input
                ref={nameInputRef}
                type="text"
                name="name"
                id="name"
                className={inputClassName(
                  name.hasError && name.value.length > 0,
                )}
                onChange={name.valueChangeHandler}
                onBlur={name.valueBlurHandler}
                value={name.value}
              />
            </span>

            <span className="flex flex-col gap-y-1 w-full">
              <p>Label</p>
              <input
                name="label"
                id="label"
                className={inputClassName(
                  label.hasError && label.value.length > 0,
                )}
                onChange={label.valueChangeHandler}
                onBlur={label.valueBlurHandler}
                value={label.value}
                maxLength={15}
              />
            </span>

            <span className="flex flex-col gap-y-1 w-full">
              <p>Modèle de rôle</p>
              <RoleTypeSelector
                currentRoleType={currentRoleType}
                onSetCurrentRoleType={setCurrentRoleType}
                editMode={role}
              />
            </span>
            <div className="w-full sm:w-auto">
              <button
                type="button"
                className="btn btn-sm btn-primary normal-case px-10 w-full"
                onClick={handleSubmitRole}
              >
                <div className="flex items-center justify-center gap-2 min-w-[80px]">
                  {role ? "Modifier" : "Ajouter"}
                  {isRequestLoading && (
                    <span className="loading loading-spinner" />
                  )}
                </div>
              </button>
            </div>
          </div>
        </form>
      </Wrapper>
    </div>
  );
};

export default RoleForm;
