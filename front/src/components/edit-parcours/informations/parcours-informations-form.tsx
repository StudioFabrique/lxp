/* eslint-disable @typescript-eslint/no-explicit-any */

import { FC, useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import useHttp from "../../../hooks/use-http";
import useInput from "../../../hooks/use-input";
import { regexGeneric, regexOptionalGeneric } from "../../../utils/constantes";
import { parcoursInformationsAction } from "../../../store/redux-toolkit/parcours/parcours-informations";
import { autoSubmitTimer } from "../../../config/auto-submit-timer";

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
  const { value: title } = useInput(
    (value) => regexGeneric.test(value),
    parcoursInfos.title
  );
  const { value: description } = useInput(
    (value) => regexOptionalGeneric.test(value),
    parcoursInfos.description
  );
  const isInitialRender = useRef(true);

  // vérification des champs du formulaire
  const formIsValid = title.isValid && description.isValid;

  /**
   * envoi d'une requête http pour mettre à jour les informations du formulaire
   */
  const updateInfos = useCallback(() => {
    const processData = (data: { message: string }) => {
      toast.success(data.message);
    };
    if (formIsValid) {
      sendRequest(
        {
          path: "/parcours/update-infos",
          method: "put",
          body: {
            parcoursId,
            title: title.value,
            description: description.value,
            formation: formation.id.toString(),
          },
        },
        processData
      );
    }
  }, [
    description.value,
    title.value,
    formation,
    formIsValid,
    sendRequest,
    parcoursId,
  ]);

  /**
   * déclenchement avec un délai configuré dans le fichier auto-submit-timer.ts de l'envoi d'une requête http pour la mise à jour des informations du parcours
   */
  useEffect(() => {
    const setInfos = async () => {
      dispatch(
        parcoursInformationsAction.updateParcoursInfos({
          title: title.value,
          description: description.value,
        })
      );
      if (!isInitialRender.current) {
        updateInfos();
      } else {
        isInitialRender.current = false;
      }
    };
    const timer = setTimeout(() => {
      setInfos();
    }, autoSubmitTimer);
    return () => {
      clearTimeout(timer);
    };
  }, [updateInfos, description.value, title.value, dispatch]);

  /**
   * définit le style du champ formulaire en fonction de sa validité
   * @param hasError boolean
   * @returns string
   */
  const setInputStyle = (hasError: boolean) => {
    return hasError
      ? "input input-error text-error input-sm input-bordered focus:outline-none w-full"
      : "input input-sm input-bordered focus:outline-none w-full";
  };

  /**
   * définit le style du champ formulaire en fonction de sa validité
   * @param hasError boolean
   * @returns string
   */
  const setAreaStyle = (hasError: boolean) => {
    return hasError
      ? "textarea textarea-error text-error textarea-sm textarea-bordered focus:outline-none w-full"
      : "textarea textarea-sm textarea-bordered focus:outline-none w-full";
  };

  return (
    <>
      <div>
        {formation && parcoursInfos.title ? (
          <>
            <div className="flex flex-col gap-y-4">
              <label className="font-bold" htmlFor="formation">
                Formation
              </label>
              <input
                className="input input-sm input-bordered focus:outline-none w-full"
                id="formation"
                name="formation"
                type="formation"
                readOnly={true}
                disabled={true}
                value={formation.title}
              />
            </div>
            <form className="w-full flex flex-col gap-y-8 mt-8">
              <div className="flex flex-col gap-y-4">
                <label className="font-bold" htmlFor="title">
                  Titre du parcours *
                </label>
                <input
                  className={setInputStyle(title.hasError)}
                  id="title"
                  name="title"
                  type="text"
                  defaultValue={title.value}
                  onChange={title.valueChangeHandler}
                  onBlur={title.valueBlurHandler}
                  placeholder="Exemple: CDA - Promo 2023"
                />
              </div>

              <div className="flex flex-col gap-y-4">
                <label className="font-bold" htmlFor="level">
                  Description
                </label>
                <textarea
                  className={setAreaStyle(description.hasError)}
                  id="description"
                  name="description"
                  rows={3}
                  defaultValue={description.value}
                  onChange={description.textAreaChangeHandler}
                  onBlur={description.valueBlurHandler}
                />
              </div>

              <div className="flex flex-col gap-y-4">
                <label className="font-bold" htmlFor="level">
                  Niveau du parcours
                </label>
                <input
                  className="input input-sm input-bordered focus:outline-none w-full"
                  id="level"
                  name="level"
                  type="level"
                  readOnly={true}
                  disabled={true}
                  value={formation.level}
                />
              </div>
            </form>
          </>
        ) : null}
      </div>
    </>
  );
};

export default ParcoursInformationsForm;
