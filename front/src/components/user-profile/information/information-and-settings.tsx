import { FC, FormEventHandler, Ref, useEffect, useRef, useState } from "react";
import Info from "./info";
import Presentation from "./presentation";
import Hobbies from "./hobbies";
import SocialNetworks from "./social-networks";
import useForm from "../../UI/forms/hooks/use-form";
import { validationErrors } from "../../../helpers/validate";
import toast from "react-hot-toast";
import { informationSchema } from "../../../lib/validation/profile/info-schema";
import useHttp from "../../../hooks/use-http";
import Loader from "../../UI/loader";
import Hobby from "../../../utils/interfaces/hobby";
import { Link } from "../../../utils/interfaces/link";

import ThemeSelectSettings from "./theme-select-settings";

type UserInformation = {
  _id: string;
  firstname: string;
  lastname: string;
  nickname?: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
  description: string;
  hobbies?: Hobby[];
  links?: Link[];
};

const InformationAndSettings: FC<{
  formRef: Ref<HTMLFormElement>;
  style?: { showStudentElements?: boolean };
}> = ({ formRef, style }) => {
  const { sendRequest, isLoading } = useHttp(true);

  const { initValues, onValidationErrors, ...formProps } = useForm();

  const [userData, setUserData] = useState<UserInformation>();
  const [temporaryAvatar, setTemporaryAvatar] = useState<{
    file: File | null;
    url: string | null;
  }>({
    file: null,
    url: null,
  });
  const firstInputRef = useRef<HTMLInputElement>(null);

  const handleSubmitForm: FormEventHandler = (e) => {
    e.preventDefault();
    const formData = new FormData();
    if (temporaryAvatar.file) formData.append("image", temporaryAvatar.file);
    formData.append("data", JSON.stringify({ user: formProps.values }));

    try {
      informationSchema.parse(formProps.values);
      sendRequest(
        { path: "/user/profile/information", method: "put", body: formData },
        (data: { data: UserInformation }) => {
          setUserData(data.data);
          toast.success("Profil sauvegardé avec succès !");
        }
      );
    } catch (error) {
      const errs = validationErrors(error);
      toast.error(errs[0].message);
      onValidationErrors(errs);
    }
  };

  useEffect(() => {
    sendRequest(
      { path: "/user/profile/information" },
      (data: { data: UserInformation }) => setUserData(data.data)
    );
  }, [sendRequest]);

  useEffect(() => {
    if (userData) initValues(userData);
  }, [userData, initValues]);

  if (isLoading) return <Loader />;

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmitForm}
      className="flex flex-col gap-5"
    >
      {/* Colonne gauche — Infos du profil */}
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-2 gap-10">
          <div className="flex flex-col">
            <Info
              formProps={formProps}
              firstInputRef={firstInputRef}
              temporaryAvatar={temporaryAvatar}
              setTemporaryAvatar={setTemporaryAvatar}
            />
          </div>
          <div className="flex flex-col gap-5">
            <Presentation formProps={formProps} />
            {style?.showStudentElements && (
              <>
                <Hobbies initHobbies={userData?.hobbies ?? []} />
                <SocialNetworks initLinks={userData?.links ?? []} />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Colonne droite — Thèmes & préférences */}
      <ThemeSelectSettings />
    </form>
  );
};

export default InformationAndSettings;
