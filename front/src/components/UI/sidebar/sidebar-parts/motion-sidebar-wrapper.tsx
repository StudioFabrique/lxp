import { motion } from "framer-motion";
import { ReactNode, useContext } from "react";
import { Context } from "../../../../store/context.store";

type MotionSidebarWrapperProps = {
  isHover: boolean;
  children: ReactNode;
};

const MotionSidebarWrapper = ({
  isHover,
  children,
}: MotionSidebarWrapperProps) => {
  const { theme } = useContext(Context);

  return (
    <motion.div
      animate={{
        width: isHover ? "auto" : 0,
        opacity: isHover ? 1 : 0,
        visibility: isHover ? "visible" : "hidden",
      }}
      className={`absolute rounded-r-xl pt-[5px] ${
        theme === "dark" ? "text-white bg-slate-500" : "text-white bg-slate-800"
      }`}
    >
      <div className="flex gap-x-5 h-11 items-center ml-14 mr-4">
        {children}
      </div>
    </motion.div>
  );
};

export default MotionSidebarWrapper;
