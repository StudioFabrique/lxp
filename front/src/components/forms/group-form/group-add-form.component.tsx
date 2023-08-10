import { FC, FormEvent, useState } from "react";

import { regexGeneric } from "../../../utils/constantes";
import useInput from "../../../hooks/use-input";
import Informations from "./components/informations.components";
import Details from "./components/details.component";
import GroupsHeader from "../../groups-header/groups-header.component";
import Tag from "../../../utils/interfaces/tag";
import GroupTags from "./components/group-tags.component";
import Dates from "./components/dates.component";
import Group from "../../../utils/interfaces/group";

const GroupAddForm: FC<{
  group?: any;
  onSubmitForm: (group: Group) => void;
  error: string;
  isLoading: boolean;
}> = (props) => {
  const [dates, setDates] = useState({ startDate: "", endDate: "" });
  const [tags, setTags] = useState<Tag[]>([]);

  const handleSubmitTags = (tags: Array<Tag>) => {
    setTags(tags);
  };
  const handleSubmitDates = (dates: { startDate: string; endDate: string }) => {
    setDates(dates);
  };

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
  formIsValid =
    name.isValid &&
    desc.isValid &&
    dates.startDate.length > 0 &&
    dates.endDate.length > 0 &&
    diplome.isValid &&
    promotion.isValid;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formIsValid) {
      props.onSubmitForm({
        name: name.value.trim(),
        desc: desc.value.trim(),
        rncp: rncp.value.trim(),
        promotion: promotion.value.trim(),
        startDate: dates.startDate,
        endDate: dates.endDate,
        tags: tags,
      });
    }
  };

  return (
    <form
      className="flex flex-col gap-y-10"
      onSubmit={handleSubmit}
      autoComplete="off"
    >
      <GroupsHeader />
      <div className="grid grid-cols-3 max-md:grid-cols-1 gap-x-5">
        <Informations name={name} diplome={diplome} rncp={rncp} />
        <div className="grid grid-row-2 max-md:mb-2 max-md:mt-2 gap-y-8">
          <GroupTags onSubmitTags={handleSubmitTags} />
          <Dates onSubmitDates={handleSubmitDates} />
        </div>
        <Details promotion={promotion} desc={desc} />
      </div>
    </form>
  );
};

export default GroupAddForm;
