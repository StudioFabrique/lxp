import { showFormErrors } from "../../../../components/form/form-errors";
import { useEffect, type ReactNode } from "react";
import { Link } from "react-router";
import toast from "react-hot-toast";
import { LoaderCircle } from "lucide-react";
import type User from "../../../../utils/interfaces/user";
import { useUserForm } from "./useUserForm";
import UserFormInformations from "./UserFormInformations";
import UserFormContact from "./UserFormContact";
import UserFormTypeUser from "./UserFormTypeUser";
import UserInvitationCard from "./UserInvitationCard";
import BoxWrapper from "../../../../components/wrappers/BoxWrapper";
import UserFormPresentation from "./UserFormPresentation";
import UserFormCertifications from "./UserFormCertifications";
import Header from "../../../../../src/components/headers/Header";
import PageWrapper from "../../../../components/wrappers/PageWrapper";
import ItemsAdder from "../../../../../src/components/UI/items-adder";
import { regexGeneric } from "../../../../config/constantes";
import { transformLink, urlIsValid } from "../../helpers/link-transform";
import { cn } from "../../../../utils/cn";
import { useUserRoleOptions } from "../../hooks/useUserRoleOptions";

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
  requiredRoleRank?: number;
  initialSendEmail?: boolean;
  cancelTo?: string;
  groupCreationContext?: (invitation: ReactNode) => ReactNode;
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
  requiredRoleRank,
  initialSendEmail = false,
  cancelTo,
  groupCreationContext,
}: Props) => {
  const {
    form,
    email,
    setEmail,
    emailError,
    validateEmail,
    firstname,
    setFirstname,
    firstnameError,
    lastname,
    setLastname,
    lastnameError,
    nickname,
    setNickname,
    nicknameError,
    address,
    setAddress,
    addressError,
    city,
    setCity,
    cityError,
    postCode,
    setPostCode,
    postCodeError,
    phoneNumber,
    setPhoneNumber,
    phoneError,
    description,
    setDescription,
    birthDate,
    setBirthDate,
    file,
    setFile,
    graduations,
    setGraduations,
    links,
    setLinks,
    hobbies,
    setHobbies,
    roleId,
    setRoleId,
    sendEmail,
    setSendEmail,
  } = useUserForm(user, initialSendEmail);
  const roleOptions = useUserRoleOptions(requiredRoleRank);

  useEffect(() => {
    if (!roleOptions.isSuccess) return;
    const selectedRoleIsAllowed = roleOptions.roles.some((role) => role._id === roleId);
    if (requiredRoleRank !== undefined && !selectedRoleIsAllowed) {
      setRoleId(roleOptions.roles[0]?._id ?? null);
    } else if (!roleId && initialRoleRank !== undefined) {
      const initialRole = roleOptions.roles.find((role) => role.rank === initialRoleRank);
      if (initialRole) setRoleId(initialRole._id);
    }
  }, [initialRoleRank, requiredRoleRank, roleId, roleOptions.isSuccess, roleOptions.roles, setRoleId]);

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

  const handleSubmit = form.handleSubmit((values) => {
    if (fieldsDisabled || isLoading) return;
    if (!values.roleId || !roleOptions.isSuccess || !roleOptions.roles.some((role) => role._id === values.roleId)) {
      const message = requiredRoleRank === 3 ? "Veuillez choisir un rôle apprenant disponible." : "Veuillez choisir un rôle disponible.";
      form.setError("roleId", { message });
      toast.error(message);
      return;
    }
    onSubmitForm(values, file);
  }, (errors) => { validateEmail(); showFormErrors(errors); });

  const disabled = fieldsDisabled || isLoading;

  return (
    <PageWrapper as="form" className="@container min-w-0" onSubmit={handleSubmit} autoComplete="on" data-testid="user-form">
      <Header
        title={editMode ? "Modifier un utilisateur" : "Créer un utilisateur"}
        description={
          editMode
            ? "Modifiez les informations de l'utilisateur"
            : "Renseignez les informations du nouvel utilisateur"
        }
      >
        <Link
          to={cancelTo ?? ".."}
          className="btn btn-outline md:w-32 normal-case mr-4"
        >
          Annuler
        </Link>
        <button
          type="submit"
          className="btn btn-primary normal-case"
          disabled={disabled}
          data-testid="user-save"
        >
          {isLoading ? (
            <span className="flex items-center gap-x-2">
              <LoaderCircle className="animate-spin mr-2 h-4 w-4" />
              <p>Sauvegarde en cours...</p>
            </span>
          ) : (
            "Sauvegarder"
          )}
        </button>
      </Header>
      {groupCreationContext?.(!editMode ? <UserInvitationCard sendEmail={sendEmail} onSetSendEmail={setSendEmail} disabled={disabled} compact /> : null)}
      <div className="flex flex-col gap-y-5">
        <div className="grid grid-cols-1 gap-5 @min-[40rem]:grid-cols-2 @min-[64rem]:grid-cols-3">
          <div className="min-w-0" data-testid="user-informations">
            <UserFormInformations
              lastname={lastname}
              lastnameError={lastnameError}
              onLastname={setLastname}
              firstname={firstname}
              firstnameError={firstnameError}
              onFirstname={setFirstname}
              nickname={nickname}
              nicknameError={nicknameError}
              onNickname={setNickname}
              email={email}
              emailError={emailError || emailIsRefused}
              emailMessage={emailMessage}
              onEmail={setEmail}
              onSetFile={setFile}
              disabled={disabled}
            />
          </div>
          <UserFormContact
            address={address}
            addressError={addressError}
            onAddress={setAddress}
            city={city}
            cityError={cityError}
            onCity={setCity}
            postCode={postCode}
            postCodeError={postCodeError}
            onPostCode={setPostCode}
            phone={phoneNumber}
            phoneError={phoneError}
            onPhone={setPhoneNumber}
            birthDate={birthDate}
            onChangeDate={setBirthDate}
            disabled={disabled}
          />
          <div
            className="flex min-w-0 flex-col gap-5 @min-[40rem]:col-span-2 @min-[64rem]:col-span-1"
          >
            {!editMode && !groupCreationContext && (
              <BoxWrapper className="h-auto shrink-0">
                <UserInvitationCard sendEmail={sendEmail} onSetSendEmail={setSendEmail} disabled={disabled} compact />
              </BoxWrapper>
            )}
            <div className="min-w-0 flex-1" data-testid="user-role">
            <UserFormTypeUser
              roleId={roleId}
              onSetRoleId={setRoleId}
              roles={roleOptions.roles}
              isLoading={roleOptions.isLoading}
              isFetching={roleOptions.isFetching}
              isError={roleOptions.isError}
              onRefresh={() => void roleOptions.refetch()}
              studentOnly={requiredRoleRank === 3}
              error={form.formState.errors.roleId?.message}
              disabled={disabled}
            />
            </div>
          </div>
        </div>
        {editMode && (
          <div className="grid grid-cols-1 gap-5 @min-[64rem]:grid-cols-3">
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
                if (!(value.length > 0))
                  throw new Error("Le centre d'intérêt est vide");
                if (hobbies.some((hobby) => hobby.title === value))
                  throw new Error(`Le centre d'intérêt '${value}' existe déjà`);
                if (!regexGeneric.test(value))
                  throw new Error("La valeur est incorrecte");
              }}
              onAddItem={async (value) => {
                setHobbies((hobbies) => [...hobbies, { title: value }]);
                return true;
              }}
              onDelete={async (item) => {
                setHobbies((hobbies) =>
                  hobbies.filter((hobby) => hobby.title !== item.title),
                );
                return true;
              }}
            />
            <div className="min-w-0 @min-[64rem]:col-span-2">
              <UserFormPresentation
                description={description}
                onDescription={setDescription}
                disabled={disabled}
              />
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 gap-5 @min-[64rem]:grid-cols-3">
          <div className={cn("min-w-0", editMode ? "@min-[64rem]:col-span-2" : "@min-[64rem]:col-span-3")}>
            <UserFormCertifications
              graduations={graduations}
              setGraduations={setGraduations}
              disabled={disabled}
            />
          </div>
          {editMode && (
            <ItemsAdder
              styleOptions={{
                label: "Liens",
                placeholder:
                  "Ajouter de nouveaux liens vers les réseaux sociaux, sites web...",
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
                setLinks((hobbies) =>
                  hobbies.filter((hobby) => hobby.url !== item.url),
                );
                return true;
              }}
            />
          )}
        </div>
      </div>
    </PageWrapper>
  );
};

export default UserForm;
