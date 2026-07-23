import FileUpload from "../../../../../../components/UI/file-upload/FileUpload";

type props = {
  value: string;
  onChange: (value: string) => void;
  onFileChange: (file: File) => void;
};

function ResourceForm({ value, onChange, onFileChange }: props) {
  return (
    <span className="h-full flex flex-col gap-y-2">
      <h2 className="text-lg font-bold">Ressources</h2>
      <form className="flex flex-col justify-around h-full gap-y-4">
        <span className="flex flex-col gap-y-4">
          <label htmlFor="name" className="text-sm font-bold">
            Nom du lien *
          </label>
          <input
            id="name"
            name="name"
            className="input input-bordered w-full focus:outline-none"
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        </span>
        <FileUpload
          compact
          fileType="document"
          buttonLabel="Ajouter une ressource"
          helperText="PDF, Office, texte ou Markdown"
          onFileSelect={onFileChange}
          disabled={!value || value.length === 0}
        />
      </form>
    </span>
  );
}

export default ResourceForm;
