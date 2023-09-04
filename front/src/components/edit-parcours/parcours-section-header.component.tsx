import { FC } from "react";

import ButtonNoDecorationIcon from "../UI/button-no-decoration-icon/button-no-decoration-icon.component";

import ImportIcon from "../UI/svg/import-icon.component";

type Props = {
  label: string;
  onImport: () => void;
};

const ParcoursSectionHeader: FC<Props> = ({ label, onImport }) => {
  return (
    <div className="w-full flex justify-between items-center pr-2">
      <div className="text-primary hover:underline">
        <ButtonNoDecorationIcon label={label} onClickEvent={onImport}>
          <ImportIcon size={4} />
        </ButtonNoDecorationIcon>
      </div>
    </div>
  );
};

export default ParcoursSectionHeader;
