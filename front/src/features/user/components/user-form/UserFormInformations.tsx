import BoxWrapper from "../../../../../src/components/wrappers/BoxWrapper";
import { avatarImageMaxSize } from "../../../../config/images-sizes";
import ImageFileUpload from "../../../../components/UI/image-file-upload/image-file-upload";
import { useEffect, useState } from "react";
import { cn } from "../../../../utils/cn";

type Props = {
  lastname: string;
  lastnameError: boolean;
  lastnameMessage?: string | null;
  onLastname: (v: string) => void;
  firstname: string;
  firstnameError: boolean;
  firstnameMessage?: string | null;
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
  cn("input input-sm input-bordered focus:outline-none w-full", hasError && "input-error text-error");

const UserFormInformations = ({
  lastname,
  lastnameError,
  lastnameMessage,
  onLastname,
  firstname,
  firstnameError,
  firstnameMessage,
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
    <BoxWrapper>
      <h2 className="font-bold text-xl">Informations</h2>
      <span className="flex flex-col gap-y-2">
        <label htmlFor="user-firstname">Prénom *</label>
        <input
          className={inputStyle(firstnameError)}
          type="text"
          value={firstname}
          onChange={(e) => onFirstname(e.target.value)}
          id="user-firstname"
          name="firstname"
          autoComplete="given-name"
          disabled={disabled}
          aria-invalid={firstnameError}
          aria-describedby={firstnameError && firstnameMessage ? "user-firstname-error" : undefined}
        />
        <span
          id="user-firstname-error"
          role={firstnameError && firstnameMessage ? "alert" : undefined}
          className="min-h-5 text-error text-sm"
        >
          {firstnameError ? firstnameMessage : null}
        </span>
      </span>
      <span className="flex flex-col gap-y-2">
        <label htmlFor="user-lastname">Nom *</label>
        <input
          className={inputStyle(lastnameError)}
          type="text"
          value={lastname}
          onChange={(e) => onLastname(e.target.value)}
          id="user-lastname"
          name="lastname"
          autoComplete="family-name"
          disabled={disabled}
          aria-invalid={lastnameError}
          aria-describedby={lastnameError && lastnameMessage ? "user-lastname-error" : undefined}
        />
        <span
          id="user-lastname-error"
          role={lastnameError && lastnameMessage ? "alert" : undefined}
          className="min-h-5 text-error text-sm"
        >
          {lastnameError ? lastnameMessage : null}
        </span>
      </span>
      <span className="flex flex-col gap-y-2">
        <label htmlFor="user-nickname">Pseudo</label>
        <input
          id="user-nickname"
          className={inputStyle(nicknameError && nickname.length > 0)}
          type="text"
          value={nickname}
          onChange={(e) => onNickname(e.target.value)}
          name="nickname"
          autoComplete="nickname"
          disabled={disabled}
        />
        <span aria-hidden="true" className="min-h-5" />
      </span>
      <span className="flex flex-col gap-y-2">
        <label htmlFor="user-email">Adresse Mail *</label>
        <input
          id="user-email"
          className={inputStyle(emailError)}
          type="text"
          value={email}
          onChange={(e) => onEmail(e.target.value)}
          name="email"
          autoComplete="email"
          disabled={disabled}
          aria-invalid={emailError}
          aria-describedby={emailMessage ? "user-email-error" : undefined}
        />
        <span
          id="user-email-error"
          role={emailMessage ? "alert" : undefined}
          className="min-h-5 text-error text-sm"
        >
          {emailMessage}
        </span>
      </span>
      <div className="flex items-center justify-between gap-4 border-t border-base-300 pt-4">
        <div>
          <p className="font-medium">Avatar</p>
          <p className="text-xs text-base-content/60">
            Cliquez sur l'avatar pour ajouter une image
          </p>
        </div>
        <ImageFileUpload
          temporaryImage={temporaryAvatar}
          onSetTemporaryImage={setTemporaryAvatar}
          maxSize={avatarImageMaxSize}
        />
      </div>
    </BoxWrapper>
  );
};

export default UserFormInformations;
