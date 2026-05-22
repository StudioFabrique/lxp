import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import chatbot from "../../assets/images/chatbot.png";
import DrawerChatbot from "./drawerChatbot";

export default function Chatbot() {
  const [showChatbot, setShowChatbot] = useState(false);

  return (
    <>
      {/* Bouton d'ouverture animé */}
      <AnimatePresence>
        {!showChatbot && (
          <motion.button
            className="fixed bottom-6 right-6 w-16 h-16 bg-primary rounded-full p-3 shadow-xl cursor-pointer z-40 flex items-center justify-center hover:shadow-2xl"
            onClick={() => setShowChatbot(!showChatbot)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <img
              src={chatbot}
              alt="Icône chatbot"
              className="w-full h-full object-contain drop-shadow-md"
            />
          </motion.button>
        )}
      </AnimatePresence>

      {/* AnimatePresence permet d'animer le démontage (fermeture) du composant */}
      <AnimatePresence>
        {showChatbot && <DrawerChatbot setShowChatbot={setShowChatbot} />}
      </AnimatePresence>
    </>
  );
}
