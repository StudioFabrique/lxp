import {
  Dispatch,
  FC,
  FormEvent,
  FormEventHandler,
  Ref,
  SetStateAction,
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
  sendRequestInTab: any;
  formRef: Ref<HTMLFormElement>;
}> = ({ editMode, setEditMode, sendRequestInTab, formRef }) => {
  const { sendRequest, isLoading } = useHttp(true);

  const {
    initValues,
    onValidationErrors,
    ...formProps /* ...formProps prend le reste des valeurs de useForm non utilisées */
  } = useForm();

  const [userData, setUserData] = useState<UserInformation | undefined>();

  const firstInputRef: Ref<HTMLInputElement> = useRef(null);

  const handleSubmitForm: FormEventHandler = (e: FormEvent) => {
    const applyData = (data: any) => {
      setUserData(data.data);
      setEditMode(false);
      toast.success("Formulaire envoyé avec succès !");
    };

    e.preventDefault();

    try {
      informationSchema.parse(formProps.values);
      sendRequestInTab(
        {
          path: `/user/profile/information/${userData?._id}`,
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
    <form ref={formRef} onSubmit={handleSubmitForm}>
      <div className="grid grid-cols-2 gap-5">
        <Info
          formProps={formProps}
          editMode={editMode}
          firstInputRef={firstInputRef}
        />
        <Contact formProps={formProps} editMode={editMode} />
      </div>
      <Presentation formProps={formProps} editMode={editMode} />
      <Hobbies hobbies={userData?.hobbies ?? []} />
      <SocialNetworks links={userData?.links ?? []} />
    </form>
  );
};

export default Information;
