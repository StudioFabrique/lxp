import { useContext, useEffect, useId, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { roleFormSchema } from "../../role.schema";
import { useFormField } from "../../../../components/form/useFormField";
import { showFormErrors } from "../../../../components/form/form-errors";
import QuestionMarkTooltip from "../../../../components/UI/question-mark-tooltip/question-mark-tooltip";
import BoxWrapper from "../../../../components/wrappers/BoxWrapper";
import { AuthContext } from "../../../../store/AuthProvider";
import { getApiErrorMessage } from "../../../../utils/helpers/api-error-message";
import type Role from "../../../../utils/interfaces/role";
import {
  roleApi,
  type RoleFormPayload,
} from "../../api/role.api";
import { setInputStyle } from "../../helpers/formClasses";
import RoleTypeSelector from "./RoleTypeSelector";

type RoleFormProps = {
  role?: Role;
  duplicateFrom?: Role;
  embedded?: boolean;
  onRoleCreated?: () => void;
  onSuccess?: () => void;
};

const getInitialName = (role?: Role, duplicateFrom?: Role) =>
  role?.role ?? (duplicateFrom ? `${duplicateFrom.role}_copie` : "");

const getInitialLabel = (role?: Role, duplicateFrom?: Role) =>
  role?.label ?? (duplicateFrom ? `${duplicateFrom.label} (copie)` : "");

const RoleForm = ({
  role,
  duplicateFrom,
  embedded = false,
  onRoleCreated,
  onSuccess,
}: RoleFormProps) => {
  const { user } = useContext(AuthContext);
  const actorRank = user?.roles[0]?.rank ?? 4;
  const defaultRoleType = Math.min(actorRank + 1, 4);
  const formId = useId();
  const roleForm = useForm({ resolver: zodResolver(roleFormSchema), defaultValues: {
    name: getInitialName(role, duplicateFrom), label: getInitialLabel(role, duplicateFrom), rank: role?.rank ?? duplicateFrom?.rank ?? defaultRoleType,
  } });
  const [name, setName] = useFormField(roleForm, "name");
  const [label, setLabel] = useFormField(roleForm, "label");
  const [currentRoleType, setCurrentRoleType] = useFormField(roleForm, "rank");
  const nameInputRef = useRef<HTMLInputElement | null>(null);
  const labelInputRef = useRef<HTMLInputElement | null>(null);
  const nameHasError = Boolean(roleForm.formState.errors.name);
  const labelHasError = Boolean(roleForm.formState.errors.label);

  const finishMutation = () => {
    onRoleCreated?.();
    onSuccess?.();
  };

  const createMutation = useMutation({
    mutationFn: (body: RoleFormPayload) => roleApi.mutations.createRole(body),
    onSuccess: (data) => {
      toast.success(data.message);
      if (!duplicateFrom) {
        setName("");
        setLabel("");
        setCurrentRoleType(defaultRoleType);
      }
      finishMutation();
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Impossible de créer ce rôle."));
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: string;
      body: Omit<RoleFormPayload, "duplicateFromId">;
    }) => roleApi.mutations.updateRole(id, body),
    onSuccess: (data) => {
      toast.success(data.message);
      finishMutation();
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Impossible de modifier ce rôle."));
    },
  });

  const isRequestLoading = createMutation.isPending || updateMutation.isPending;

  const handleMouseEnterFillLabel = () => {
    if (role || duplicateFrom || label.length > 0) return;
    setLabel(name);
  };

  const handleSubmitRole = roleForm.handleSubmit((values) => {
    if (isRequestLoading) return;
    const body = { role: values.name, label: values.label, rank: values.rank };

    if (role) {
      updateMutation.mutate({ id: role._id, body });
      return;
    }

    createMutation.mutate({
      ...body,
      duplicateFromId: duplicateFrom?._id,
    });
  }, showFormErrors);

  useEffect(() => {
    if (role?.protection && role.protection >= 1) {
      labelInputRef.current?.focus();
    } else {
      nameInputRef.current?.focus();
    }
  }, [role?.protection]);

  const form = (
    <form
      autoComplete="off"
      className="grid w-full min-w-0 gap-5 md:grid-cols-2"
      onSubmit={handleSubmitRole}
    >
      <div className="flex min-w-0 flex-col gap-y-1">
        <div className="flex items-center gap-2">
          <label htmlFor={`${formId}-name`}>Nom du rôle</label>
          <QuestionMarkTooltip tooltipValue="Nom technique utilisé principalement pour les opérations internes de l'application" />
        </div>
        <input
          ref={nameInputRef}
          type="text"
          name="name"
          id={`${formId}-name`}
          className={setInputStyle(nameHasError)}
          maxLength={50}
          onChange={(event) => setName(event.target.value)}
          value={name}
          disabled={Boolean(role && role.protection >= 1)}
        />
      </div>

      <div className="flex min-w-0 flex-col gap-y-1">
        <div className="flex items-center gap-2">
          <label htmlFor={`${formId}-label`}>Libellé</label>
          <QuestionMarkTooltip
            tooltipPosition="left"
            tooltipValue="Nom du rôle visible pour les utilisateurs de l'application"
          />
        </div>
        <input
          ref={labelInputRef}
          name="label"
          id={`${formId}-label`}
          className={setInputStyle(labelHasError)}
          maxLength={50}
          onClick={handleMouseEnterFillLabel}
          onChange={(event) => setLabel(event.target.value)}
          value={label}
        />
      </div>

      <div className="flex min-w-0 flex-col gap-y-1">
        <div className="flex items-center gap-2">
          <label htmlFor={`${formId}-model`}>Modèle de rôle</label>
          <QuestionMarkTooltip tooltipValue="Affecte un modèle de permissions prédéfinies au rôle actuel" />
        </div>
        <RoleTypeSelector
          id={`${formId}-model`}
          currentRoleType={currentRoleType}
          onSetCurrentRoleType={setCurrentRoleType}
          editMode={Boolean(role)}
          disabled={Boolean(
            duplicateFrom || (role && role.protection >= 1),
          )}
          minimumRank={actorRank}
        />
      </div>

      <div className="flex items-end md:justify-end">
        <button
          type="submit"
          className="btn btn-primary text-base-100 w-full md:w-auto"
          disabled={isRequestLoading}
        >
          {role ? "Enregistrer" : duplicateFrom ? "Dupliquer" : "Créer"}
          {isRequestLoading ? <span className="loading loading-spinner" /> : null}
        </button>
      </div>
    </form>
  );

  if (embedded) return form;

  return (
    <div className="flex flex-col gap-5">
      <span className="ml-2 flex flex-col gap-y-1">
        <h2 className="text-xl font-bold">
          {role ? "Détails du rôle" : "Création d'un rôle"}
        </h2>
        <p className="text-sm">
          {role
            ? "Vous pouvez modifier les informations du rôle"
            : "Après avoir créé un rôle, vous pourrez lui ajouter des permissions"}
        </p>
      </span>
      <BoxWrapper>{form}</BoxWrapper>
    </div>
  );
};

export default RoleForm;
