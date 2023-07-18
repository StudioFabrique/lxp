import { useDispatch } from "react-redux";

import CsvImportSkills from "./csv-import-skills.component";
import { parcoursAction } from "../../store/redux-toolkit/parcours";
import { FC, useCallback } from "react";
import DbImportSkills from "./db-import-skills.component";

type Props = {
  //fromDB: boolean;
  onFromDB: (value: boolean) => void;
};

const ImpoortSkillsActions: FC<Props> = ({ onFromDB }) => {
  const dispatch = useDispatch();

  const storeSkills = useCallback(
    (data: any) => {
      dispatch(parcoursAction.importSkills(data));
    },
    [dispatch]
  );

  const handleFromCSV = useCallback(
    (data: any) => {
      storeSkills(data);
      onFromDB(false);
    },
    [onFromDB, storeSkills]
  );

  const handleFromDB = (data: any) => {
    storeSkills(data);
    onFromDB(true);
  };

  return (
    <div className="flex gap-x-4 justify-evenly">
      <CsvImportSkills onParseCsv={handleFromCSV} />
      <DbImportSkills onFetchSkills={handleFromDB} />
    </div>
  );
};

export default ImpoortSkillsActions;
