import { Link } from "react-router-dom";
import UserList from "../../components/user-list/user-list.component";
import { useContext, useEffect, useState } from "react";
import { Context } from "../../store/context.store";
import Role from "../../utils/interfaces/role";
import Tabs from "../../components/UI/tabs/tabs.component";

const UserHome = () => {
  const { user, roles } = useContext(Context);
  const [role, setRole] = useState<Role>(roles[0]);

  useEffect(() => {
    if (roles) {
      setRole(roles[0]);
    }
  }, [roles]);

  const handleRoleSwitch = (role: Role) => {
    setRole(role);
  };

  return (
    <div className="w-screen flex justify-center my-8">
      <div className="flex flex-col gap-y-4">
        {user && role ? (
          <Tabs
            userRole={user!.roles[0]}
            role={role}
            roles={roles}
            onRoleSwitch={handleRoleSwitch}
          />
        ) : null}
        <UserList role={role} />
        <Link className="btn" to="/admin/user/add">
          Créer un utilisateur
        </Link>
      </div>
    </div>
  );
};

export default UserHome;
