import Header from "../UI/header";
import MemoizedFileUpload from "../UI/image-file-upload/image-file-upload";

type Props = { onImportZip: (file: File) => void };

const ZipImport = ({ onImportZip }: Props) => {
  return (
    <div className="ml-10 flex flex-col gap-4">
      <Header
        title="Première étape"
        description="Téléverser un dossier compressé de format .zip"
      />
      <MemoizedFileUpload
        variant="minimized"
        maxSize={1000000}
        onSetFile={onImportZip}
        fileType="zip"
      />
      <Header
        title="Seconde étape"
        description="Importer des modules ainsi que tous les cours, leçons et activités associés."
      />
    </div>
  );
};

export default ZipImport;
