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
import Role from "../../../utils/interfaces/role";
import QuestionMarkTooltip from "../../UI/question-mark-tooltip/question-mark-tooltip";

type RoleFormProps = {
  role?: Role;
  allow2xlScreenFlexCol?: boolean;
  onRefreshData?: () => Promise<void>;
};

const RoleForm = ({
  role,
  allow2xlScreenFlexCol,
  onRefreshData,
}: RoleFormProps) => {
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

  const formClassName = useMemo(() => "flex flex-col gap-y-5", []);
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
              {role ? "Détails du rôle" : "Création de rôles"}
            </h2>
            {!role ? (
              <p className="text-sm">
                Après avoir créé un rôle, vous pourrez lui ajouter des
                permissions
              </p>
            ) : (
              <p className="text-sm">
                Vous pouvez modifier les informations du rôle
              </p>
            )}
          </span>

          <div
            className={`flex flex-row ${allow2xlScreenFlexCol ? "2xl:flex-col" : ""} gap-10 w-full items-end`}
          >
            <div className="flex flex-col gap-y-1 w-full">
              <div className="flex items-center gap-2">
                <p>Nom du rôle</p>
                <QuestionMarkTooltip tooltipValue="test" />
              </div>
              <input
                ref={nameInputRef}
                type="text"
                name="name"
                id="name"
                className={inputClassName(
                  name.hasError && name.value.length > 0,
                )}
                maxLength={20}
                onChange={name.valueChangeHandler}
                onBlur={name.valueBlurHandler}
                value={name.value}
                disabled={role?.isProtected}
              />
            </div>

            <div className="flex flex-col gap-y-1 w-full">
              <div className="flex items-center gap-2">
                <p>Label</p>
                <QuestionMarkTooltip tooltipValue="test" />
              </div>
              <input
                name="label"
                id="label"
                className={inputClassName(
                  label.hasError && label.value.length > 0,
                )}
                maxLength={20}
                onChange={label.valueChangeHandler}
                onBlur={label.valueBlurHandler}
                value={label.value}
              />
            </div>

            <div className="flex flex-col gap-y-1 w-full">
              <div className="flex items-center gap-2">
                <p>Modèle de rôle</p>
                <QuestionMarkTooltip tooltipValue="test" />
              </div>
              <RoleTypeSelector
                currentRoleType={currentRoleType}
                onSetCurrentRoleType={setCurrentRoleType}
                editMode={Boolean(role)}
                disabled={role?.isProtected}
              />
            </div>
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
