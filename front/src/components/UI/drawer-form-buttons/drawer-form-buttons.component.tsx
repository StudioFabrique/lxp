import { FC } from "react";

type Props = {
  onCancel: () => void;
};

const DrawerFormButtons: FC<Props> = ({ onCancel }) => {
  return (
    <div className="w-full flex justify-between mt-4">
      <button
        className="btn btn-outline btn-sm btn-primary font-normal w-32"
        type="reset"
        onClick={onCancel}
      >
        Annuler
      </button>
      <button className="btn btn-primary btn-sm w-32">Valider</button>
    </div>
  );
};

export default DrawerFormButtons;
