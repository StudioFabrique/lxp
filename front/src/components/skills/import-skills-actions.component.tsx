import { useDispatch } from "react-redux";

import CsvImportSkills from "./csv-import-skills.component";
import { parcoursAction } from "../../store/redux-toolkit/parcours";
import { FC, useCallback } from "react";

type Props = {
  onFromDB: () => void;
};

const ImpoortSkillsActions: FC<Props> = ({ onFromDB }) => {
  const dispatch = useDispatch();

  const storeParsedCsv = useCallback(
    (parsedData: any) => {
      dispatch(parcoursAction.importCsvSkills(parsedData));
    },
    [dispatch]
  );

  return (
    <div className="flex justify-between">
      <CsvImportSkills onParseCsv={storeParsedCsv} />
    </div>
  );
};

export default ImpoortSkillsActions;
