import { useEffect, useRef, useState } from "react";
import Confetti from "react-confetti";
import { createPortal } from "react-dom";

const PortalConfetti = () => {
  const ref = useRef<Element | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    ref.current = document.querySelector<HTMLElement>("#portal");
    setMounted(true);
  }, []);

  return mounted && ref.current
    ? createPortal(
        <div className="fixed -z-10 top-0 left-0 w-screen h-screen">
          <Confetti className="fixed" />
        </div>,
        ref.current
      )
    : null;
};

export default PortalConfetti;
