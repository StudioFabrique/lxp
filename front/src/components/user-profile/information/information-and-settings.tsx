import {
  FC,
  FormEventHandler,
  Ref,
  useEffect,
  useRef,
  useState,
  useContext,
} from "react";
import Info from "./info";
import Contact from "./contact";
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

import { darkThemes, lightThemes } from "../../../config/themes";
import { Context } from "../../../store/context.store";
import Wrapper from "../../UI/wrapper/wrapper.component";
import Can from "../../UI/can/can.component";
import CompanyPictureUpload from "../../profile-home/company-picture-upload";
import ThemeSelect from "../../profile-home/theme-select";

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
  const { chooseTheme } = useContext(Context);
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

  const handleThemeChange = (newTheme: string, mode: string) => {
    chooseTheme(newTheme, mode);
  };

  if (isLoading) return <Loader />;

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmitForm}
      className="grid grid-cols-1 lg:grid-cols-2 gap-8"
    >
      {/* Colonne gauche — Infos du profil */}
      <div className="flex flex-col gap-6">
        <div className="flex gap-2">
          <Info
            formProps={formProps}
            firstInputRef={firstInputRef}
            temporaryAvatar={temporaryAvatar}
            setTemporaryAvatar={setTemporaryAvatar}
          />
          <Contact formProps={formProps} />
        </div>
        {style?.showStudentElements && (
          <>
            <Presentation formProps={formProps} />
            <Hobbies initHobbies={userData?.hobbies ?? []} />
            <SocialNetworks initLinks={userData?.links ?? []} />
          </>
        )}
      </div>

      {/* Colonne droite — Thèmes & préférences */}
      <div className="flex flex-col gap-6">
        <section className="card bg-base-200 shadow-md hover:shadow-lg transition-all duration-300">
          <div className="card-body flex flex-col gap-4 p-6 rounded-lg">
            <h2 className="text-lg font-semibold">Préférences</h2>

            <Wrapper>
              <ThemeSelect
                label="Thème clair"
                themesList={lightThemes}
                onThemeChange={handleThemeChange}
              />
            </Wrapper>
            <Wrapper>
              <ThemeSelect
                label="Thème sombre"
                themesList={darkThemes}
                onThemeChange={handleThemeChange}
              />
            </Wrapper>

            <Can action="component" object="company-picture-upload">
              <CompanyPictureUpload />
            </Can>
          </div>
        </section>
      </div>
    </form>
  );
};

export default InformationAndSettings;
