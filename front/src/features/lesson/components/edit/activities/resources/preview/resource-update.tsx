import { useEffect } from "react";
import type { Resource } from "../../../../../../../../src.legacy/utils/interfaces/activity";
import Field from "../../../../../../../../src.legacy/components/UI/forms/field";
import useForm from "../../../../../../../../src.legacy/components/UI/forms/hooks/use-form";
import { z, ZodError } from "zod";
import { regexGeneric } from "../../../../../../../../src.legacy/utils/constantes";
import { validationErrors } from "../../../../../../../../src.legacy/helpers/validate";

type Props = {
  resource: Resource;
  onSubmit: (value: string, id: number) => void;
  onCancel: () => void;
};

function ResourceUpdate({ resource, onSubmit, onCancel }: Props) {
  const { values, errors, initValues, onChangeValue, onValidationErrors } =
    useForm();

  useEffect(() => {
    initValues({ label: resource.label });
  }, [initValues, resource]);

  const data = { values, errors, onChangeValue };

  const schema = z.object({
    label: z
      .string()
      .min(1, "Le nom de la ressource est requis.")
      .regex(regexGeneric, {
        message:
          "Le nom de la ressource contient des caractères non autorisés.",
      }),
  });

  const handleSubmit = () => {
    try {
      schema.parse(values);
    } catch (error: any) {
      if (error instanceof ZodError) {
        const errors = validationErrors(error);
        onValidationErrors(errors);
        return;
      }
    }
    onSubmit(values.label as string, resource.id);
  };

  return (
    <div className="modal modal-open  " role="dialog">
      <div className="modal-box">
        <div className="flex flex-col gap-y-4">
          <h2>Modification du nom de la ressource</h2>
          <Field name="label" label="" type="text" data={data} />
          <span className="flex justify-center items-center gap-x-2">
            <p className="text-xs">
              Si vous souhaitez modifier le fichier de la ressource : veuillez
              effacer la ressource et créez en une nouvelle.
            </p>
          </span>

          <span className="flex justify-end items-center gap-x-4">
            <button
              className="btn btn-secondary btn-outline"
              onClick={onCancel}
            >
              Annuler
            </button>
            <button className="btn btn-primary" onClick={handleSubmit}>
              Modifier
            </button>
          </span>
        </div>
      </div>
    </div>
  );
}

export default ResourceUpdate;
