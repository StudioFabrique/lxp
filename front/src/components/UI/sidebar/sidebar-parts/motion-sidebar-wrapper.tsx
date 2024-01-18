import { motion } from "framer-motion";
import { Dispatch, ReactNode, SetStateAction, useContext } from "react";
import { Context } from "../../../../store/context.store";

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
  const { theme } = useContext(Context);

  return (
    <motion.div
      onMouseLeave={() => setIsHover(false)}
      animate={{
        width: isHover ? "auto" : 0,
        opacity: isHover ? 1 : 0,
        visibility: isHover ? "visible" : "hidden",
      }}
      className={`absolute flex gap-x-5 h-11 items-center rounded-r-xl pt-[5px] ${
        theme === "dark" ? "text-white bg-slate-500" : "text-white bg-slate-800"
      }`}
    >
      {children}
    </motion.div>
  );
};

export default MotionSidebarWrapper;
