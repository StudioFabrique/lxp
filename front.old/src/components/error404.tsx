import { Link } from "react-router-dom";

const Error404 = () => {
  return (
    <div className="w-full flex flex-col justify-center items-center gap-y-4 mt-32">
      <h1 className="text-5xl">Erreur 404</h1>
      <Link className="underline text-sm" to="..">
        Retour
      </Link>
    </div>
  );
};

export default Error404;
