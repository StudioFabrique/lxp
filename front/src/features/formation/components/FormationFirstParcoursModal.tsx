import Modal from "../../../components/UI/modal/modal";
import { formatTitle } from "../../../utils/helpers/text-helpers";

type FormationFirstParcoursModalProps = {
  formationTitle: string;
  onAccept: () => void;
  onDecline: () => void;
};

const FormationFirstParcoursModal = ({
  formationTitle,
  onAccept,
  onDecline,
}: FormationFirstParcoursModalProps) => (
  <Modal
    title="Créer votre premier parcours"
    leftLabel="Plus tard"
    rightLabel="Créer le parcours"
    rightClassName="btn-primary"
    onLeftClick={onDecline}
    onRightClick={onAccept}
    modalBoxStyle="max-w-2xl"
  >
    <p className="py-5">
      La formation « {formatTitle(formationTitle)} » a été créée. Souhaitez-vous
      créer dès maintenant son premier parcours ?
    </p>
  </Modal>
);

export default FormationFirstParcoursModal;
