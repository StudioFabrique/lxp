import { Link } from "react-router";

type Props = {
  error: string;
  url: string;
};

const PasswordUpdateError = ({ error, url }: Props) => {
  return (
    <>
      <p className="border border-error rounded-md shadow-md text-error p-4">
        {error}
      </p>
      <Link className="btn btn-outline btn-primary" to={url}>
        Retour
      </Link>
    </>
  );
};

export default PasswordUpdateError;
