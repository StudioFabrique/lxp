import { useFormField } from "../../../../components/form/useFormField";
import { FC, Ref, useEffect, useState } from "react";
import Info from "./info";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { profileInformationSchema } from "../../schemas/info-schema";
import { profileApi } from "../../api/profile.api";
import Loader from "../../../../components/loaders/Loader";
import ProfileItemsEditor from "./ProfileItemsEditor";
import type Hobby from "../../../user/interfaces/hobby";
import type { Link } from "../../../user/interfaces/link";
import type { z } from "zod";

type UserInformation = {
  _id: string;
  firstname: string;
  lastname: string;
  nickname?: string;
  email: string;
  address: string;
  city: string;
  postCode?: string;
  phoneNumber?: string;
  hobbies?: Hobby[];
  links?: Link[];
};

const InformationAndSettings: FC<{
  formRef: Ref<HTMLFormElement>;
  onSaved?: () => void;
  onDirtyChange?: (dirty: boolean) => void;
  isStudent?: boolean;
}> = ({ formRef, onSaved, onDirtyChange, isStudent = false }) => {
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm({
    resolver: zodResolver(profileInformationSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      nickname: "",
      email: "",
      address: "",
      city: "",
      postCode: "",
      phoneNumber: "",
      hobbies: [] as Hobby[],
      links: [] as Link[],
    },
  });
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting },
    reset,
  } = form;
  const [hobbies, setHobbies] = useFormField(form, "hobbies");
  const [links, setLinks] = useFormField(form, "links");

  const [userData, setUserData] = useState<UserInformation>();
  const onSubmit = async (data: z.infer<typeof profileInformationSchema>) => {
    if (isSubmitting) return;
    const formData = new FormData();
    formData.append("data", JSON.stringify({ user: data }));

    await profileApi.mutations
      .updateInformation(formData)
      .then((response) => {
        toast.success(
          response.emailChangeRequested
            ? "Profil sauvegardé. Consultez votre nouvelle adresse pour valider l'email."
            : "Profil sauvegardé avec succès !",
        );
        onSaved?.();
        reset(data);
      })
      .catch((err) => {
        const errorMessage = err?.response?.data?.message ?? "Erreur inconnue";
        toast.error(errorMessage);
      });
  };

  useEffect(() => {
    profileApi.queries
      .getInformation()
      .then((data) => setUserData(data.data))
      .catch((err) => {
        const errorMessage = err?.response?.data?.message ?? "Erreur inconnue";
        toast.error(errorMessage);
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (userData) {
      reset({
        firstname: userData.firstname,
        lastname: userData.lastname,
        nickname: userData.nickname ?? "",
        email: userData.email,
        address: userData.address ?? "",
        city: userData.city ?? "",
        postCode: userData.postCode ?? "",
        phoneNumber: userData.phoneNumber ?? "",
        hobbies: userData.hobbies ?? [],
        links: userData.links ?? [],
      });
    }
  }, [userData, reset]);

  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  if (isLoading) return <Loader />;

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit(onSubmit, (errs) => {
        const firstError = Object.values(errs)[0];
        if (firstError?.message) toast.error(firstError.message);
      })}
    >
      <Info formProps={{ register, errors }} />
      {isStudent && (
        <ProfileItemsEditor
          hobbies={hobbies}
          links={links}
          onHobbiesChange={(items) => {
            setHobbies(items);
          }}
          onLinksChange={(items) => {
            setLinks(items);
          }}
        />
      )}
    </form>
  );
};

export default InformationAndSettings;
