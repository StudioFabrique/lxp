import { PropsWithChildren } from "react";

const FadeWrapper = ({ children }: PropsWithChildren) => {
  return (
    <div className="animate-[fade_1s_ease-in-out]">
      <style>{`
        @keyframes fade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
      {children}
    </div>
  );
};

export default FadeWrapper;
