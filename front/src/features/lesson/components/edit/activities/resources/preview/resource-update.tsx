import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Resource } from "../../../../../../../../src/utils/interfaces/activity";
import { z } from "zod";
import { regexGeneric } from "../../../../../../../config/constantes";
import FormInput from "../../../../../../../components/form/FormInput";

const schema = z.object({
  label: z
    .string()
    .min(1, "Le nom de la ressource est requis.")
    .regex(regexGeneric, {
      message:
        "Le nom de la ressource contient des caractères non autorisés.",
    }),
});

type ResourceFormData = z.infer<typeof schema>;

type Props = {
  resource: Resource;
  onSubmit: (value: string, id: number) => void;
  onCancel: () => void;
};

function ResourceUpdate({ resource, onSubmit, onCancel }: Props) {
  const {
    register,
    handleSubmit: rhfHandleSubmit,
    formState: { errors },
    reset,
  } = useForm<ResourceFormData>({
    resolver: zodResolver(schema),
    defaultValues: { label: "" },
  });

  useEffect(() => {
    reset({ label: resource.label });
  }, [reset, resource]);

  const handleSubmit = rhfHandleSubmit((formValues) => {
    onSubmit(formValues.label, resource.id);
  });

  return (
    <div className="modal modal-open  " role="dialog">
      <div className="modal-box">
        <div className="flex flex-col gap-y-4">
          <h2>Modification du nom de la ressource</h2>
          <FormInput name="label" label="" register={register} error={errors.label} />
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
