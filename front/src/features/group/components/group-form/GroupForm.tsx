import { FC, FormEvent, useEffect } from "react";

import Informations from "./GroupFormInformations";
import Details from "./GroupFormDetails";
import Group from "../../../../utils/interfaces/group";
import useGroupForm from "./useGroupForm";
import FromParcoursWarning from "./GroupFormParcoursWarning";
import Header from "../../../../../src/components/headers/Header";
import { Link } from "react-router";

const GroupForm: FC<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    register,
    errors,
    onSelectParcours,
    onSetFile,
    onSubmit,
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
            className="btn btn-primary md:w-32 normal-case"
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
          register={register}
          errors={errors}
          onSetFile={onSetFile}
          isLoading={props.isLoading}
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
