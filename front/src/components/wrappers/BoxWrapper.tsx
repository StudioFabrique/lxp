import React, { FC } from "react";

type Props = {
  additionalClassname?: string;
  children: React.ReactNode;
};

const Wrapper: FC<Props> = ({ additionalClassname, children }) => {
  return (
    <div
      className={`flex flex-col gap-y-4 p-5 rounded-lg bg-secondary/20 h-full relative ${additionalClassname}`}
    >
      {children}
    </div>
  );
};

export default Wrapper;
