import { Link } from "react-router-dom";

type Props = {
  error: string;
  url: string;
};

export default function PasswordUpdateError(props: Props) {
  return (
    <>
      <p className="border boder-error rounded-md shadow-md text-error p-4">
        {props.error}
      </p>
      <Link className="btn btn-ourlined btn-primary" to={props.url}>
        Retour
      </Link>
    </>
  );
}
