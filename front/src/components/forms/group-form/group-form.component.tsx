/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, FormEvent, useEffect } from "react";

import Informations from "./components/informations.components";
import Details from "./components/details.component";
import Group from "../../../utils/interfaces/group";
import useGroupForm from "./use-group-form";
import FromParcoursWarning from "./components/from-parcours-warning";
import Header from "../../UI/header";
import { Link } from "react-router-dom";

const GroupForm: FC<{
  onSubmitForm: (data: any, file: File) => void;
  isLoading?: boolean;
  group?: Group;
  title?: string;
  isFileNotRequired?: boolean;
  gridType?: "cols" | "rows";
  hideCancelButton?: boolean;
  fromParcours?: string;
}> = (props) => {
  const {
    errors,
    onChangeValue,
    onSelectParcours,
    onSetFile,
    onSubmit,
    values,
    parcoursId,
  } = useGroupForm({
    onSubmitForm: props.onSubmitForm,
    group: props.group,
    isFileNotRequired: props.isFileNotRequired,
  });

  const handlePreventSubmitOnKey = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  useEffect(() => {
    if (props.fromParcours) {
      onSelectParcours(+props.fromParcours);
    }
  }, [props.fromParcours, onSelectParcours]);

  return (
    <form
      className="flex flex-col gap-y-10"
      autoComplete="off"
      onSubmit={handlePreventSubmitOnKey}
    >
      <Header
        title={props.group ? "Modifier un groupe" : "Créer un groupe"}
        description=""
      >
        <div className="flex gap-2">
          <Link
            to=".."
            type="button"
            className="btn btn-outline md:w-32 normal-case"
          >
            Annuler
          </Link>

          <button
            onClick={onSubmit}
            type="button"
            className="btn btn-primary text-neutral-content md:w-32 normal-case"
          >
            Sauvegarder
          </button>
        </div>
      </Header>

      <div
        className={`grid ${
          props.gridType === "rows" ? "grid-rows-2" : "grid-cols-2"
        } max-lg:grid-cols-1 gap-5`}
      >
        <Informations
          values={values}
          onChangeValue={onChangeValue}
          errors={errors}
          onSetFile={onSetFile}
        />
        {!props.fromParcours ? (
          <Details
            group={props.group}
            onSelectParcours={onSelectParcours}
            selectedParcoursId={parcoursId}
          />
        ) : (
          <FromParcoursWarning parcoursId={parcoursId!} />
        )}
      </div>
    </form>
  );
};

export default GroupForm;
