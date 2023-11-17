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
import useForm from "../../UI/forms/hooks/use-form";
import { createGroupSchema } from "../../../lib/validation/create-group-schema";
import { validationErrors } from "../../../helpers/validate";

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

  const { values, errors, onChangeValue, onValidationErrors, onResetForm } =
    useForm();

  const handleSetFile = (file: File) => {
    setFile(file);
  };

  const handleSelectParcours = (newParcoursId: number) => {
    setParcoursId(newParcoursId);
  };

  const handleSubmitTags = (tags: Array<Tag>) => {
    setTags(tags);
  };

  /*   const { value: name } = useInput(
    (value: string) => regexGeneric.test(value),
    props.group?.name ?? ""
  );

  const { value: desc } = useInput(
    (value: string) => regexGeneric.test(value),
    props.group?.desc ?? ""
  ); */

  /*   //  test la validité du form via le custom hook useInput
  let formIsValid = false;
  formIsValid =
    name.isValid && desc.isValid && file !== null && isActive != null; */

  const handleSubmit = () => {
    try {
      createGroupSchema.parse({
        name: values.name.trim(),
        des: values.desc.trim(),
      });
    } catch (error: any) {
      onValidationErrors(validationErrors(error));
    }
    props.onSubmitForm(
      {
        group: {
          name: values.name.trim(),
          desc: values.desc.trim(),
          tags: tags,
        },
        parcoursId: parcoursId,
      },
      file!
    );
  };

  return (
    <form className="flex flex-col gap-y-10" autoComplete="off">
      <GroupsHeader onSubmit={handleSubmit} />
      <div className="grid grid-cols-3 max-md:grid-cols-1 gap-x-5">
        <Informations
          values={values}
          onChangeValue={onChangeValue}
          errors={errors}
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
