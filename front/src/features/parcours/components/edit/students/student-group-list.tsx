// Import des hooks React nécessaires et des types
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import Role from "../../../../../../src/utils/interfaces/role";
import SortColumnIcon from "../../../../../components/UI/sort-column-icon/sort-column-icon";
import { GroupList } from "./parcours-students.component";

// Props du composant StudentGroupList
type Props = {
  role: Role;
  allChecked: boolean;
  groupList: GroupList[];
  showActions?: boolean;
  onRowCheck: (id: string) => void;
  onAllChecked: Dispatch<SetStateAction<boolean>>;
  onSorting: (column: string) => void;
  fieldSort: string;
  direction: boolean;
};

// Composant principal pour afficher la liste des groupes d'étudiants
function StudentGroupList({
  allChecked,
  groupList,
  onRowCheck,
  onAllChecked,
  onSorting,
  fieldSort,
  direction,
}: Props) {
  // Gestion de la sélection/désélection de tous les éléments
  const handleAllChecked = useCallback(() => {
    onAllChecked((prevState) => !prevState);
  }, [onAllChecked]);

  // Réinitialisation des sélections au montage du composant
  useEffect(() => {
    onAllChecked(false);
  }, [onAllChecked]);

  console.log({ groupList });

  // Mémoisation du contenu du tableau pour optimiser les performances
  const content = useMemo(() => {
    return (
      <table className="table w-full">
        <thead className="bg-none">
          <tr>
            {/* Checkbox pour sélectionner/désélectionner tous les éléments */}
            <th className="z-0">
              <input
                className="my-auto checkbox checkbox-sm rounded-md checkbox-primary"
                type="checkbox"
                checked={allChecked}
                onChange={handleAllChecked}
              />
            </th>
            {/* En-tête triable pour le nom */}
            <th
              className="cursor-pointer"
              onClick={() => {
                onSorting("name");
              }}
            >
              <div className="flex items-center gap-x-2">
                <p>Nom</p>
                <SortColumnIcon
                  fieldSort={fieldSort}
                  column="name"
                  direction={direction}
                />
              </div>
            </th>

            {/* En-tête triable pour la formation */}
            <th
              className="cursor-pointer"
              onClick={() => {
                onSorting("formation");
              }}
            >
              <div className="flex items-center gap-x-2">
                <p>Formation / Parcours</p>
                <SortColumnIcon
                  fieldSort={fieldSort}
                  column="formation"
                  direction={direction}
                />
              </div>
            </th>
            {/* En-tête triable pour le nombre d'étudiants */}
            <th
              className="cursor-pointer"
              onClick={() => {
                onSorting("nbStudents");
              }}
            >
              <div className="flex items-center gap-x-2">
                <p>Nombre d'étudiants</p>
                <SortColumnIcon
                  fieldSort={fieldSort}
                  column="nbStudents"
                  direction={direction}
                />
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {/* Mapping des groupes pour créer les lignes du tableau */}
          {groupList.map((item) => (
            <tr key={item._id}>
              {/* Checkbox individuelle pour chaque groupe */}
              <td className="bg-transparent">
                <input
                  className="my-auto checkbox checkbox-sm rounded-md checkbox-primary"
                  type="checkbox"
                  checked={item.isSelected}
                  onChange={() => onRowCheck(item._id!)}
                />
              </td>
              {/* Affichage des informations du groupe */}
              <td className="font-bold bg-transparent">{item.name}</td>
              <td className="bg-transparent capitalize">
                {item.formation ?? "Aucun"}
              </td>
              <td className="justify-center bg-transparent flex gap-4 items-center">
                {item?.nbStudents}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }, [
    allChecked,
    handleAllChecked,
    fieldSort,
    direction,
    groupList,
    onSorting,
    onRowCheck,
  ]);

  return content;
}

export default StudentGroupList;
