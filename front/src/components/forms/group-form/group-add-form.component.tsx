import { FC, useState } from "react";
import { regexGeneric } from "../../../utils/constantes";
import useInput from "../../../hooks/use-input";
import Informations from "./components/informations.components";
import Details from "./components/details.component";
import GroupsHeader from "../../groups-header/groups-header.component";
import Tag from "../../../utils/interfaces/tag";
import GroupTags from "./components/group-tags.component";
import Dates from "./components/dates.component";

const GroupAddForm: FC<{
  group?: any;
  onSubmitForm: (group: any) => void;
  error: string;
  isLoading: boolean;
}> = (props) => {
  const [file, setFile] = useState<File | null>(null);
  const [parcoursId, setParcoursId] = useState<number | null>(null);
  const [formationId, setFormationId] = useState<number | null>(null);
  const [dates, setDates] = useState({ startDate: "", endDate: "" });
  const [tags, setTags] = useState<Tag[]>([]);
  const [isActive, setIsActive] = useState<boolean>(
    props.group?.isActive ?? false
  );

  const handleSetFile = (file: File) => {
    setFile(file);
  };

  const handleSelectParcours = (newParcoursId: number) => {
    setParcoursId(newParcoursId);
  };

  const handleSelectFormation = (newFormationId: number) => {
    setFormationId(newFormationId);
  };

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

  //  test la validité du form via le custom hook useInput
  let formIsValid = false;
  formIsValid =
    name.isValid &&
    desc.isValid &&
    dates.startDate.length > 0 &&
    dates.endDate.length > 0 &&
    file !== null &&
    parcoursId !== null &&
    isActive != null;

  const handleSubmit = () => {
    console.log("validitité formulaire : " + formIsValid);
    console.log(
      `name : ${name.value}, desc : ${desc.value}, startDate : ${dates.startDate}, endDate : ${dates.endDate}, parcours : ${parcoursId}, isActive : ${isActive}`
    );

    if (formIsValid) {
      props.onSubmitForm({
        groupRequest: {
          name: name.value.trim(),
          desc: desc.value.trim(),
          startDate: dates.startDate,
          endDate: dates.endDate,
          tags: tags,
          img: file,
        },
        parcoursId: parcoursId,
        formationId: formationId,
      });
    }
  };

  return (
    <form className="flex flex-col gap-y-10" autoComplete="off">
      <GroupsHeader onSubmit={handleSubmit} />
      <div className="grid grid-cols-3 max-md:grid-cols-1 gap-x-5">
        <Informations
          name={name}
          desc={desc}
          isActive={isActive}
          setIsActive={setIsActive}
          onSetFile={handleSetFile}
        />
        <Details
          onSelectFormation={handleSelectFormation}
          onSelectParcours={handleSelectParcours}
        />
        <div className="grid grid-row-2 max-md:mb-2 max-md:mt-2 gap-y-8">
          <GroupTags onSubmitTags={handleSubmitTags} />
          <Dates onSubmitDates={handleSubmitDates} />
        </div>
      </div>
    </form>
  );
};

export default GroupAddForm;
