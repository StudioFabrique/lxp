import { Loader2 } from "lucide-react";
import FadeWrapper from "../UI/fade-wrapper/fade-wrapper";
import { Link } from "react-router-dom";

type Props = {
  message: string;
  url: string;
};

export default function PasswordUpdateSuccess(props: Props) {
  return (
    <FadeWrapper>
      <span className="flex items center gap-x-2">
        <p>{props.message}</p>
        <Loader2 className="text-primary animate-spin" />
      </span>
      <Link className="text-xs text-primary underline" to={props.url}>
        Cliquez sur ce lien si vous n'êtes pas redirigé...
      </Link>
    </FadeWrapper>
  );
}
