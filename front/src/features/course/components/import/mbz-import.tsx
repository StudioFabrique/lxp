import Header from "../../../../components/headers/Header";
import FileUpload from "../../../../components/UI/file-upload/FileUpload";

type Props = {
  error?: string;
  isLoading?: boolean;
  onImportMbz: (file: File) => void;
};

const MbzImport = ({ error, isLoading, onImportMbz }: Props) => {
  const headerDescription = error
    ? error
    : "Téléverser un cours compressé au format .mbz";

  return (
    <div
      className="flex flex-col gap-6 ml-5"
      data-course-import-tour="workflow"
    >
      <div data-course-import-tour="upload">
        <Header
          title="Première étape"
          isSubHeader
          description={headerDescription}
          alternateBgColor
          hasError={Boolean(error)}
        >
          <FileUpload
            compact
            buttonLabel="Importer un fichier .mbz"
            maxSize={50 * 1024 * 1024} // 50 Mo
            onFileSelect={onImportMbz}
            fileType="mbz"
            isLoading={isLoading}
          />
        </Header>
      </div>
      <Header
        title="Seconde étape"
        description="Sélectionner le contenu pédagogique à importer"
        disabled
        isSubHeader
      />
      <Header
        title="Dernière étape"
        description="Sélectionner le parcours auquels les cours seront rattachés"
        disabled
        isSubHeader
      />
    </div>
  );
};

export default MbzImport;
