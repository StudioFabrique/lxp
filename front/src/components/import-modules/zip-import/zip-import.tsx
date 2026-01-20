import { useState } from "react";
import Header from "../../UI/header";
import MemoizedFileUpload from "../../UI/image-file-upload/image-file-upload";
import PreviewActivitiesFromImport from "./preview-activities-from-import";
import { ModuleImportType } from "../../../views/module/hooks/use-import-modules";
import ModulesImportList from "./modules-import-list";

type Props = { onImportZip: (file: File) => void };

const ZipImport = ({ onImportZip }: Props) => {
  const [moduleToPreview, setModuleToPreview] = useState<ModuleImportType>();

  return (
    <div className="ml-10 flex flex-col item-center gap-4">
      <Header
        title="Première étape"
        description="Téléverser un dossier compressé de format .zip"
      >
        <MemoizedFileUpload
          variant="minimized"
          maxSize={1000000}
          onSetFile={onImportZip}
          fileType="zip"
        />
        <button className="btn ml-5" disabled>
          Confirmer l'importation
        </button>
      </Header>

      <ModulesImportList />

      <PreviewActivitiesFromImport moduleToPreview={moduleToPreview} />

      <Header
        title="Seconde étape"
        description="Selectionner le parcours auquels les modules seront rattachés"
        disabled
      />
    </div>
  );
};

export default ZipImport;
