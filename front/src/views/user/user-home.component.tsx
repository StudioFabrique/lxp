import { Link } from "react-router-dom";
import UserList from "../../components/user-list/user-list.component";

const UserHome = () => {
  return (
    <div className="w-screen flex justify-center my-8">
      <div className="flex flex-col items-end gap-y-4">
        <UserList />
        <Link className="btn" to="/admin/user/add">
          Créer un utilisateur
        </Link>
      </div>
    </div>
  );
};

export default UserHome;
