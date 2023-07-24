import { FC, MouseEvent, MouseEventHandler } from "react";

const CsvImport: FC<{ onImportUsers: (users: Array<any>) => void }> = ({
  onImportUsers,
}) => {
  const handleClick: MouseEventHandler<HTMLButtonElement> = (
    event: MouseEvent<HTMLButtonElement>
  ) => {};

  return (
    <button onClick={handleClick} type="button" className="btn btn-primary">
      Importer les utilisateur en CSV
    </button>
  );
};

export default CsvImport;
