/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useState } from "react";
import toast from "react-hot-toast";

import Informations from "./components/informations.components";
import Details from "./components/details.component";
import GroupsHeader from "../../groups-header/groups-header.component";
import useForm from "../../UI/forms/hooks/use-form";
import { createGroupSchema } from "../../../lib/validation/create-group-schema";
import { validationErrors } from "../../../helpers/validate";

const GroupForm: FC<{
  onSubmitForm: (data: any, file: File) => void;
  isLoading?: boolean;
  group?: any;
  title?: string;
  gridType?: "cols" | "rows";
  hideCancelButton?: boolean;
}> = (props) => {
  const [file, setFile] = useState<File | null>(null);
  const [parcoursId, setParcoursId] = useState<number | null>(null);
  /* const [tags, setTags] = useState<Tag[]>([]); */
  const [isActive, setIsActive] = useState<boolean>(
    props.group?.isActive ?? false
  );

  const { values, errors, onChangeValue, onValidationErrors } = useForm();

  const handleSetFile = (file: File) => {
    setFile(file);
  };

  const handleSelectParcours = (newParcoursId: number) => {
    setParcoursId(newParcoursId);
  };

  /* const handleSubmitTags = (tags: Array<Tag>) => {
    setTags(tags);
  }; */

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
    const name = values.name;
    const desc = values.desc;
    try {
      createGroupSchema.parse({
        name,
        desc,
      });
    } catch (error: any) {
      console.log(error);
      const newErrors = validationErrors(error);
      toast.error(newErrors[0].message);
      onValidationErrors(newErrors);
      return;
    }
    if (file) {
      props.onSubmitForm(
        {
          group: {
            name: name,
            desc: desc,
            /* tags: tags, */
          },
          parcoursId: parcoursId,
        },
        file!
      );
    } else {
      toast.error("Un fichier image pour le groupe est requis");
    }
  };

  return (
    <form className="flex flex-col gap-y-10" autoComplete="off">
      <GroupsHeader
        onSubmit={handleSubmit}
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
          onSetFile={handleSetFile}
        />
        <Details onSelectParcours={handleSelectParcours} />
        {/* à rétablir dès que le bug est corrigé */}
        {/* <div className="max-md:mb-2 max-md:mt-2 gap-y-8">
          <GroupTags onSubmitTags={handleSubmitTags} />
        </div> */}
      </div>
    </form>
  );
};

export default GroupForm;
