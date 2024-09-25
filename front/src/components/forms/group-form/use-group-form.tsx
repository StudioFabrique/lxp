import { useEffect, useState } from "react";
import useForm from "../../UI/forms/hooks/use-form";
import { validationErrors } from "../../../helpers/validate";
import { createGroupSchema } from "../../../lib/validation/create-group-schema";
import toast from "react-hot-toast";
import Group from "../../../utils/interfaces/group";

function useGroupForm({
  onSubmitForm,
  group,
  isFileNotRequired,
}: {
  onSubmitForm: (data: any, file: File) => void;
  group?: Group;
  isFileNotRequired?: boolean;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [parcoursId, setParcoursId] = useState<number | null>(null);
  /* const [tags, setTags] = useState<Tag[]>([]); */
  const [isActive, setIsActive] = useState<boolean>(false);

  const { values, errors, onChangeValue, onValidationErrors, initValues } =
    useForm();

  const handleSetFile = (file: File) => {
    setFile(file);
  };

  const handleSelectParcours = (newParcoursId: number) => {
    setParcoursId(newParcoursId);
  };

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
    if (isFileNotRequired || file) {
      onSubmitForm(
        {
          group: {
            _id: group?._id,
            name: name,
            desc: desc,
            isActive: isActive,
          },
          parcoursId: parcoursId,
        },
        file!,
      );
    } else {
      toast.error("Un fichier image pour le groupe est requis");
    }
  };

  useEffect(() => {
    if (group) {
      initValues(group);
      setIsActive(group.isActive ?? false);
    }
  }, [initValues, group]);

  return {
    onSubmit: handleSubmit,
    onChangeValue: onChangeValue,
    setIsActive,
    onSetFile: handleSetFile,
    values,
    errors,
    onSelectParcours: handleSelectParcours,
    isActive,
  };
}

export default useGroupForm;
