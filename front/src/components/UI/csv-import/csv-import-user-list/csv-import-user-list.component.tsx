import { csvUsersFields } from "../../../../config/csv/csv-users-fields";
import RightSideDrawer from "../../right-side-drawer/right-side-drawer";
import CsvImport from "../csv-import.component";

const CsvImportUserList = () => {
  const handleImportCsv = (data: any) => {
    console.log(data);
  };
  return (
    <>
      <CsvImport
        style="text"
        origin=""
        onParseCsv={handleImportCsv}
        fields={csvUsersFields}
      />
      <RightSideDrawer
        title="Confirmer la création des étudiants"
        id="add-user"
      >
        <div></div>
      </RightSideDrawer>
    </>
  );
};

export default CsvImportUserList;
