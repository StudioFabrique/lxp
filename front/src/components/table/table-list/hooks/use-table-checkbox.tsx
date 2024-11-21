import { useEffect, useState } from "react";
import { generateTableIdsFromData } from "../services/generic-table-service";
import Group from "../../../../utils/interfaces/group";

/**
 * Custom hook useTable.
 * Gère l'état des checkbox de chaque ligne et la checkbox "sélectionner tout"
 *
 * @param data: TData[] - Tableau contenant toutes les données
 * @param idProperty: string - Propriété qui identifie de manière unique chaques lignes (ex: "id")
 *
 */
function useTableCheckbox<TData>(data: TData[], idProperty: string) {
  const [isAllChecked, setAllChecked] = useState<boolean>(false);
  const [idsList, setIdList] = useState<string[]>([]);

  const idsListFromData = generateTableIdsFromData(data, idProperty);

  const handleCheck = (id: string, checked: boolean) => {
    if (checked) {
      const newList = [...idsList, id];

      // verifier doublons ici? //

      setIdList(newList);
    } else {
      const newList = idsList.filter((item) => item !== id);
      setIdList(newList);
    }
  };

  const handleCheckAll = (checked: boolean) => {
    if (checked) {
      setIdList(idsListFromData);
    } else {
      setIdList([]);
    }
    setAllChecked(checked);
  };

  const handleResetCheckbox = () => {
    setAllChecked(false);
    setIdList([]);
  };

  const handleRetreiveItemsByPropertyFromIdList = <K extends keyof TData>(
    property: K,
  ) => {
    return data
      .filter((item: TData) => {
        const itemId = item[idProperty as keyof TData];
        return idsList.includes(String(itemId));
      })
      .map((item: TData) => String(item[property]));
  };

  handleRetreiveItemsByPropertyFromIdList("name" as keyof Group);

  // Quand les données changent (dépendance data), alors il y a un refresh des checkbox
  useEffect(() => {
    handleResetCheckbox();
  }, [data]);

  return {
    idsList,
    // onResetCheckbox: handleResetCheckbox,
    isAllChecked,
    onCheck: handleCheck,
    onCheckAll: handleCheckAll,
    onRetreiveItemsByPropertyFromIdList:
      handleRetreiveItemsByPropertyFromIdList,
  };
}

export default useTableCheckbox;
