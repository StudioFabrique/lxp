import { FC, FormEvent } from "react";

import useEagerLoadingList from "../../../hooks/use-eager-loading-list";
import SortColumnIcon from "../../UI/sort-column-icon.component/sort-column-icon.component";
import DrawerFormButtons from "../../UI/drawer-form-buttons/drawer-form-buttons.component";

type Props = {
  data: Array<any>;
  label: string;
  field: string;
  onCloseDrawer: () => void; //  ferme le drawer
  onPostData: (slectedData: Array<any>) => void;
};

const ImportedCSVData: FC<Props> = ({
  data,
  label,
  field,
  onCloseDrawer,
  onPostData,
}) => {
  const {
    allChecked,
    direction,
    fieldSort,
    list,
    sortData,
    setAllChecked,
    handleRowCheck,
    getSelecteditems,
  } = useEagerLoadingList(data, field); //  custom hook permettant de gérer l'affichage des données, quand la liste de compétences apparaît à l'écran elle est triée alphabétiquement par son intitulé

  /**
   * gère le coche / décochage de toutes les checkboxes
   */
  const handleAllChecked = () => {
    setAllChecked((prevState) => !prevState);
  };

  /**
   * soumet le formulaire après vérification de la validité des données
   * @param event FormEvent
   */
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    //  récupère les compétences sélectionnées
    const selectedData = getSelecteditems();
    if (selectedData && selectedData.length > 0) {
      onPostData(selectedData);
    }
    setAllChecked(false);
  };

  // réinitialise les checkboxes et ferme le drawer
  const handleCancelButton = () => {
    setAllChecked(false);
    onCloseDrawer();
  };

  return (
    <>
      {list && list.length > 0 ? (
        <>
          <p className="mt-4">Choisissez les {label} à importer</p>
          <form className="w-full" onSubmit={handleSubmit}>
            <table className="w-full table">
              <thead>
                <tr>
                  <th>
                    <input
                      className="my-auto checkbox checkbox-sm rounded-md checkbox-primary"
                      type="checkbox"
                      checked={allChecked}
                      onChange={handleAllChecked}
                    />
                  </th>
                  <th
                    className="cursor-pointer"
                    onClick={() => sortData("description")}
                  >
                    <div className="flex items-center gap-x-2">
                      <p className="capitalize">{label}</p>
                      <SortColumnIcon
                        fieldSort={fieldSort}
                        column="description"
                        direction={direction}
                      />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {list.map((item: any, index: number) => (
                  <tr
                    className="bg-secondary/10 hover:bg-secondary/20 hover:text-base-content w-full"
                    key={index}
                  >
                    <td className="bg-transparent rounded-l-xl">
                      <input
                        className="my-auto checkbox checkbox-sm rounded-md checkbox-primary"
                        type="checkbox"
                        checked={
                          item.isSelected !== undefined
                            ? item.isSelected
                            : false
                        }
                        onChange={() => handleRowCheck(item.id)}
                      />
                    </td>
                    <td className="bg-transparent capitalize truncate">
                      {item[field]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <DrawerFormButtons onCancel={handleCancelButton} />
          </form>
        </>
      ) : null}
    </>
  );
};

export default ImportedCSVData;
