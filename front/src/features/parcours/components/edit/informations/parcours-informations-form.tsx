import { FC, useCallback, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";

import SubWrapper from "../../../../../../src/components/wrappers/SubBoxWrapper";
import { infosParCoursSchema } from "../../../parcours.schema";
import FormInput from "../../../../../../src/components/form/FormInput";
import FormTextarea from "../../../../../../src/components/form/FormTextarea";
import useAutoSave from "../../../../../../src/hooks/useAutoSave";
import { useParcoursQuery } from "../../../hooks/useParcoursQuery";
import { useUpdateParcours } from "../../../hooks/useUpdateParcours";

type Props = {
  parcoursId?: string;
};

const ParcoursInformationsForm: FC<Props> = ({ parcoursId = "12" }) => {
  const numericParcoursId = Number(parcoursId);
  const { data: parcours } = useParcoursQuery(numericParcoursId);
  const { mutateAsync: updateParcours } = useUpdateParcours(numericParcoursId);
  const formation = parcours?.formation;
  const parcoursInfos = parcours;

  const isInitialRender = useRef(true);

  const defaultValues = useMemo(
    () => ({
      title: parcoursInfos?.title ?? "",
      description: parcoursInfos?.description ?? "",
    }),
    [parcoursInfos?.title, parcoursInfos?.description],
  );

  const {
    register,
    watch,
    handleSubmit: rhfHandleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    resolver: zodResolver(infosParCoursSchema),
  });

  const saveInfos = useCallback(
    async (data: { title: string; description?: string }) => {
      try {
        const response = await updateParcours({
          title: data.title,
          description: data.description ?? "",
        });
        toast.success(response.message);
      } catch {
        toast.error("Erreur lors de la sauvegarde");
      }
    },
    [updateParcours],
  );

  const onSave = useCallback(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }
    rhfHandleSubmit(saveInfos, (errs) => {
      const firstError = Object.values(errs)[0];
      if (firstError?.message) toast.error(firstError.message);
    })();
  }, [rhfHandleSubmit, saveInfos]);

  useAutoSave(watch, onSave);

  return (
    <>
      <div>
        {formation && parcoursInfos?.title ? (
          <>
            <div className="flex flex-col gap-y-4">
              <h2 className="font-bold">Formation</h2>
              <SubWrapper>
                <p className="first-letter:uppercase">{formation.title}</p>
              </SubWrapper>
            </div>
            <form className="w-full flex flex-col gap-y-8 mt-8">
              <div
                className="flex flex-col gap-y-8"
                data-onboarding="parcours-essential-information"
              >
                <FormInput
                  label="Titre *"
                  name="title"
                  register={register}
                  error={errors.title}
                  placeholder="Ex : CDA - Promo 2023"
                />

                <FormTextarea
                  label="Description"
                  name="description"
                  register={register}
                  error={errors.description}
                />
              </div>

              <div className="flex flex-col gap-y-4">
                <h2 className="font-bold">Niveau du parcours</h2>
                <SubWrapper>{formation.level}</SubWrapper>
              </div>
            </form>
          </>
        ) : null}
      </div>
    </>
  );
};

export default ParcoursInformationsForm;
