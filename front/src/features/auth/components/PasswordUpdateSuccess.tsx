import { Loader2 } from "lucide-react";
import { Link } from "react-router";

type Props = {
  message: string;
  url: string;
};

const PasswordUpdateSuccess = ({ message, url }: Props) => {
  return (
    <span className="flex flex-col items-center gap-y-4">
      <span className="flex items-center gap-x-2">
        <p>{message}</p>
        <Loader2 className="text-primary animate-spin" />
      </span>
      <Link className="text-xs text-primary underline" to={url}>
        Cliquez sur ce lien si vous n&apos;êtes pas redirigé...
      </Link>
    </span>
  );
};

export default PasswordUpdateSuccess;
