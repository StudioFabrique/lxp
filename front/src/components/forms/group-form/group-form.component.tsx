/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC } from "react";

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
}> = (props) => {
  const {
    errors,
    onChangeValue,
    onSelectParcours,
    onSetFile,
    onSubmit,
    setIsActive,
    values,
    isActive,
  } = useGroupForm({
    onSubmitForm: props.onSubmitForm,
    group: props.group,
    isFileNotRequired: props.isFileNotRequired,
  });

  return (
    <form className="flex flex-col gap-y-10" autoComplete="off">
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
          isActive={isActive}
          setIsActive={setIsActive}
          onSetFile={onSetFile}
        />
        <Details group={props.group} onSelectParcours={onSelectParcours} />
      </div>
    </form>
  );
};

export default GroupForm;
