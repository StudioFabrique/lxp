import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot } from "lucide-react";
import DrawerChatbot from "./DrawerChatbot";

export default function Chatbot() {
  const [showChatbot, setShowChatbot] = useState(false);

  return (
    <>
      {/* Bouton d'ouverture animé */}
      <AnimatePresence>
        {!showChatbot && (
          <div className="group fixed bottom-6 right-6 flex items-center z-40">
            {/* Bulle de dialogue moderne au survol */}
            <div className="absolute right-20 mr-2 whitespace-nowrap bg-base-100 text-base-content text-sm font-medium px-4 py-3 rounded-2xl shadow-xl border border-base-200 pointer-events-none opacity-0 translate-x-2 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-x-0 hidden sm:block">
              <span className="text-info">Besoin d'aide ?</span>
              <span> Le chatbot </span>
              <span className="text-info font-bold">ANDRIA</span>
              <span> est là pour vous aider.</span>
              {/* Petite flèche (triangle) de la bulle pointant vers le bouton */}
              <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-base-100 border-t border-r border-base-200 rotate-45" />
            </div>

            {/* Bouton du Chatbot */}
            <motion.button
              className="w-16 h-16 bg-primary rounded-full p-3 shadow-xl cursor-pointer flex items-center justify-center hover:shadow-2xl relative"
              onClick={() => setShowChatbot(!showChatbot)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: 40, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.95 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <Bot className="w-full h-full object-contain text-primary-content" />
            </motion.button>
          </div>
        )}
      </AnimatePresence>

      {/* AnimatePresence permet d'animer le démontage (fermeture) du composant */}
      <AnimatePresence>
        {showChatbot && <DrawerChatbot setShowChatbot={setShowChatbot} />}
      </AnimatePresence>
    </>
  );
}
