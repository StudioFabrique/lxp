import { Lightbulb } from "lucide-react";

type Props = {
  isOpen: boolean;
  onDeclineQuiz: () => void;
  onAcceptQuiz: () => void;
};

const QuizRequestModal = ({ isOpen, onAcceptQuiz, onDeclineQuiz }: Props) => {
  return isOpen ? (
    <div className="modal modal-open">
      <div className="modal-box">
        <div className="flex items-center">
          <Lightbulb className="inline mr-2 text-warning" />
          <h3 className="font-bold text-lg">
            Un quiz rapide vous est proposé !
          </h3>
        </div>
        <p className="py-4">
          Vous avez parcouru cette ressource à votre rythme. Souhaitez-vous
          vérifier rapidement vos acquis avant de passer à la suite ?
        </p>
        <div className="modal-action">
          <button className="btn btn-ghost" onClick={onDeclineQuiz}>
            Non merci, continuer
          </button>
          <button
            className="btn btn-primary text-base-100"
            onClick={onAcceptQuiz}
          >
            Faire le quiz
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

export default QuizRequestModal;
