import { useContext } from "react";

import Header from "../../../../components/headers/Header";
import { AuthContext } from "../../../../store/AuthProvider";
import {
  getModulesLabel,
  isTeacherUser,
} from "../../../../utils/helpers/user-role";

function ModuleHeader() {
  const { user } = useContext(AuthContext);
  const isTeacher = isTeacherUser(user);

  return (
    <section className="w-full">
      {/* Main header component with title and description */}
      <Header
        title={getModulesLabel(user, "Liste des modules")}
        description={
          isTeacher
            ? "Consulter et gérer les modules qui vous sont affectés."
            : "Gérer tous les modules qui sont créés au sein de l'application."
        }
      ></Header>
    </section>
  );
}

export default ModuleHeader;
