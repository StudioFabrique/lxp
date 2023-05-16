import { Link } from "react-router-dom";
import UserList from "../../components/user-list/user-list.component";
import { useContext, useEffect, useState } from "react";
import { Context } from "../../store/context.store";
import Role from "../../utils/interfaces/role";
import Tabs from "../../components/UI/tabs/tabs.component";

const GroupHome = () => {
  const { user, roles } = useContext(Context);
  const [role, setRole] = useState<Role>(roles[0]);

  useEffect(() => {
    if (roles) {
      setRole(user!.roles[0]);
    }
  }, [user, roles]);

  const handleRoleSwitch = (role: Role) => {
    setRole(role);
  };

  return (
    <div className="w-screen flex justify-center my-8">
      <div className="flex flex-col gap-y-4">
        {user && role ? (
          <Tabs role={role} roles={roles} onRoleSwitch={handleRoleSwitch} />
        ) : null}
        <UserList role={role} />
        <Link className="btn" to="/admin/group/add">
          Créer un groupe
        </Link>
      </div>
    </div>
  );
};

export default GroupHome;
