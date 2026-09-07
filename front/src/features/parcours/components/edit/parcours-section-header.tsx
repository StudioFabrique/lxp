import { FC } from "react";
import { Lock } from "lucide-react";

import ButtonNoDecorationIcon from "../../../../components/UI/button-no-decoration-icon/button-no-decoration-icon.component";

import ImportIcon from "../../../../../src/components/UI/svg/import-icon.component";

type Props = {
  label: string;
  onImport: () => void;
  disabled?: boolean;
};

const ParcoursSectionHeader: FC<Props> = ({ label, onImport, disabled }) => {
  return (
    <div className="w-full flex justify-between items-center pr-2">
      <div
        className={
          disabled ? "text-base-content/60" : "text-primary hover:underline"
        }
      >
        <ButtonNoDecorationIcon
          label={label}
          onClickEvent={onImport}
          disabled={disabled}
        >
          {disabled ? <Lock className="h-4 w-4" /> : <ImportIcon size={4} />}
        </ButtonNoDecorationIcon>
      </div>
    </div>
  );
};

export default ParcoursSectionHeader;
