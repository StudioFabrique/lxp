/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useState } from "react";
import useInput from "../../../hooks/use-input";
import {
  regexGeneric,
  regexMail,
  regexNumber,
} from "../../../utils/constantes";
import Certifications from "./certifications/certifications";
import Graduation from "../../../utils/interfaces/graduation";
import CreateUserHeader from "../../create-user-header/create-user-header.component";
import Links from "../../UI/links/links";
import { Link } from "../../../utils/interfaces/link";
import Hobby from "../../../utils/interfaces/hobby";
import Informations from "./informations.component";
import Contact from "./contact.component";
import TypeUtilisateur from "./type-utilisateur.component";
import CentreInterets from "./centre-interets.component";
import Presentation from "./presentation.component";
import toast from "react-hot-toast";

const UserAddForm: FC<{
  user?: any;
  onSubmitForm: (user: any, file: File | null) => void;
  error: string;
  isLoading: boolean;
}> = (props) => {
  const [graduations, setGraduations] = useState<Array<Graduation>>([]);

  const [birthDate, setBirthDate] = useState<Date | null>(null);

  const [file, setFile] = useState<File | null>(null);

  const [links, setLinks] = useState<Array<Link>>([]);

  const [roleId, setRoleId] = useState<string | null>(null);

  const [hobbies, setHobbies] = useState<Array<Hobby>>([]);

  const { value: email } = useInput(
    (value: string) => regexMail.test(value),
    props.user?.email ?? "",
  );

  const { value: firstname } = useInput(
    (value: string) => regexGeneric.test(value),
    props.user?.firstname ?? "",
  );

  const { value: lastname } = useInput(
    (value: string) => regexGeneric.test(value),
    props.user?.lastname ?? "",
  );

  const { value: nickname } = useInput(
    (value: string) => regexGeneric.test(value),
    props.user?.nickname,
  );

  const { value: address } = useInput(
    (value: string) => regexGeneric.test(value),
    props.user?.address,
  );

  const { value: phone } = useInput(
    (value: string) => regexNumber.test(value),
    props.user?.phone,
  );

  const { value: postCode } = useInput(
    (value: string) => regexNumber.test(value),
    props.user?.postCode,
  );

  const { value: city } = useInput(
    (value: string) => regexGeneric.test(value),
    props.user?.city,
  );

  const { value: description } = useInput(
    (value: string) => regexGeneric.test(value),
    props.user?.description,
  );

  //  test la validité du form via le custom hook useInput
  let formIsValid = false;
  formIsValid =
    email.isValid && firstname.isValid && lastname.isValid && !!roleId?.length;

  const handleSubmit = () => {
    if (!formIsValid) {
      toast.error("le formulaire est incorrect");
      return;
    }
    const newUser = {
      email: email.value.trim(),
      firstname: firstname.value.trim(),
      lastname: lastname.value.trim(),
      description: description.value.trim(),
      nickname: nickname.value.trim(),
      address: address.value.trim(),
      postCode: postCode.value.trim(),
      city: city.value.trim(),
      phoneNumber: phone.value.trim(),
      birthDate,
      graduations,
      roleId,
      links,
      hobbies,
    };

    props.onSubmitForm(newUser, file);
  };

  return (
    <form className="flex flex-col gap-y-10" autoComplete="off">
      <CreateUserHeader onSubmit={handleSubmit} />
      <div className="flex flex-col gap-y-5">
        <div className="grid grid-cols-3 gap-x-5">
          <Informations
            lastname={lastname}
            firstname={firstname}
            email={email}
            nickname={nickname}
            onSetFile={setFile}
          />
          <Contact
            address={address}
            city={city}
            birthDate={birthDate}
            onChangeDate={setBirthDate}
            phone={phone}
            postCode={postCode}
          />
          <div className="grid grid-rows-1 gap-y-5">
            <TypeUtilisateur roleId={roleId} onSetRoleId={setRoleId} />
            <CentreInterets hobbies={hobbies} setHobbies={setHobbies} />
          </div>
        </div>
        <div>
          <Presentation description={description} />
        </div>
        <div className="grid grid-cols-3 gap-x-5">
          <div className="col-span-2">
            <Certifications
              graduations={graduations}
              setGraduations={setGraduations}
            />
          </div>
          <Links links={links} onSetLinks={setLinks} />
        </div>
      </div>
    </form>
  );
};

export default UserAddForm;
