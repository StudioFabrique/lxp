import { useEffect, useState } from "react";
import { generateTableIdsFromData } from "../services/generic-table-service";

function useTableCheckbox<TData>(data: TData[], idProperty: string) {
  const [isAllChecked, setAllChecked] = useState<boolean>(false);
  const [idsList, setIdList] = useState<string[]>([]);

  const idsListFromData = generateTableIdsFromData(data, idProperty);

  const handleCheck = (id: string, checked: boolean) => {
    if (checked) {
      const newList = [...idsList, id];
      // verifier doublons?
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
  };
}

export default useTableCheckbox;
