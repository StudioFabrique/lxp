import Wrapper from "../../../../../src/components/wrappers/BoxWrapper";
import { avatarImageMaxSize } from "../../../../config/images-sizes";
import ProfileImageFileUpload from "../../../../components/UI/image-file-upload/profile-image-file-upload";
import { useEffect, useState } from "react";

type Props = {
  lastname: string;
  lastnameError: boolean;
  onLastname: (v: string) => void;
  firstname: string;
  firstnameError: boolean;
  onFirstname: (v: string) => void;
  nickname: string;
  nicknameError: boolean;
  onNickname: (v: string) => void;
  email: string;
  emailError: boolean;
  /** Motif du refus affiché sous le champ : format invalide ou adresse prise. */
  emailMessage?: string | null;
  onEmail: (v: string) => void;
  onSetFile: (file: File) => void;
  disabled?: boolean;
};

const inputStyle = (hasError: boolean) =>
  hasError
    ? "input input-error text-error input-sm input-bordered focus:outline-none w-full"
    : "input input-sm input-bordered focus:outline-none w-full";

const UserFormInformations = ({
  lastname,
  lastnameError,
  onLastname,
  firstname,
  firstnameError,
  onFirstname,
  nickname,
  nicknameError,
  onNickname,
  email,
  emailError,
  emailMessage,
  onEmail,
  onSetFile,
  disabled,
}: Props) => {
  const [temporaryAvatar, setTemporaryAvatar] = useState<{
    file: File | null;
    url: string | null;
  }>({ file: null, url: null });

  useEffect(() => {
    if (temporaryAvatar.file) onSetFile(temporaryAvatar.file);
  }, [temporaryAvatar.file, onSetFile]);

  return (
    <Wrapper>
      <h2 className="font-bold text-xl">Informations</h2>
      <div className="flex flex-col items-center gap-2">
        <label className="font-medium">Avatar</label>
        <ProfileImageFileUpload
          temporaryAvatar={temporaryAvatar}
          onSetTemporaryAvatar={setTemporaryAvatar}
          maxSize={avatarImageMaxSize}
        />
        <p className="text-xs text-base-content/60">
          Cliquez sur l'avatar pour ajouter une image
        </p>
      </div>
      <span className="flex flex-col gap-y-2">
        <label>Prénom *</label>
        <input
          className={inputStyle(firstnameError)}
          type="text"
          value={firstname}
          onChange={(e) => onFirstname(e.target.value)}
          autoComplete="off"
          disabled={disabled}
        />
      </span>
      <span className="flex flex-col gap-y-2">
        <label>Nom *</label>
        <input
          className={inputStyle(lastnameError)}
          type="text"
          value={lastname}
          onChange={(e) => onLastname(e.target.value)}
          autoComplete="off"
          disabled={disabled}
        />
      </span>
      <span className="flex flex-col gap-y-2">
        <label>Pseudo</label>
        <input
          className={inputStyle(nicknameError && nickname.length > 0)}
          type="text"
          value={nickname}
          onChange={(e) => onNickname(e.target.value)}
          autoComplete="off"
          disabled={disabled}
        />
      </span>
      <span className="flex flex-col gap-y-2">
        <label>Adresse Mail *</label>
        <input
          className={inputStyle(emailError)}
          type="text"
          value={email}
          onChange={(e) => onEmail(e.target.value)}
          autoComplete="off"
          disabled={disabled}
          aria-invalid={emailError}
          aria-describedby={emailMessage ? "user-email-error" : undefined}
        />
        {emailMessage ? (
          <span id="user-email-error" role="alert" className="text-error text-sm">
            {emailMessage}
          </span>
        ) : null}
      </span>
    </Wrapper>
  );
};

export default UserFormInformations;
