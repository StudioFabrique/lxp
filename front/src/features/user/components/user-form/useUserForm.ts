import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type User from "../../../../utils/interfaces/user";
import { userFormSchema, type UserFormValues } from "../../user.schema";
import { useFormField } from "../../../../components/form/useFormField";

const defaults = (user: User | null, invitationSent: boolean): UserFormValues => ({
  email: user?.email ?? "", firstname: user?.firstname ?? "", lastname: user?.lastname ?? "",
  nickname: user?.nickname ?? "", address: user?.address ?? "", city: user?.city ?? "",
  postCode: user?.postCode ?? "", phoneNumber: user?.phoneNumber ?? "", description: user?.description ?? "",
  birthDate: user?.birthDate ? new Date(user.birthDate) : null, graduations: user?.graduations ?? [],
  links: user?.links ?? [], hobbies: user?.hobbies ?? [], roleId: user?.roles?.[0]?._id ?? null, invitationSent,
});

export function useUserForm(user: User | null, initialSendEmail = false) {
  const form = useForm<UserFormValues>({ resolver: zodResolver(userFormSchema), defaultValues: defaults(user, initialSendEmail), mode: "onChange" });
  const { reset } = form;
  const [file, setFile] = useState<File | null>(null);
  const [emailValidationRequested, setEmailValidationRequested] = useState(false);
  useEffect(() => { reset(defaults(user, initialSendEmail)); setEmailValidationRequested(false); }, [user, initialSendEmail, reset]);
  const [email, setEmail] = useFormField(form, "email");
  const [firstname, setFirstname] = useFormField(form, "firstname");
  const [lastname, setLastname] = useFormField(form, "lastname");
  const [nickname, setNickname] = useFormField(form, "nickname");
  const [address, setAddress] = useFormField(form, "address");
  const [city, setCity] = useFormField(form, "city");
  const [postCode, setPostCode] = useFormField(form, "postCode");
  const [phoneNumber, setPhoneNumber] = useFormField(form, "phoneNumber");
  const [description, setDescription] = useFormField(form, "description");
  const [birthDate, setBirthDate] = useFormField(form, "birthDate");
  const [graduations, setGraduations] = useFormField(form, "graduations");
  const [links, setLinks] = useFormField(form, "links");
  const [hobbies, setHobbies] = useFormField(form, "hobbies");
  const [roleId, setRoleId] = useFormField(form, "roleId");
  const [sendEmail, setSendEmail] = useFormField(form, "invitationSent");
  const parsed = userFormSchema.safeParse(form.watch());
  const invalid = (field: keyof UserFormValues) => !parsed.success && parsed.error.issues.some((issue) => issue.path[0] === field);
  return {
    form, email, setEmail: (value: string) => { setEmail(value); setEmailValidationRequested(false); },
    emailError: emailValidationRequested && invalid("email"), validateEmail: () => setEmailValidationRequested(true),
    firstname, setFirstname, firstnameError: Boolean(firstname) && invalid("firstname"),
    lastname, setLastname, lastnameError: Boolean(lastname) && invalid("lastname"),
    nickname, setNickname, nicknameError: Boolean(nickname) && invalid("nickname"),
    address, setAddress, addressError: Boolean(address) && invalid("address"),
    city, setCity, cityError: Boolean(city) && invalid("city"),
    postCode, setPostCode, postCodeError: Boolean(postCode) && invalid("postCode"),
    phoneNumber, setPhoneNumber, phoneError: Boolean(phoneNumber) && invalid("phoneNumber"),
    description, setDescription, birthDate, setBirthDate, file, setFile, graduations, setGraduations,
    links, setLinks, hobbies, setHobbies, roleId, setRoleId, sendEmail, setSendEmail,
    formIsValid: parsed.success,
    buildUserData: () => userFormSchema.parse(form.getValues()),
  };
}
