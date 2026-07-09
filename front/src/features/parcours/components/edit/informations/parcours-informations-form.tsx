import { FC, useCallback, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";

import { useParcoursSelector, useParcoursDispatch } from "../../../store/ParcoursContext";
import SubWrapper from "../../../../../../src/components/wrappers/SubBoxWrapper";
import { infosParCoursSchema } from "../../../parcours.schema";
import FormInput from "../../../../../../src/components/form/FormInput";
import FormTextarea from "../../../../../../src/components/form/FormTextarea";
import useAutoSave from "../../../../../../src/hooks/useAutoSave";
import { parcoursApi } from "../../../api/parcours.api";

type Props = {
  parcoursId?: string;
};

const ParcoursInformationsForm: FC<Props> = ({ parcoursId = "12" }) => {
  const formation = useParcoursSelector((state) => state.parcours.formation) as { id: number; title: string; level: string } | null;
  const parcoursInfos = useParcoursSelector(
    (state) => state.parcoursInformations.infos,
  );
  const dispatch = useParcoursDispatch();

  const isInitialRender = useRef(true);

  const defaultValues = useMemo(
    () => ({
      title: parcoursInfos.title ?? "",
      description: parcoursInfos.description ?? "",
    }),
    [parcoursInfos.title, parcoursInfos.description],
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
      dispatch({
        type: "UPDATE_PARCOURS_INFOS",
        payload: {
          title: data.title,
          description: data.description,
        },
      });

      try {
        const response = await parcoursApi.mutations.updateParcoursInfos({
          parcoursId,
          title: data.title,
          description: data.description,
          formation: String((formation as { id: number }).id),
        });
        toast.success(response.message);
      } catch {
        toast.error("Erreur lors de la sauvegarde");
      }
    },
    [dispatch, formation, parcoursId],
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
        {formation && parcoursInfos.title ? (
          <>
            <div className="flex flex-col gap-y-4">
              <h2 className="font-bold">Formation</h2>
              <SubWrapper>
                <p className="capitalize">{formation.title}</p>
              </SubWrapper>
            </div>
            <form className="w-full flex flex-col gap-y-8 mt-8">
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
