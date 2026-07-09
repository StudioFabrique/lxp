import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import Group from "../../../../../src/utils/interfaces/group";
import { createGroupSchema } from "../../group.schema";

type GroupFormData = {
  name: string;
  desc?: string;
};

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

  const {
    register,
    handleSubmit: rhfHandleSubmit,
    formState: { errors },
    reset,
  } = useForm<GroupFormData>({
    resolver: zodResolver(createGroupSchema),
    defaultValues: {
      name: "",
      desc: "",
    },
  });

  const handleSetFile = (file: File) => {
    setFile(file);
  };

  const handleSelectParcours = useCallback((newParcoursId: number) => {
    setParcoursId(newParcoursId);
  }, []);

  const handleFormSubmit = useCallback(
    (data: GroupFormData) => {
      if (isFileNotRequired || file) {
        onSubmitForm(
          {
            group: {
              _id: group?._id,
              name: data.name,
              desc: data.desc,
            },
            parcoursId: parcoursId,
          },
          file!,
        );
      } else {
        toast.error("Un fichier image pour le groupe est requis");
      }
    },
    [file, isFileNotRequired, onSubmitForm, group, parcoursId],
  );

  useEffect(() => {
    if (group) {
      reset({
        name: (group as any).name ?? "",
        desc: (group as any).desc ?? "",
      });
    }
  }, [group, reset]);

  return {
    onSubmit: rhfHandleSubmit(handleFormSubmit),
    onSetFile: handleSetFile,
    register,
    errors,
    parcoursId,
    onSelectParcours: handleSelectParcours,
  };
}

export default useGroupForm;
