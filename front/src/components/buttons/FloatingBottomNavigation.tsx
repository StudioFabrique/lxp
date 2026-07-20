import { useEffect, useRef, useState } from "react";
import Step from "../../utils/interfaces/step";

type Props = {
  actualStep: Step;
  stepsList: Step[];
  handleRetour: () => void;
  handleUpdateStep: (id: number) => void;
};

const FloatingBottomNavigation = ({
  actualStep,
  stepsList,
  handleRetour,
  handleUpdateStep,
}: Props) => {
  const [isFloating, setIsFloating] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const handleNextStep = () => {
    if (actualStep.id !== stepsList.length) {
      handleUpdateStep(actualStep.id);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFloating(entry.isIntersecting);
      },
      {
        root: null,
        threshold: 0.1,
      },
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/*
            On applique 'transition-all duration-500 ease-in-out' pour animer le changement.
            Note : On garde la classe 'border' fixe et on anime sa couleur ('border-base-300' vs 'border-transparent')
            pour éviter que la mise en page ne saute d'un pixel.
          */}
      <div
        className={`sticky bottom-4 z-30 mt-12 w-full p-4 rounded-2xl flex justify-between items-center border transition-all duration-500 ease-in-out ${
          isFloating
            ? "bg-transparent backdrop-blur-none border-transparent shadow-none"
            : "bg-base-200/90 backdrop-blur border-base-300 shadow-xl"
        }`}
      >
        {/* Bouton Retour */}
        <button
          className="btn btn-ghost hover:underline"
          onClick={handleRetour}
        >
          Retour
        </button>

        {/* Bouton Étape suivante */}
        <button className="btn btn-primary px-6" onClick={handleNextStep}>
          Étape suivante
        </button>
      </div>

      {/* L'espion invisible juste en dessous dans le flux HTML */}
      <div ref={sentinelRef} className="h-px w-full" />
    </>
  );
};

export default FloatingBottomNavigation;
