import { Link } from "react-router-dom";
import ImportButton from "./import-csv-button.component";
import BadgeIcon from "../UI/svg-icons/badge-icon.component";
import { useDispatch, useSelector } from "react-redux";
import { parcoursAction } from "../../store/redux-toolkit/parcours";
import { useEffect } from "react";

const SkillsHeader = () => {
  const dispatch = useDispatch();

  const handleCsvSkillsImport = (csvData: Array<any>) => {
    console.log({ csvData });

    dispatch(parcoursAction.importCsvSkills(csvData));
  };
  /* 
  useEffect(() => {
    if (csvSkills.length > 0) {
      csvSkills.forEach((item: any) => {
        console.log(item.title);

        dispatch(parcoursAction.addSkill({ title: item.title }));
      });
    }
  }, [csvSkills, dispatch]); */

  return (
    <div className="w-full flex justify-between items-center">
      <h3 className="text-xl font-bold">Compétences</h3>
      <div className="flex items-center gap-x-8">
        <ImportButton
          label="Importer des compétences"
          onClickEvent={handleCsvSkillsImport}
        />
        <Link className="flex gap-x-1 text-primary items-center" to="#">
          <BadgeIcon size={4} color="primary" />
          <p>Gestion des badges</p>
        </Link>
        <button className="btn btn-primary capitalize">sauvegarder</button>
      </div>
    </div>
  );
};

export default SkillsHeader;
