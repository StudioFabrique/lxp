import {
  Dispatch,
  FC,
  FormEvent,
  FormEventHandler,
  Ref,
  SetStateAction,
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
  editMode: boolean;
  setEditMode: Dispatch<SetStateAction<boolean>>;
  formRef: Ref<HTMLFormElement>;
}> = ({ editMode, setEditMode, formRef }) => {
  const { handshake } = useContext(Context);
  const { sendRequest, isLoading } = useHttp(true);

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

  const handleSubmitAvatar = () => {
    if (temporaryAvatar.file) {
      const formData = new FormData();
      formData.append("image", temporaryAvatar.file);

      sendRequest({
        path: `/user/profile/avatar`,
        method: "put",
        body: formData,
      });
    }
  };

  const handleSubmitForm: FormEventHandler = (e: FormEvent) => {
    e.preventDefault();

    const applyData = (data: { data: UserInformation }) => {
      setUserData(data.data);
      setEditMode(false);
      toast.success("Formulaire envoyé avec succès !");
      handshake();
    };

    try {
      informationSchema.parse(formProps.values);
      sendRequest(
        {
          path: `/user/profile/information`,
          method: "put",
          body: { user: formProps.values },
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

  useEffect(() => {
    if (editMode) {
      setTimeout(() => firstInputRef.current?.focus(), 100);
    }
  }, [editMode]);

  if (isLoading) return <Loader />;

  return (
    <div className="flex flex-col gap-5">
      <form
        className="flex flex-col gap-5"
        ref={formRef}
        onSubmit={handleSubmitForm}
      >
        <div className="grid grid-cols-2 gap-5">
          <Info
            formProps={formProps}
            editMode={editMode}
            firstInputRef={firstInputRef}
            temporaryAvatar={temporaryAvatar}
            setTemporaryAvatar={setTemporaryAvatar}
          />
          <Contact formProps={formProps} editMode={editMode} />
        </div>
      </form>
      <Presentation formProps={formProps} editMode={editMode} />
      <Hobbies initHobbies={userData?.hobbies ?? []} editMode={editMode} />
      <SocialNetworks initLinks={userData?.links ?? []} editMode={editMode} />
    </div>
  );
};

export default Information;
