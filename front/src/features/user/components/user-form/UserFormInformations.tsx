import Wrapper from "../../../../../src/components/wrappers/BoxWrapper";
import { avatarImageMaxSize } from "../../../../config/images-sizes";
import MemoizedImageFileUpload from "../../../../components/UI/image-file-upload/image-file-upload";

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
  onEmail: (v: string) => void;
  onSetFile: (file: File) => void;
  disabled?: boolean;
};

const inputStyle = (hasError: boolean) =>
  hasError
    ? "input input-error text-error input-sm input-bordered focus:outline-none w-full"
    : "input input-sm input-bordered focus:outline-none w-full";

const UserFormInformations = ({
  lastname, lastnameError, onLastname,
  firstname, firstnameError, onFirstname,
  nickname, nicknameError, onNickname,
  email, emailError, onEmail,
  onSetFile, disabled,
}: Props) => (
  <Wrapper>
    <h2 className="font-bold text-xl">Informations</h2>
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
      />
    </span>
    <MemoizedImageFileUpload
      label="Téléverser un avatar"
      onSetFile={onSetFile}
      maxSize={avatarImageMaxSize}
    />
  </Wrapper>
);

export default UserFormInformations;
