import React, { FC } from "react";

type Props = {
  children: React.ReactNode;
};

const Wrapper: FC<Props> = ({ children }) => {
  return (
    <div className="w-full flex flex-col gap-y-4 p-4 rounded-lg bg-secondary/20">
      {children}
    </div>
  );
};

export default Wrapper;
