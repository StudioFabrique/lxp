/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useCallback, useEffect, useRef, useState } from "react";
import { ZodError } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";

import useHttp from "../../../hooks/use-http";
import { parcoursInformationsAction } from "../../../store/redux-toolkit/parcours/parcours-informations";
import { autoSubmitTimer } from "../../../config/auto-submit-timer";
import SubWrapper from "../../UI/sub-wrapper/sub-wrapper.component";
import useFormAutoSubmit from "../../UI/forms/hooks/use-form-auto-submit";
import Field from "../../UI/forms/field";
import FieldArea from "../../UI/forms/field-area";
import { infosParCoursSchema } from "../../../lib/validation/parcours-edit/infos-parcours-schema";
import { validationErrors } from "../../../helpers/validate";

type Props = {
  parcoursId?: string;
};

const ParcoursInformationsForm: FC<Props> = ({ parcoursId = "12" }) => {
  const formation = useSelector((state: any) => state.parcours.formation);
  const parcoursInfos = useSelector(
    (state: any) => state.parcoursInformations.infos
  );
  const { sendRequest } = useHttp();
  const dispatch = useDispatch();

  const [visibility, setVisibility] = useState<boolean>(
    parcoursInfos.visibility
  );
  const isInitialRender = useRef(true);

  const {
    errors,
    values,
    submit,
    setSubmit,
    onChangeValue,
    onValidationErrors,
    initValues,
  } = useFormAutoSubmit();

  const data = {
    values,
    onChangeValue,
    errors,
  };

  const handleSetVisibility = () => {
    setVisibility((prevState) => !prevState);
    setSubmit(true);
  };

  /**
   * initialise le  formulaire avec les données stockées dans le state partagé
   */
  useEffect(() => {
    if (isInitialRender.current) {
      initValues({
        title: parcoursInfos.title,
        description: parcoursInfos.description,
      });
      isInitialRender.current = false;
    }
  }, [parcoursInfos.title, parcoursInfos.description, initValues]);

  /**
   * envoi d'une requête http pour mettre à jour les informations du formulaire
   */
  const updateInfos = useCallback(() => {
    try {
      infosParCoursSchema.parse(values);
    } catch (error: any) {
      if (error instanceof ZodError) {
        const errors = validationErrors(error);
        onValidationErrors(errors);
        toast.error(errors[0].message);
      }
      return;
    }
    const processData = (data: { message: string }) => {
      toast.success(data.message);
    };
    sendRequest(
      {
        path: "/parcours/update-infos",
        method: "put",
        body: {
          parcoursId,
          title: values.title,
          description: values.description,
          visibility,
          formation: formation.id.toString(),
        },
      },
      processData
    );
  }, [
    values,
    onValidationErrors,
    formation,
    sendRequest,
    parcoursId,
    visibility,
  ]);

  /**
   * déclenchement avec un délai configuré dans le fichier auto-submit-timer.ts de l'envoi d'une requête http pour la mise à jour des informations du parcours
   */
  useEffect(() => {
    const setInfos = async () => {
      dispatch(
        parcoursInformationsAction.updateParcoursInfos({
          title: values.title,
          description: values.description,
          visibility,
        })
      );
      updateInfos();
      setSubmit(false);
    };
    const timer = setTimeout(() => {
      if (submit) {
        setInfos();
      }
    }, autoSubmitTimer);
    return () => {
      clearTimeout(timer);
    };
  }, [
    updateInfos,
    submit,
    setSubmit,
    visibility,
    values.title,
    values.description,
    dispatch,
  ]);

  return (
    <>
      <div>
        {formation && parcoursInfos.title ? (
          <>
            <div className="flex flex-col gap-y-4">
              <h2 className="font-bold">Formation</h2>
              <SubWrapper>{formation.title}</SubWrapper>
            </div>
            <form className="w-full flex flex-col gap-y-8 mt-8">
              <Field
                label="Titre *"
                name="title"
                placeholder="Ex : CDA - Promo 2023"
                data={data}
              />

              <FieldArea label="Description" name="description" data={data} />

              <div className="flex flex-col gap-y-4">
                <h2 className="font-bold">Niveau du parcours</h2>
                <SubWrapper>{formation.level}</SubWrapper>
              </div>

              <div className="form-control w-fit">
                <label className="flex gap-x-4 cursor-pointer items-center label">
                  <span className="font-bold">Visibilité</span>
                  <input
                    type="checkbox"
                    className="toggle toggle-primary"
                    checked={visibility ? visibility : false}
                    onChange={handleSetVisibility}
                  />
                  <p className="text-sm">{visibility ? "Visible" : "Caché"}</p>
                </label>
              </div>
            </form>
          </>
        ) : null}
      </div>
    </>
  );
};

export default ParcoursInformationsForm;
