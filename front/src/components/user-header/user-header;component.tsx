import { Link } from "react-router-dom";

const UserHeader = () => {
  return (
    <div className="w-full xl:w-4/6 grid grid-cols-1 md:grid-cols-2 gap-y-8">
      <div>
        <h2 className="text-4xl text-base-content font-bold">
          Liste d'utilisateurs
        </h2>
        <p className="mt-2">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin in urna
          eget pura.
        </p>
      </div>
      <div className="flex items-center gap-x-2 justify-center md:justify-end">
        <Link className="btn" to="/admin/user/add">
          Créer un utilisateur
        </Link>
        <button className="btn btn-outline btn-sm btn-primary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default UserHeader;
