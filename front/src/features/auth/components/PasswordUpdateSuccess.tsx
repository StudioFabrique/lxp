import { Link } from "react-router";

type Props = {
  message: string;
  url: string;
};

const PasswordUpdateSuccess = ({ message, url }: Props) => {
  return (
    <div className="flex flex-col items-center gap-6">
      <span className="text-center text-success">{message}</span>
      <Link className="btn btn-primary btn-sm" to={url}>
        Retour à la page de connexion
      </Link>
    </div>
  );
};

export default PasswordUpdateSuccess;
