// Import des dépendances nécessaires
import User from "../../../../../../src/utils/interfaces/user";
import { AvatarSmall } from "../../../../../components/avatar/AvatarSmall";
import { localeDate } from "../../../../../utils/helpers/locale-date";
import { useParams } from "react-router";
import { useParcoursQuery } from "../../../hooks/useParcoursQuery";

// Interface définissant les props du composant
interface StudentItemProps {
  studentItem: User;
}

/**
 * Composant qui affiche les informations d'un étudiant dans une ligne de tableau
 * @param props - Les props du composant contenant les données de l'étudiant
 * @returns Une ligne de tableau avec les informations de l'étudiant
 */
const StudentItem = (props: StudentItemProps) => {
  // Destructuration des données de l'étudiant depuis les props
  const { email, lastname, firstname, group, createdAt } = props.studentItem;

  const { id } = useParams();
  const { data: parcours } = useParcoursQuery(id ? Number(id) : undefined);

  return (
    <>
      {/* Avatar de l'étudiant */}
      <td className="bg-transparent">
        <AvatarSmall user={props.studentItem} />
      </td>
      {/* Prénom de l'étudiant */}
      <td className="bg-transparent capitalize">{firstname}</td>
      {/* Nom de l'étudiant */}
      <td className="bg-transparent capitalize">{lastname}</td>
      {/* Email de l'étudiant */}
      <td className="bg-transparent">{email}</td>
      {/* Formation de l'étudiant */}
      <td className="bg-transparent">{parcours?.formation.title}</td>
      {/* Nom du groupe de l'étudiant */}
      <td className="bg-transparent">{group!.name}</td>
      {/* Date de création formatée */}
      <td className="bg-transparent">
        {localeDate(createdAt!)}
      </td>
    </>
  );
};

export default StudentItem;
