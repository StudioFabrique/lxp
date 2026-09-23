import { PropsWithChildren } from "react";
import { useVisualPreferences } from "../../store/VisualPreferences";
import { cn } from "../../utils/cn";

const FadeWrapper = ({ children }: PropsWithChildren) => {
  const { animations } = useVisualPreferences();
  return (
    <div className={cn(animations ? "animate-[fade_1s_ease-in-out]" : undefined)}>
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
