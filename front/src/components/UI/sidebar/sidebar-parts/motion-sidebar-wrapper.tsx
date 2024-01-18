import { motion } from "framer-motion";
import { Dispatch, ReactNode, SetStateAction } from "react";

type MotionSidebarWrapperProps = {
  isHover: boolean;
  setIsHover: Dispatch<SetStateAction<boolean>>;
  children: ReactNode;
};

const MotionSidebarWrapper = ({
  isHover,
  setIsHover,
  children,
}: MotionSidebarWrapperProps) => {
  return (
    <motion.div
      onMouseLeave={() => setIsHover(false)}
      animate={{
        width: isHover ? "auto" : 0,
        opacity: isHover ? 1 : 0,
        visibility: isHover ? "visible" : "hidden",
      }}
      className="absolute flex gap-x-5 h-11 items-center -translate-y-2 -translate-x-2 rounded-r-xl text-white bg-slate-800"
    >
      {children}
    </motion.div>
  );
};

export default MotionSidebarWrapper;
