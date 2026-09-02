import { useEffect } from "react";
import { Link } from "react-router";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import type User from "../../../../utils/interfaces/user";
import { useUserForm } from "./useUserForm";
import UserFormInformations from "./UserFormInformations";
import UserFormContact from "./UserFormContact";
import UserFormTypeUser from "./UserFormTypeUser";
import UserFormPresentation from "./UserFormPresentation";
import UserFormCertifications from "./UserFormCertifications";
import Header from "../../../../../src/components/headers/Header";
import ItemsAdder from "../../../../../src/components/UI/items-adder";
import { regexGeneric } from "../../../../config/constantes";
import { transformLink, urlIsValid } from "../../helpers/link-transform";

type Props = {
  user?: User | null;
  onSubmitForm: (userData: Record<string, unknown>, file: File | null) => void;
  /** Message global de l'échec de soumission, signalé en toast. */
  error?: string;
  /**
   * Adresse refusée par le serveur et motif du refus. Le toast disparaît, le
   * formulaire reste : sans repère sur le champ, rien n'indique quoi corriger.
   * L'adresse est conservée pour ne plus afficher le message dès que la saisie
   * change — le refus ne porterait alors plus sur rien.
   */
  emailConflict?: { email: string; message: string };
  isLoading?: boolean;
  fieldsDisabled?: boolean;
  editMode?: boolean;
  initialRoleRank?: number;
  cancelTo?: string;
};

const UserForm = ({
  user = null,
  onSubmitForm,
  error,
  emailConflict,
  isLoading = false,
  fieldsDisabled = false,
  editMode = false,
  initialRoleRank,
  cancelTo,
}: Props) => {
  const {
    email, setEmail, emailError,
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
  } = useUserForm(user);

  useEffect(() => {
    if (error && error.length > 0) {
      toast.error(error);
    }
  }, [error]);

  const emailIsRefused =
    emailConflict !== undefined &&
    email.trim().toLowerCase() === emailConflict.email.trim().toLowerCase();

  const emailMessage = emailError
    ? "Le format de l'adresse email n'est pas valide."
    : emailIsRefused
      ? emailConflict.message
      : null;

  const handleSubmit = () => {
    if (!formIsValid) {
      toast.error("Certains champs du formulaire sont manquants ou mal remplis.");
      return;
    }
    if (!roleId || roleId.length < 1) {
      toast.error("Veuillez choisir un rôle svp ...");
      return;
    }
    onSubmitForm(buildUserData(), file);
  };

  const disabled = fieldsDisabled || isLoading;

  return (
    <form className="flex flex-col gap-y-8" autoComplete="off">
      <Header
        title={editMode ? "Modifier un utilisateur" : "Créer un utilisateur"}
        description={
          editMode
            ? "Modifiez les informations de l'utilisateur."
            : "Renseignez les informations du nouvel utilisateur."
        }
      >
        <Link
          to={cancelTo ?? ".."}
          className="btn btn-outline md:w-32 normal-case mr-4"
        >
          Annuler
        </Link>
        <button
          onClick={handleSubmit}
          type="button"
          className="btn btn-primary normal-case"
          disabled={disabled}
        >
          {isLoading ? (
            <span className="flex items-center gap-x-2">
              <Loader2 className="animate-spin mr-2 h-4 w-4" />
              <p>Sauvegarde en cours...</p>
            </span>
          ) : (
            "Sauvegarder"
          )}
        </button>
      </Header>
      <div className="flex flex-col gap-y-5">
        <div className="grid grid-cols-3 gap-x-5">
          <UserFormInformations
            lastname={lastname} lastnameError={lastnameError} onLastname={setLastname}
            firstname={firstname} firstnameError={firstnameError} onFirstname={setFirstname}
            nickname={nickname} nicknameError={nicknameError} onNickname={setNickname}
            email={email}
            emailError={emailError || emailIsRefused}
            emailMessage={emailMessage}
            onEmail={setEmail}
            onSetFile={setFile}
            disabled={disabled}
          />
          <UserFormContact
            address={address} addressError={addressError} onAddress={setAddress}
            city={city} cityError={cityError} onCity={setCity}
            postCode={postCode} postCodeError={postCodeError} onPostCode={setPostCode}
            phone={phoneNumber} phoneError={phoneError} onPhone={setPhoneNumber}
            birthDate={birthDate} onChangeDate={setBirthDate}
            disabled={disabled}
          />
          <div className="grid grid-rows-1 gap-y-5">
            <UserFormTypeUser
              roleId={roleId}
              sendEmail={sendEmail}
              onSetSendEmail={setSendEmail}
              onSetRoleId={setRoleId}
              initialRoleRank={initialRoleRank ?? user?.roles?.[0]?.rank}
              editMode={editMode}
              disabled={disabled}
            />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-x-5">
          <ItemsAdder
            styleOptions={{
              label: "Centre d'intérêts",
              placeholder: "Ajouter un nouveau centre d'intérêt",
              itemsHasColor: true,
            }}
            items={hobbies}
            disabled={disabled}
            getValue={(item) => item.title}
            onValidate={(value) => {
              if (!(value.length > 0)) throw new Error("Le centre d'intérêt est vide");
              if (hobbies.some((hobby) => hobby.title === value))
                throw new Error(`Le centre d'intérêt '${value}' existe déjà`);
              if (!regexGeneric.test(value)) throw new Error("La valeur est incorrecte");
            }}
            onAddItem={async (value) => {
              setHobbies((hobbies) => [...hobbies, { title: value }]);
              return true;
            }}
            onDelete={async (item) => {
              setHobbies((hobbies) => hobbies.filter((hobby) => hobby.title !== item.title));
              return true;
            }}
          />
          <div className="col-span-2">
            <UserFormPresentation
              description={description}
              onDescription={setDescription}
              disabled={disabled}
            />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-x-5">
          <div className="col-span-2">
            <UserFormCertifications
              graduations={graduations}
              setGraduations={setGraduations}
              disabled={disabled}
            />
          </div>
          <ItemsAdder
            styleOptions={{
              label: "Liens",
              placeholder: "Ajouter de nouveaux liens vers les réseaux sociaux, sites web...",
              itemsHasColor: true,
            }}
            items={links}
            disabled={disabled}
            getValue={(item) => item.url}
            onValidate={(value) => {
              if (!(value.length > 0)) throw new Error("L'url est vide");
              if (links.some((hobby) => hobby.url === value))
                throw new Error(`L'url '${value}' existe déjà`);
              if (!urlIsValid(value)) throw new Error("L'url est incorrecte");
            }}
            onAddItem={async (value) => {
              setLinks((links) => [...links, { ...transformLink(value) }]);
              return true;
            }}
            onDelete={async (item) => {
              setLinks((hobbies) => hobbies.filter((hobby) => hobby.url !== item.url));
              return true;
            }}
          />
        </div>
      </div>
    </form>
  );
};

export default UserForm;
