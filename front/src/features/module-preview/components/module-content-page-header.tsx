import { PenBox } from "lucide-react";
import { Link } from "react-router";
import Header from "../../../components/headers/Header";
import PermissionGuard from "../../../components/guards/PermissionGuard";
import type Module from "../../../utils/interfaces/module";

type ModuleContentPageHeaderProps = {
  module?: Module;
  isStudentView: boolean;
  canEditModule: boolean;
};

export default function ModuleContentPageHeader({
  module,
  isStudentView,
  canEditModule,
}: ModuleContentPageHeaderProps) {
  return (
    <Header
      title="Contenu du module"
      description={
        isStudentView
          ? "Parcourir les leçons et les activités pour valider vos compétences"
          : "Créer, modifier et supprimer des leçons et des activités"
      }
    >
      {canEditModule && (
        <PermissionGuard object="lesson" action="update">
          <Link
            className="btn btn-primary gap-2 text-base-100"
            to={`/admin/parcours/edit/${module?.parcoursId}?step=4&moduleId=${module?.id}`}
          >
            <PenBox /> Modifier le module
          </Link>
        </PermissionGuard>
      )}
    </Header>
  );
}
