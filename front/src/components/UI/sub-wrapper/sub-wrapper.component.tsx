import { ReactNode } from "react";

interface SubWrapperProps {
  hasError?: boolean;
  children: ReactNode;
}

const SubWrapper = (props: SubWrapperProps) => {
  const children = props.children;
  const baseStyle = "flex flex-col gap-y-4 p-4 rounded-lg bg-secondary/10";
  const errorStyle = "border-2 border-red-500";

  return (
    <div className={`${baseStyle} ${props.hasError ? errorStyle : ""}`}>
      {children}
    </div>
  );
};

export default SubWrapper;
