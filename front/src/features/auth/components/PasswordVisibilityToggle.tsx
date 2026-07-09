import { Eye, EyeOff } from "lucide-react";
import { FC } from "react";

const ICON_SIZE = 20;

const PasswordVisibilityToggle: FC<{
  inputType: string;
  onPasswordVisibility: () => void;
}> = (props) => {
  return (
    <button
      className="btn btn-sm btn-ghost"
      type="button"
      onClick={props.onPasswordVisibility}
    >
      {props.inputType === "password" ? (
        <Eye width={ICON_SIZE} height={ICON_SIZE} />
      ) : (
        <EyeOff width={ICON_SIZE} height={ICON_SIZE} />
      )}
    </button>
  );
};

export default PasswordVisibilityToggle;
