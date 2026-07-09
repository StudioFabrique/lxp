import Header from "../../components/headers/Header";
import MemoizedFileUpload from "../../components/UI/image-file-upload/image-file-upload";

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
    <div className="flex flex-col gap-6 ml-5">
      <Header
        title="Première étape"
        isSubHeader
        description={headerDescription}
        alternateBgColor
        hasError={Boolean(error)}
      >
        <MemoizedFileUpload
          buttonLabel="Importer un fichier .mbz"
          variant="minimized"
          maxSize={50 * 1024 * 1024} // 100 Mo
          onSetFile={onImportMbz}
          fileType="mbz"
          isLoading={isLoading}
        />
      </Header>
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
