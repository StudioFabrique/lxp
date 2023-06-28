import { FC, FormEvent, useState } from "react";
import { regexGeneric } from "../../../utils/constantes";
import useInput from "../../../hooks/use-input";
import Informations from "./components/informations.components";
import Details from "./components/details.component";
import GroupUserList from "../../lists/group-user-list/group-user-list.component";
import Tags from "../../UI/tags/tags.component";
import Tag from "../../../utils/interfaces/tag";
import DatesSelecter from "../../UI/dates-selecter/dates-selecter.component";
import ParcoursHeader from "../../groups-header/groups-header.component";

const GroupAddForm: FC<{
  group?: any;
  onSubmitForm: (group: any) => void;
  error: string;
  isLoading: boolean;
}> = (props) => {
  const [usersToAdd, setUsersToAdd] = useState<String[]>([]);

  const handleSubmitTags = (tags: Tag[]) => {};
  const handleSubmitDates = (dates: {
    startDate: string;
    endDate: string;
  }) => {};

  const { value: name } = useInput(
    (value: string) => regexGeneric.test(value),
    props.group?.name ?? ""
  );

  const { value: desc } = useInput(
    (value: string) => regexGeneric.test(value),
    props.group?.desc ?? ""
  );

  const { value: diplome } = useInput(
    (value: string) => regexGeneric.test(value),
    props.group?.diplome ?? ""
  );

  const { value: rncp } = useInput(
    (value: string) => regexGeneric.test(value),
    props.group?.rncp ?? ""
  );

  const { value: promotion } = useInput(
    (value: string) => regexGeneric.test(value),
    props.group?.promotion ?? ""
  );

  //  test la validité du form via le custom hook useInput
  let formIsValid = false;
  formIsValid = name.isValid && desc.isValid;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formIsValid) {
      props.onSubmitForm({
        name: name.value.trim(),
        desc: desc.value.trim(),
        diplome: diplome.value.trim(),
        rncp: rncp.value.trim(),
        promotion: promotion.value.trim(),
        users: usersToAdd,
      });
    }
  };

  return (
    <form
      className="flex flex-col gap-y-10"
      onSubmit={handleSubmit}
      autoComplete="off"
    >
      <ParcoursHeader />
      <div className="grid grid-cols-3 max-md:grid-cols-1 gap-x-5">
        <Informations name={name} diplome={diplome} rncp={rncp} />
        <div className="grid grid-row-2 max-md:mb-2 max-md:mt-2 gap-y-2">
          <DatesSelecter onSubmitDates={handleSubmitDates} />
          <Tags onSubmitTags={handleSubmitTags} />
        </div>
        <Details promotion={promotion} desc={desc} />
      </div>
      <GroupUserList users={[]} onSubmitSetUsersToAdd={setUsersToAdd} />
    </form>
  );
};

export default GroupAddForm;
