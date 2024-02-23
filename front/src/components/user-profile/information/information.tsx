import {
  FC,
  FormEvent,
  FormEventHandler,
  Ref,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import Contact from "./contact";
import Hobbies from "./hobbies";
import Info from "./info";
import Presentation from "./presentation";
import SocialNetworks from "./social-networks";
import useForm from "../../UI/forms/hooks/use-form";
import { validationErrors } from "../../../helpers/validate";
import toast from "react-hot-toast";
import { informationSchema } from "../../../lib/validation/profile/info-schema";
import useHttp from "../../../hooks/use-http";
import Loader from "../../UI/loader";
import Hobby from "../../../utils/interfaces/hobby";
import { Link } from "../../../utils/interfaces/link";
import { Context } from "../../../store/context.store";
import { useLocation } from "react-router-dom";

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

const Information: FC<{
  formRef: Ref<HTMLFormElement>;
}> = ({ formRef }) => {
  const { handshake } = useContext(Context);
  const { sendRequest, isLoading } = useHttp(true);

  const { pathname } = useLocation();

  const currentRoute = pathname.split("/").slice(1) ?? [];

  const {
    initValues,
    onValidationErrors,
    ...formProps /* ...formProps prend le reste des valeurs de useForm non utilisées */
  } = useForm();

  const [userData, setUserData] = useState<UserInformation | undefined>();

  const [temporaryAvatar, setTemporaryAvatar] = useState<{
    file: File | null;
    url: string | null;
  }>({ file: null, url: null });

  const firstInputRef: Ref<HTMLInputElement> = useRef(null);

  const handleSubmitForm: FormEventHandler = (e: FormEvent) => {
    e.preventDefault();

    const applyData = (data: { data: UserInformation }) => {
      setUserData(data.data);
      toast.success("Formulaire envoyé avec succès !");
      handshake();
    };

    const formData = new FormData();
    if (temporaryAvatar.file) formData.append("image", temporaryAvatar.file);
    formData.append("data", JSON.stringify({ user: formProps.values }));

    try {
      informationSchema.parse(formProps.values);
      sendRequest(
        {
          path: `/user/profile/information`,
          method: "put",
          body: formData,
        },
        applyData
      );
    } catch (error) {
      const newErrors = validationErrors(error);
      toast.error(newErrors[0].message);
      onValidationErrors(newErrors);
    }
  };

  useEffect(() => {
    const applyData = (data: { message: string; data: UserInformation }) => {
      setUserData(data.data);
    };
    sendRequest({ path: "/user/profile/information" }, applyData);
  }, [sendRequest]);

  useEffect(() => {
    if (userData) {
      initValues(userData);
    }
  }, [initValues, userData]);

  if (isLoading) return <Loader />;

  return (
    <div className="flex flex-col gap-5">
      <form
        className="flex flex-col gap-5"
        ref={formRef}
        onSubmit={handleSubmitForm}
      >
        <div className="grid lg:grid-cols-2 gap-5">
          <Info
            formProps={formProps}
            firstInputRef={firstInputRef}
            temporaryAvatar={temporaryAvatar}
            setTemporaryAvatar={setTemporaryAvatar}
          />
          <Contact formProps={formProps} />
        </div>
      </form>
      <Presentation formProps={formProps} />
      {currentRoute[0] === "student" && (
        <>
          <Hobbies initHobbies={userData?.hobbies ?? []} />
          <SocialNetworks initLinks={userData?.links ?? []} />
        </>
      )}
    </div>
  );
};

export default Information;
