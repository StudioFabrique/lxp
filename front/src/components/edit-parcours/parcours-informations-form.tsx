/* eslint-disable @typescript-eslint/no-explicit-any */

import { FC, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Toaster, toast } from "react-hot-toast";

import useHttp from "../../hooks/use-http";
import Formation from "../../utils/interfaces/formation";
import useInput from "../../hooks/use-input";
import { autoSubmitTimer } from "../../config/auto-submit-timer";
import { regexGeneric, regexOptionalGeneric } from "../../utils/constantes";
import { parcoursAction } from "../../store/redux-toolkit/parcours/parcours";
import { parcoursInformationsAction } from "../../store/redux-toolkit/parcours/parcours-informations";
import Selecter from "../UI/selecter/selecter.component";

type Props = {
  parcoursId?: string;
};

let notInitialState = false;

const ParcoursInformationsForm: FC<Props> = ({ parcoursId = "12" }) => {
  const formation = useSelector((state: any) => state.parcours.formation);
  const parcoursInfos = useSelector(
    (state: any) => state.parcoursInformations.infos
  );
  const [formations, setFormations] = useState<Array<Formation>>([]);
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

  /**
   * requête pour récupérer la liste des formations dans la bdd
   */
  useEffect(() => {
    const processData = (data: Array<Formation>) => {
      setFormations(data);
    };
    sendRequest(
      {
        path: "/formation",
      },
      processData
    );
  }, [sendRequest]);

  /**
   * gestion de la sélection d'une nouvelle formation et mise à jour du state global
   * @param id number
   */
  const handleFormation = (id: number) => {
    const form = formations.find((item) => item.id === id);
    if (form) {
      dispatch(parcoursAction.setParcoursFormation(form));
    }
  };

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
            formation: formation.id,
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
    if (notInitialState) {
      console.log("youhou");

      const setInfos = async () => {
        dispatch(
          parcoursInformationsAction.updateParcoursInfos({
            title: title.value,
            description: description.value,
          })
        );
        updateInfos();
      };
      const timer = setTimeout(() => {
        setInfos();
      }, autoSubmitTimer);
      return () => {
        clearTimeout(timer);
      };
    }
    notInitialState = true;
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
      <Toaster />
      <div>
        {formation && formations.length > 0 ? (
          <>
            <div className="flex flex-col gap-y-4">
              {/* menu déroulant pour modifier la formation à laquelle est rattaché le parcours */}
              <h2 className="font-bold">Formation</h2>
              <Selecter
                onSelectItem={handleFormation}
                list={formations.map((item) => ({
                  id: item.id!,
                  title: item.title,
                }))}
                title="Sélectionner une formation"
                formation={{ id: formation.id, title: formation.title }}
              />
            </div>
            <form className="w-full flex flex-col gap-y-8 mt-8">
              <div className="flex flex-col gap-y-4">
                <label className="font-bold" htmlFor="title">
                  Titre du parcours
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
                  rows={5}
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
                  value={formation.level}
                  disabled={true}
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
