/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeEvent, useEffect, useState } from "react";
import useHttp from "../../hooks/use-http";

type List = {
  id: number;
  title: string;
};

interface SelectDropdownProps {
  onSelectItem: (id: number) => void;
}

const SelectDropdown = ({ onSelectItem }: SelectDropdownProps) => {
  const [list, setList] = useState<any[] | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { sendRequest } = useHttp();

  const fetchList = (path: string) => {
    const applyData = (data: { message: string; response: List[] }) => {
      setList(data.response);
    };
    sendRequest(
      {
        path: `/modules/${path}-list`,
      },
      applyData
    );
  };

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    fetchList(event.currentTarget.value);
  };

  const handleSelectItem = (id: number) => {
    onSelectItem(id);
    setIsOpen(false);
  };

  useEffect(() => {
    if (list && list.length > 0) {
      setIsOpen(true);
    }
  }, [list]);

  return (
    <div className="flex flex-col gap-y-2">
      <select className="w-fit select select-sm" onChange={handleSelectChange}>
        <option disabled={true} value="">
          Filtrer par
        </option>
        <option value="formations">Formation</option>
        <option value="parcours">Parcours</option>
      </select>
      {isOpen ? (
        <>
          {list && list.length > 0 ? (
            <ul
              tabIndex={0}
              className="dropdown-content menu p-1 shadow bg-base-100 rounded-box w-full mt-4 z-50"
            >
              {list.map((item) => (
                <li key={item.id} onClick={() => handleSelectItem(item.id)}>
                  <p>{item.title}</p>
                </li>
              ))}
            </ul>
          ) : null}
        </>
      ) : null}
    </div>
  );
};

export default SelectDropdown;
