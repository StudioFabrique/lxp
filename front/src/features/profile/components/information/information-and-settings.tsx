import { FC, Ref, useEffect, useState } from "react";
import Info from "./info";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { informationSchema } from "../../schemas/info-schema";
import { profileApi } from "../../api/profile.api";
import Loader from "../../../../components/loaders/Loader";
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
  hobbies?: Array<{ title: string }>;
  links?: Array<{ url: string }>;
};

const InformationAndSettings: FC<{
  formRef: Ref<HTMLFormElement>;
  onSaved?: () => void;
  onDirtyChange?: (dirty: boolean) => void;
  isStudent?: boolean;
}> = ({ formRef, onSaved, onDirtyChange, isStudent = false }) => {
  const [isLoading, setIsLoading] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm({
    resolver: zodResolver(informationSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      nickname: "",
      email: "",
      address: "",
      city: "",
      postCode: "",
      phoneNumber: "",
      passions: "",
      personalLinks: "",
    },
  });

  const [userData, setUserData] = useState<UserInformation>();
  const onSubmit = (data: z.infer<typeof informationSchema>) => {
    const formData = new FormData();
    const { passions, personalLinks, ...information } = data;
    formData.append("data", JSON.stringify({ user: isStudent ? {
      ...information,
      hobbies: (passions ?? "").split(",").map((title) => title.trim()).filter(Boolean).map((title) => ({ title })),
      links: (personalLinks ?? "").split(/[,\n]/).map((url) => url.trim()).filter((url) => /^https?:\/\//i.test(url)).map((url) => ({ url })),
    } : information }));

    profileApi.mutations
      .updateInformation(formData)
      .then((response) => {
        toast.success(
          response.emailChangeRequested
            ? "Profil sauvegardé. Consultez votre nouvelle adresse pour valider l'email."
            : "Profil sauvegardé avec succès !",
        );
        onSaved?.();
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
        passions: userData.hobbies?.map((item) => item.title).join(", ") ?? "",
        personalLinks: userData.links?.map((item) => item.url).join("\n") ?? "",
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
      <Info formProps={{ register, errors }} isStudent={isStudent} />
    </form>
  );
};

export default InformationAndSettings;
