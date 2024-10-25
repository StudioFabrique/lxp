import { useEffect, useState } from "react";

function useTableCheckbox<TData>(data: TData) {
  const [isAllChecked, setAllChecked] = useState<boolean>(false);

  const [idList, setIdList] = useState<string[]>([]);

  console.log({ idList });

  const handleCheck = (id: string, checked: boolean) => {
    if (checked) {
      const newList = [...idList, id];
      // verifier doublons?
      setIdList(newList);
    } else {
      const newList = idList.filter((item) => item !== id);
      setIdList(newList);
    }
  };

  const handleCheckAll = (checked: boolean) => {
    if (checked) {
      // add all id
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
    idList,
    onResetCheckbox: handleResetCheckbox,
    isAllChecked,
    onCheck: handleCheck,
    onCheckAll: handleCheckAll,
  };
}

export default useTableCheckbox;
