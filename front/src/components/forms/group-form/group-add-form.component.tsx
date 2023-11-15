/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useState } from "react";
import { regexGeneric } from "../../../utils/constantes";
import useInput from "../../../hooks/use-input";
import Informations from "./components/informations.components";
import Details from "./components/details.component";
import GroupsHeader from "../../groups-header/groups-header.component";
import Tag from "../../../utils/interfaces/tag";
import GroupTags from "./components/group-tags.component";
import toast from "react-hot-toast";

const GroupAddForm: FC<{
  group?: any;
  onSubmitForm: (data: any, file: File) => void;
  isLoading: boolean;
}> = (props) => {
  const [file, setFile] = useState<File | null>(null);
  const [parcoursId, setParcoursId] = useState<number | null>(null);
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

  const handleSubmitTags = (tags: Array<Tag>) => {
    setTags(tags);
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
    name.isValid && desc.isValid && file !== null && isActive != null;

  const handleSubmit = () => {
    if (formIsValid) {
      props.onSubmitForm(
        {
          group: {
            name: name.value.trim(),
            desc: desc.value.trim(),
            tags: tags,
          },
          parcoursId: parcoursId,
        },
        file!
      );
    } else {
      toast.error("Le formulaire n'est pas valide");
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
        <Details onSelectParcours={handleSelectParcours} />
        <div className="max-md:mb-2 max-md:mt-2 gap-y-8">
          <GroupTags onSubmitTags={handleSubmitTags} />
        </div>
      </div>
    </form>
  );
};

export default GroupAddForm;
