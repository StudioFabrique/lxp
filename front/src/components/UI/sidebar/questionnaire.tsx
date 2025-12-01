import { ClipboardList } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

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
        <motion.a
          href="https://forms.gle/joWqE48La7S6NqCK8"
          onClick={handleClose}
          target="_blank"
          rel="noopener noreferrer"
          animate={
            showTooltip
              ? {
                  scale: [1, 1.05, 1],
                  x: [0, 2, 0],
                }
              : {
                  scale: 1,
                  x: 0,
                }
          }
          transition={{
            duration: 1.5,
            repeat: showTooltip ? Infinity : 0,
            ease: "easeInOut",
          }}
          className={`flex gap-2 p-1 px-2 rounded-lg hover:bg-primary/50 ${
            showTooltip
              ? "spotlight ring-4 ring-primary ring-offset-2 rounded-full p-2"
              : ""
          }`}
        >
          <span>
            <ClipboardList className="w-4" />
          </span>
          <span className={textSize}>Questionnaire (Bêta Testeurs)</span>
        </motion.a>

        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{
              duration: 0.5,
              ease: "easeOut",
            }}
            className="absolute left-full flex flex-col w-[25vw] top-0 ml-10 bg-base-100 p-4 rounded-xl shadow-lg border border-base-300"
          >
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                delay: 0.3,
                duration: 0.6,
                ease: "easeOut",
              }}
              className="text-base-content font-medium mb-3"
            >
              Merci de donnez votre avis sur la version bêta de l'application
              ANDRIA à tout moment depuis ce formulaire
            </motion.p>
            <div className="flex flex-wrap gap-2 justify-between">
              <motion.a
                whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
                whileTap={{ scale: 0.95, transition: { duration: 0.1 } }}
                onClick={handleClose}
                className="btn btn-primary text-base-100 btn-sm whitespace-pre-wrap w-fit"
                href="https://forms.gle/joWqE48La7S6NqCK8"
                target="_blank"
                rel="noopener noreferrer"
              >
                Donner mon avis maintenant
              </motion.a>
              <motion.button
                whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
                whileTap={{ scale: 0.95, transition: { duration: 0.1 } }}
                onClick={handleClose}
                className="btn btn-secondary text-base-100 btn-sm"
              >
                Fermer
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </li>
  );
};

export default Questionnaire;
