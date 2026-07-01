import { ChangeEvent, useEffect, useState } from "react";

type TableListCheckboxCellProps = {
  id: string;
  isAllChecked?: boolean;
  onCheck?: (id: string, checked: boolean) => void;
};

const TableListCheckboxCell = (props: TableListCheckboxCellProps) => {
  const [isChecked, setCheckedState] = useState<boolean>(false);

  const handleChangeCheckbox = (event: ChangeEvent<HTMLInputElement>) => {
    const checked = event.currentTarget.checked;
    props.onCheck && props.onCheck(props.id, checked);
    setCheckedState(checked);
  };

  useEffect(() => {
    setCheckedState(props.isAllChecked ?? false);
  }, [props.isAllChecked]);

  return (
    <td className="px-0">
      <div className="h-full flex flex-col justify-center">
        <input
          type="checkbox"
          className="checkbox checkbox-sm checkbox-primary"
          onChange={handleChangeCheckbox}
          checked={isChecked}
        />
      </div>
    </td>
  );
};

export default TableListCheckboxCell;
