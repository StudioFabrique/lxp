import { FC } from "react";
import useEagerLoadingList from "../../hooks/use-eager-loading-list";

type Props = {
  data: Array<any>; //  liste des objets importés depuis un fichier CSV et transformés en objets js
};

const ImportedSkills: FC<Props> = ({ data }) => {
  const { allChecked, list, setAllChecked, handleRowCheck } =
    useEagerLoadingList(data); //  custom hook permettang de gérer l'affichage des données

  /**
   * gère le coache / décochage de toutes les checkboxes
   */
  const handleAllChecked = () => {
    setAllChecked((prevState) => !prevState);
  };

  return (
    <>
      <p>Choisissez les compétences à importer</p>
      {list ? (
        <>
          <table className="table w-full border-separate border-spacing-y-2">
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
                <th>Intitulé</th>
                <th>Formation</th>
                <th>Parcours</th>
              </tr>
            </thead>
            <tbody>
              {list.map((item: any, index: number) => (
                <tr
                  className="bg-secondary/10 hover:bg-secondary/20 hover:text-base-content"
                  key={index}
                >
                  <td className="bg-transparent rounded-l-xl">
                    <input
                      className="my-auto checkbox checkbox-sm rounded-md checkbox-primary"
                      type="checkbox"
                      checked={
                        item.isSelected !== undefined ? item.isSelected : false
                      }
                      onChange={() => handleRowCheck(item.id)}
                    />
                  </td>
                  <td className="bg-transparent capitalize">{item.title}</td>
                  <td className="bg-transparent capitalize">
                    {item.formation}
                  </td>
                  <td className="bg-transparent capitalize">{item.parcours}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : null}
    </>
  );
};

export default ImportedSkills;
