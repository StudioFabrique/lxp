// Import des dépendances nécessaires
import { useSelector } from "react-redux";
import User from "../../../utils/interfaces/user";
import { AvatarSmall } from "../../UI/avatar/avatar.component";

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
  const { avatar, email, lastname, firstname, group, createdAt } =
    props.studentItem;

  // Récupération du titre de la formation depuis le store Redux
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formation = useSelector((state: any) => state.parcours.formation.title);

  return (
    <>
      {/* Avatar de l'étudiant */}
      <td className="bg-transparent">
        <AvatarSmall url={avatar!} />
      </td>
      {/* Prénom de l'étudiant */}
      <td className="bg-transparent capitalize">{firstname}</td>
      {/* Nom de l'étudiant */}
      <td className="bg-transparent capitalize">{lastname}</td>
      {/* Email de l'étudiant */}
      <td className="bg-transparent">{email}</td>
      {/* Formation de l'étudiant */}
      <td className="bg-transparent">{formation}</td>
      {/* Nom du groupe de l'étudiant */}
      <td className="bg-transparent">{group!.name}</td>
      {/* Date de création formatée */}
      <td className="bg-transparent">
        {new Date(createdAt!).toLocaleDateString()}
      </td>
    </>
  );
};

export default StudentItem;
