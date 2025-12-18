import { ClipboardList } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

type Props = { textSize?: "text-sm" | "text-lg" };

const Questionnaire = ({ textSize = "text-sm" }: Props) => {
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      const hasClosedQuestionnaire = localStorage.getItem(
        "hasClosedQuestionnaire"
      );
      if (!hasClosedQuestionnaire) {
        setShowTooltip(true);
      }
    }, 30000);
  }, []);

  const handleClose = () => {
    localStorage.setItem("hasClosedQuestionnaire", "true");
    setShowTooltip(false);
  };

  return (
    <li>
      <div className="relative z-50">
        <Link
          to="https://forms.gle/joWqE48La7S6NqCK8"
          onClick={handleClose}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex gap-2 p-1 px-2 rounded-lg hover:bg-primary/50 ${
            showTooltip
              ? "ring-2 ring-primary ring-offset-1 rounded-full p-2 animate-pulse"
              : ""
          }`}
        >
          <span>
            <ClipboardList className="w-4" />
          </span>
          <span className={`xl:block hidden ${textSize}`}>
            Questionnaire (Bêta Testeurs)
          </span>
        </Link>

        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{
              duration: 0.5,
              ease: "easeOut",
            }}
            className="absolute left-full flex flex-col w-[25vw] bottom-0 ml-5 bg-primary p-4 rounded-xl shadow-lg border border-base-300"
          >
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                delay: 0.3,
                duration: 0.6,
                ease: "easeOut",
              }}
              className="font-medium mb-3 text-base-200"
            >
              Merci de donnez votre avis sur la version bêta de l'application
              ANDRIA à tout moment depuis ce formulaire
            </motion.p>
            <div className="flex flex-wrap gap-2 justify-between">
              <Link
                onClick={handleClose}
                className="btn btn-sm whitespace-pre-wrap w-fit"
                to="https://forms.gle/joWqE48La7S6NqCK8"
                target="_blank"
                rel="noopener noreferrer"
              >
                Donner mon avis maintenant
              </Link>
              <button
                onClick={handleClose}
                className="btn btn-secondary btn-sm text-base-100"
              >
                Fermer
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </li>
  );
};

export default Questionnaire;
