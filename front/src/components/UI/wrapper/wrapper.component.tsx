import React, { FC } from "react";

type Props = {
  children: React.ReactNode;
};

const Wrapper: FC<Props> = ({ children }) => {
  return (
    <div className="h-full flex flex-col gap-y-6 p-6 rounded-lg bg-secondary/20">
      {children}
    </div>
  );
};

export default Wrapper;
