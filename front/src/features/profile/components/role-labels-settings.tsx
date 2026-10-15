import { useState } from "react";
import { createPortal } from "react-dom";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, UserCog } from "lucide-react";
import Modal from "../../../components/UI/modal/modal";
import BoxWrapper from "../../../components/wrappers/BoxWrapper";
import { showFormErrors } from "../../../components/form/form-errors";
import RoleLabelsFields from "../../role/components/role-labels/RoleLabelsFields";
import {
  formValuesToRoleLabels,
  roleLabelsToFormValues,
  type RoleLabels,
  type RoleLabelsFormValues,
} from "../../role/helpers/role-labels";
import { roleLabelsSchema } from "../../role/role-labels.schema";

type Props = {
  /** Libellés actuellement enregistrés pour l'instance. */
  labels: RoleLabels;
  disabled?: boolean;
  /** Enregistre les libellés ; renvoie `true` quand le serveur a confirmé. */
  onSave: (labels: RoleLabels) => Promise<boolean>;
};

const FORM_ID = "instance-role-labels-form";

/** Carte des noms de rôles et modale d'édition, avec le même formulaire que l'onboarding. */
export default function RoleLabelsSettings({ labels, disabled, onSave }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<RoleLabelsFormValues>({
    resolver: zodResolver(roleLabelsSchema),
    defaultValues: roleLabelsToFormValues(labels),
  });
  const values = useWatch({ control: form.control });
  const { isDirty, isSubmitting, errors } = form.formState;

  const open = () => {
    // Repart des libellés enregistrés : une saisie abandonnée n'est pas conservée.
    form.reset(roleLabelsToFormValues(labels));
    setIsOpen(true);
  };

  const submit = form.handleSubmit(async (submitted) => {
    if (await onSave(formValuesToRoleLabels(submitted))) setIsOpen(false);
  }, showFormErrors);

  return (
    <>
      <BoxWrapper className="@container h-auto w-full shrink-0 overflow-visible">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-4">
            <span className="shrink-0 rounded-xl bg-primary/10 p-3 text-primary">
              <UserCog className="size-5" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-lg font-bold">Noms des rôles</h2>
              <p className="text-sm text-base-content/70">
                {Object.values(labels).join(", ")}
              </p>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-primary ml-auto normal-case"
            onClick={open}
            disabled={disabled}
          >
            <Pencil className="size-4" aria-hidden="true" />
            Modifier les noms
          </button>
        </div>
      </BoxWrapper>

      {isOpen &&
        createPortal(
          <Modal
            title="Nommer les rôles"
            leftLabel="Annuler"
            rightLabel="Enregistrer"
            onLeftClick={() => setIsOpen(false)}
            onRightClick={submit}
            isSubmitting={isSubmitting}
            rightDisabled={!isDirty}
            rightClassName="btn-primary"
            modalBoxStyle="w-11/12 max-w-3xl"
          >
            <p className="mt-2 text-sm text-base-content/65">
              Choisissez les noms affichés pour chaque rôle dans la
              plateforme.
            </p>
            <form
              id={FORM_ID}
              noValidate
              className="mt-4 flex flex-col gap-5"
              onSubmit={submit}
            >
              <RoleLabelsFields
                register={(field) => form.register(field)}
                errors={errors}
                values={{ ...roleLabelsToFormValues(labels), ...values }}
                disabled={isSubmitting}
              />
            </form>
          </Modal>,
          document.body,
        )}
    </>
  );
}
