import { useState, useRef, useEffect } from "react";
import { regexGeneric } from "../../../../config/constantes";
import { setInputStyle } from "../../../../utils/helpers/formClasses";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { roleApi } from "../../api/role.api";
import RoleTypeSelector from "./RoleTypeSelector";
import type Role from "../../../../../src/utils/interfaces/role";
import Wrapper from "../../../../../src/components/wrappers/BoxWrapper";
import QuestionMarkTooltip from "../../../../components/UI/question-mark-tooltip/question-mark-tooltip";

type RoleFormProps = {
  role?: Role;
  onRoleCreated?: () => void;
};

const RoleForm = ({ role, onRoleCreated }: RoleFormProps) => {
  const [name, setName] = useState(role?.role ?? "");
  const [label, setLabel] = useState(role?.label ?? "");
  const [currentRoleType, setCurrentRoleType] = useState(role?.rank ?? 1);

  const nameInputRef = useRef<HTMLInputElement | null>(null);
  const nameHasError = name.length > 0 && !regexGeneric.test(name);
  const labelHasError = label.length > 0 && !regexGeneric.test(label);

  const createMutation = useMutation({
    mutationFn: (body: { role: string; label: string; rank: number }) =>
      roleApi.mutations.createRole(body),
    onSuccess: (data) => {
      toast.success(data.message);
      setName("");
      setLabel("");
      setCurrentRoleType(1);
      onRoleCreated?.();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: string;
      body: { role: string; label: string; rank: number };
    }) => roleApi.mutations.updateRole(id, body),
    onSuccess: (data) => {
      toast.success(data.message);
    },
  });

  const isRequestLoading = createMutation.isPending || updateMutation.isPending;

  const handleMouseEnterFillLabel = () => {
    if (role || label.length > 0) return;
    setLabel(name);
  };

  const handleSubmitRole = () => {
    if (!regexGeneric.test(name) || !regexGeneric.test(label)) {
      toast.error("Le formulaire n'est pas valide");
      return;
    }

    const body = {
      role: name,
      label,
      rank: currentRoleType,
    };

    if (role) {
      updateMutation.mutate({ id: role._id, body });
    } else {
      createMutation.mutate(body);
    }
  };

  useEffect(() => {
    if (role) {
      setCurrentRoleType(role.rank);
      nameInputRef.current?.focus();
    }
  }, [role]);

  return (
    <div className="flex flex-col gap-5">
      <span className="flex flex-col gap-y-1 ml-2">
        <h2 className="font-bold text-xl">
          {role ? "Détails du rôle" : "Création de rôles"}
        </h2>
        {!role ? (
          <p className="text-sm">
            Après avoir créé un rôle, vous pourrez lui ajouter des permissions
          </p>
        ) : (
          <p className="text-sm">
            Vous pouvez modifier les informations du rôle
          </p>
        )}
      </span>
      <div className="h-full">
        <Wrapper>
          <form
            autoComplete="off"
            className="flex flex-col gap-y-5"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="flex flex-row gap-10 w-full items-end">
              <div className="flex flex-col gap-y-1 w-full">
                <div className="flex items-center gap-2">
                  <p>Nom du rôle</p>
                  <QuestionMarkTooltip tooltipValue="Nom technique utilisé principalement pour des opérations interne par l'application" />
                </div>
                <input
                  ref={nameInputRef}
                  type="text"
                  name="name"
                  id="name"
                  className={setInputStyle(nameHasError)}
                  maxLength={50}
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  disabled={!!(role && role.protection >= 1)}
                />
              </div>

              <div className="flex flex-col gap-y-1 w-full">
                <div className="flex items-center gap-2">
                  <p>Label</p>
                  <QuestionMarkTooltip tooltipValue="Nom du rôle visible pour les utilisateurs de l'application" />
                </div>
                <input
                  name="label"
                  id="label"
                  className={setInputStyle(labelHasError)}
                  maxLength={50}
                  onClick={handleMouseEnterFillLabel}
                  onChange={(e) => setLabel(e.target.value)}
                  value={label}
                />
              </div>

              <div className="flex flex-col gap-y-1 w-full">
                <div className="flex items-center gap-2">
                  <p>Modèle de rôle</p>
                  <QuestionMarkTooltip tooltipValue="Affecte un modèle de permissions prédéfénies au rôle actuel" />
                </div>
                <RoleTypeSelector
                  currentRoleType={currentRoleType}
                  onSetCurrentRoleType={setCurrentRoleType}
                  editMode={Boolean(role)}
                  disabled={!!(role && role.protection >= 1)}
                />
              </div>
              <div className="w-full">
                <button
                  type="button"
                  className="btn btn-sm btn-primary text-base-100 normal-case w-full"
                  onClick={handleSubmitRole}
                >
                  {role ? "Valider" : "Ajouter"}
                  {isRequestLoading && (
                    <span className="loading loading-spinner" />
                  )}
                </button>
              </div>
            </div>
          </form>
        </Wrapper>
      </div>
    </div>
  );
};

export default RoleForm;
