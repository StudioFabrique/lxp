import { useEffect, useState } from "react";
import type User from "../../../../utils/interfaces/user";
import type Graduation from "../../interfaces/graduation";
import type { Link as LinkI } from "../../interfaces/link";
import type Hobby from "../../interfaces/hobby";
import { regexGeneric, regexMail, regexNumber } from "../../../../config/constantes";

export function useUserForm(user: User | null, initialSendEmail = false) {
  const [email, setEmail] = useState(user?.email ?? "");
  const [emailTouched, setEmailTouched] = useState(false);
  const [firstname, setFirstname] = useState(user?.firstname ?? "");
  const [lastname, setLastname] = useState(user?.lastname ?? "");
  const [nickname, setNickname] = useState(user?.nickname ?? "");
  const [address, setAddress] = useState(user?.address ?? "");
  const [city, setCity] = useState(user?.city ?? "");
  const [postCode, setPostCode] = useState(user?.postCode ?? "");
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber ?? "");
  const [description, setDescription] = useState(user?.description ?? "");
  const [birthDate, setBirthDate] = useState<Date | null>(user?.birthDate ?? null);
  const [file, setFile] = useState<File | null>(null);
  const [graduations, setGraduations] = useState<Array<Graduation>>([]);
  const [links, setLinks] = useState<Array<LinkI>>([]);
  const [hobbies, setHobbies] = useState<Array<Hobby>>([]);
  const [roleId, setRoleId] = useState<string | null>(null);
  const [sendEmail, setSendEmail] = useState(initialSendEmail);

  useEffect(() => {
    if (user) {
      setEmail(user.email ?? "");
      setEmailTouched(false);
      setFirstname(user.firstname ?? "");
      setLastname(user.lastname ?? "");
      setNickname(user.nickname ?? "");
      setAddress(user.address ?? "");
      setCity(user.city ?? "");
      setPostCode(user.postCode ?? "");
      setPhoneNumber(user.phoneNumber ?? "");
      setDescription(user.description ?? "");
      setBirthDate(user.birthDate ?? null);
      setGraduations(user.graduations ?? []);
      setRoleId(user.roles?.[0]?._id ?? null);
      setHobbies(user.hobbies ?? []);
      setLinks(user.links ?? []);
    }
  }, [user]);

  const emailIsInvalid = email.length > 0 && !regexMail.test(email);
  const emailError = emailTouched && emailIsInvalid;
  const touchEmail = () => setEmailTouched(true);
  const firstnameError = firstname.length > 0 && !regexGeneric.test(firstname);
  const lastnameError = lastname.length > 0 && !regexGeneric.test(lastname);
  const nicknameError = nickname.length > 0 && !regexGeneric.test(nickname);
  const addressError = address.length > 0 && !regexGeneric.test(address);
  const cityError = city.length > 0 && !regexGeneric.test(city);
  const postCodeError = postCode.length > 0 && !regexNumber.test(postCode);
  const phoneError = phoneNumber.length > 0 && !regexNumber.test(phoneNumber);

  const formIsValid =
    email.length > 0 &&
    firstname.length > 0 &&
    lastname.length > 0 &&
    !emailIsInvalid &&
    !firstnameError &&
    !lastnameError;

  const buildUserData = () => ({
    email: email.trim(),
    firstname: firstname.trim(),
    lastname: lastname.trim(),
    description: description.trim(),
    nickname: nickname.trim(),
    address: address.trim(),
    postCode: postCode.trim(),
    city: city.trim(),
    invitationSent: sendEmail,
    phoneNumber: phoneNumber.trim(),
    birthDate,
    graduations,
    roleId,
    links,
    hobbies,
  });

  return {
    email, setEmail, emailError, touchEmail,
    firstname, setFirstname, firstnameError,
    lastname, setLastname, lastnameError,
    nickname, setNickname, nicknameError,
    address, setAddress, addressError,
    city, setCity, cityError,
    postCode, setPostCode, postCodeError,
    phoneNumber, setPhoneNumber, phoneError,
    description, setDescription,
    birthDate, setBirthDate,
    file, setFile,
    graduations, setGraduations,
    links, setLinks,
    hobbies, setHobbies,
    roleId, setRoleId,
    sendEmail, setSendEmail,
    formIsValid,
    buildUserData,
  };
}
