import { ReactNode } from "react";

interface SubWrapperProps {
  children: ReactNode;
}

const SubWrapper = (props: SubWrapperProps) => {
  const children = props.children;

  return (
    <div className="flex flex-col gap-y-4 p-4 rounded-lg bg-secondary/10">
      {children}
    </div>
  );
};

export default SubWrapper;
