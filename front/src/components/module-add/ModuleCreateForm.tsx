import CustomError from "../../utils/interfaces/custom-error";
import ModuleMetadatas from "../../views/module/add/module-metadatas";
import { Item } from "../../views/module/add/useAddModule";
import Selecter from "../UI/selecter/selecter.component";

type Props = {
  formationId: number | null;
  formationList: Item[];
  data: {
    values: Record<string, unknown>;
    onChangeValue: (field: string, value: unknown) => void;
    errors: CustomError[];
  };
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onPickFormation: (id: number) => void;
  onSetFile: (file: File | null) => void;
  setImageBase64: (base64: string | null) => void;
  toggleModal: () => void;
  newModuleData: Record<string, unknown> | null;
};

export default function ModuleCreateForm(props: Props) {
  return (
    <>
      <h2 className="text-sm">
        Choisissez une formation à laquelle attacher le module
      </h2>
      <Selecter
        defaultItem={{ id: props.formationId ?? 0, title: "" }}
        list={props.formationList}
        title="Choisissez une formation"
        onSelectItem={props.onPickFormation}
      />

      <form onSubmit={props.onSubmit} ref={null}>
        <ModuleMetadatas
          data={props.data}
          thumb={null}
          onSetFile={props.onSetFile}
          mode="create"
          onSetImageBase64={props.setImageBase64}
        />
        <div className="flex justify-end">
          <span className="flex items-center gap-x-4 mt-4">
            <button
              className="btn btn-outline btn-secondary"
              type="button"
              onClick={props.toggleModal}
              disabled={!!props.newModuleData}
            >
              Annuler
            </button>
            <button
              className="btn btn-primary"
              type="submit"
              disabled={!!props.newModuleData}
            >
              Enregistrer
            </button>
          </span>
        </div>
      </form>
    </>
  );
}
