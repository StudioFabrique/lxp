import { PropsWithChildren } from "react";
import { useVisualPreferences } from "../../store/VisualPreferences";

const FadeWrapper = ({ children }: PropsWithChildren) => {
  const { animations } = useVisualPreferences();
  return (
    <div className={animations ? "animate-[fade_1s_ease-in-out]" : undefined}>
      {animations && <style>{`
        @keyframes fade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>}
      {children}
    </div>
  );
};

export default FadeWrapper;
