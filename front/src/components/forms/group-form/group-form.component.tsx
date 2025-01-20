/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, FormEvent, useEffect } from "react";

import Informations from "./components/informations.components";
import Details from "./components/details.component";
import GroupsHeader from "../../groups-header/groups-header.component";
import Group from "../../../utils/interfaces/group";
import useGroupForm from "./use-group-form";

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
      <GroupsHeader
        onSubmit={onSubmit}
        title={props.title}
        hideCancelButton={props.hideCancelButton}
      />
      <div
        className={`grid ${
          props.gridType === "rows" ? "grid-rows-2" : "grid-cols-2"
        } max-md:grid-cols-1 gap-5`}
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
          <div className="h-full flex items-center justify-center">
            <p className="text-info">
              Le groupe sera automatiquement attaché au parcours de formation
              que vous étiez en train de créer.
            </p>
          </div>
        )}
      </div>
    </form>
  );
};

export default GroupForm;
